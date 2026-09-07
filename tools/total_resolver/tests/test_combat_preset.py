from pathlib import Path
import json
import sqlite3
import tempfile
import unittest
from unittest.mock import Mock, patch
from types import SimpleNamespace

from tools.total_resolver.focused_capture import (
    COMBAT_SELECTOR_PROFILE_ID, CUTSCENE_STUDIO_PROFILE_ID, COMBAT_SELECTOR_SIGNATURE,
    resolve_focused_profile,
)
from tools.total_resolver.capture_gui import (
    CaptureWorkflowController, CaptureGuiLog, bind_profile_selector, FOCUSED_PRESET_LABELS,
)
from tools.total_resolver.recorder import Pj64CaptureRecorder, RecorderSettings
from tools.total_resolver.capture_db import CaptureStore
from tools.total_resolver.sessions import _run_capture_window, _metadata, SessionConnection
from tools.total_resolver.tests.test_focused_capture import TARGET_STARTS
from tools.total_resolver.tests.test_recorder import FakeClient, FakeClock, make_rom, metadata


class CombatPresetTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.rom = self.root / 'fixture.z64'
        payload = bytearray(0x2AA000)
        payload[:4] = bytes.fromhex('80371240')
        payload[0x201778:0x201798] = COMBAT_SELECTOR_SIGNATURE
        self.rom.write_bytes(payload)
        self.db = sqlite3.connect(':memory:')
        self.db.row_factory = sqlite3.Row
        self.addCleanup(self.db.close)
        self.db.executescript('''
            CREATE TABLE knowledge_meta(key TEXT PRIMARY KEY, value TEXT);
            CREATE TABLE static_function(function_id INTEGER PRIMARY KEY, structural_name TEXT,
                z64_start INTEGER, z64_end_exclusive INTEGER);
            CREATE TABLE function_placement_fact(function_placement_id INTEGER PRIMARY KEY,
                function_id INTEGER, source_z64_start INTEGER, source_z64_end_exclusive INTEGER,
                destination_physical_start INTEGER, destination_physical_end_exclusive INTEGER);
        ''')
        self.db.executemany('INSERT INTO knowledge_meta VALUES(?,?)',
                           [('schemaVersion','5'),('romPath',str(self.rom))])
        for i, start in enumerate((*TARGET_STARTS, 0x201778),1):
            size = 32 if start == 0x201778 else 64
            phys = 0x1BE2E8 if size == 32 else 0x1000 + i * 0x100
            self.db.execute('INSERT INTO static_function VALUES(?,?,?,?)',
                            (i,f'func_{start:08X}',start,start+size))
            self.db.execute('INSERT INTO function_placement_fact VALUES(?,?,?,?,?,?)',
                            (i,i,start,start+size,phys,phys+size))

    def test_distinct_presets_and_legacy_serialization(self):
        combat = resolve_focused_profile(self.db, COMBAT_SELECTOR_PROFILE_ID)
        cutscene = resolve_focused_profile(self.db, CUTSCENE_STUDIO_PROFILE_ID)
        self.assertEqual(len(combat.watches),1)
        self.assertEqual(len(cutscene.watches),11)
        self.assertEqual(combat.watches[0].signature_bytes,COMBAT_SELECTOR_SIGNATURE)
        self.assertEqual((combat.watches[0].pointers,combat.watches[0].stack_words),((),0))
        self.assertEqual(combat.watches[0].sample_mode,'all')
        self.assertEqual([(w.address,w.size) for w in combat.instruction_watches()],[(0x801BE2E8,32)])
        self.assertEqual(cutscene.instruction_watches(),())
        self.assertNotIn('maximumSeconds',cutscene.to_dict())
        self.assertNotIn('instructionContextWatches',cutscene.to_dict())
        self.assertEqual(combat.to_dict()['maximumSeconds'],60)
        self.assertIn('before the jr-ra delay slot',combat.to_dict()['capturePolicy']['returnPhase'])

    def test_identity_and_placement_rejections(self):
        with self.assertRaisesRegex(ValueError,'unsupported'):
            resolve_focused_profile(self.db,'wrong')
        data=bytearray(self.rom.read_bytes());data[0x20177C]^=1;self.rom.write_bytes(data)
        with self.assertRaisesRegex(ValueError,'signature'):
            resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        data[0x20177C]^=1;self.rom.write_bytes(data)
        self.db.execute('UPDATE static_function SET z64_end_exclusive=z64_end_exclusive+4 WHERE z64_start=?',(0x201778,))
        with self.assertRaisesRegex(ValueError,'size'):
            resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        self.db.execute('UPDATE static_function SET z64_end_exclusive=z64_end_exclusive-4 WHERE z64_start=?',(0x201778,))
        self.db.execute('UPDATE function_placement_fact SET source_z64_end_exclusive=source_z64_end_exclusive-4 WHERE source_z64_start=?',(0x201778,))
        with self.assertRaisesRegex(ValueError,'placement'):
            resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)

    def test_incomplete_destination_is_not_a_qualified_placement(self):
        self.db.execute('UPDATE function_placement_fact SET destination_physical_end_exclusive=destination_physical_start+4 WHERE source_z64_start=?',(0x201778,))
        with self.assertRaisesRegex(ValueError,'placement'):
            resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)

    def test_deduplicated_and_relocated_watch_ranges(self):
        self.db.execute('INSERT INTO function_placement_fact SELECT 99,function_id,source_z64_start,source_z64_end_exclusive,destination_physical_start,destination_physical_end_exclusive FROM function_placement_fact WHERE source_z64_start=?',(0x201778,))
        profile=resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        self.assertEqual(len(profile.watches),1)
        self.db.execute('UPDATE function_placement_fact SET destination_physical_start=12288,destination_physical_end_exclusive=12320 WHERE function_placement_id=99')
        profile=resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        self.assertEqual({w.address for w in profile.instruction_watches()},{0x80003000,0x801BE2E8})

    def test_actual_recorder_installs_both_combat_watches_and_removes_only_owned(self):
        profile=resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        identity=make_rom(self.root/'runtime.z64')
        client=FakeClient(self.root/'runtime.z64')
        client.install_watch=Mock(wraps=client.install_watch)
        client.install_focused_watch=Mock(wraps=client.install_focused_watch)
        client.remove_watch=Mock(wraps=client.remove_watch)
        store=CaptureStore.create(self.root/'session/capture.sqlite',metadata(identity))
        self.addCleanup(store.close_connection)
        recorder=Pj64CaptureRecorder(client,store,RecorderSettings(identity['normalizedSha256'],
            focused_watches=profile.watches,watches=profile.instruction_watches()),clock=FakeClock())
        recorder.start()
        self.assertEqual(client.install_watch.call_args.args,('exec',0x801BE2E8))
        self.assertEqual(client.install_watch.call_args.kwargs['size'],32)
        self.assertEqual(client.install_focused_watch.call_args.kwargs['profile_id'],COMBAT_SELECTOR_PROFILE_ID)
        self.assertEqual(client.install_focused_watch.call_args.kwargs['signature_bytes'],COMBAT_SELECTOR_SIGNATURE)
        rows=store.connection.execute("SELECT definition_source FROM watch_definition WHERE definition_source LIKE 'total-resolver:focused-profile:combat%'").fetchall()
        self.assertEqual(len(rows),2)
        recorder.stop_instrumentation()
        self.assertEqual([c.args[0] for c in client.remove_watch.call_args_list],[2,1])

    def test_budget_stops_without_runtime_control_and_cutscene_stays_unbounded(self):
        profile=resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        recorder=Mock()
        def run(**kw):
            self.assertFalse(kw['should_stop']())
            self.assertTrue(kw['should_stop']())
        recorder.run.side_effect=run
        with patch('tools.total_resolver.sessions.time.monotonic',side_effect=[100,159,160]):
            _run_capture_window(recorder,profile)
        recorder=Mock()
        _run_capture_window(recorder,resolve_focused_profile(self.db,CUTSCENE_STUDIO_PROFILE_ID))
        recorder.run.assert_called_once_with()

    def test_metadata_preserves_effective_preset_and_instruction_context(self):
        profile=resolve_focused_profile(self.db,COMBAT_SELECTOR_PROFILE_ID)
        preflight=SimpleNamespace(rom_identity={},bridge_version='0.17.0',bridge_port=64656,
            bridge_epoch='TEST',bridge_next_sequence=1,cpu_core='interpreter')
        frontier=SimpleNamespace(identity='TEST',summary=lambda:{'frontierIdentity':'TEST'})
        with patch('tools.total_resolver.sessions._git_identity',return_value={'commit':None,'dirty':False,'branch':None}):
            result=_metadata(preflight,SessionConnection(port=64656),'TEST',frontier,profile)
        encoded=json.loads(json.dumps(result.static_sources))['captureProfile']['focusedCapture']
        self.assertEqual(encoded['profileId'],COMBAT_SELECTOR_PROFILE_ID)
        self.assertEqual(encoded['instructionContextWatches'][0]['size'],32)
        self.assertEqual(encoded['targets'][0]['z64Start'],0x201778)

    def test_dropdown_persists_selection_rebinds_and_does_not_touch_active_session(self):
        controller=CaptureWorkflowController(root=self.root/'sessions',knowledge_database=self.root/'knowledge',
                                            log=CaptureGuiLog(self.root/'gui.log'))
        controller.session_id='EXISTING-USER-SESSION'
        controller.select_focused_profile(COMBAT_SELECTOR_PROFILE_ID)
        value=SimpleNamespace(value='',set=lambda x: setattr(value,'value',x),get=lambda:value.value)
        widget=Mock()
        bind_profile_selector(widget,value,controller)
        self.assertIn('Combat',value.get())
        value.set('Cutscene Studio');widget.bind.call_args.args[1]()
        self.assertEqual(controller.selected_focused_profile,CUTSCENE_STUDIO_PROFILE_ID)
        bind_profile_selector(widget,value,controller)
        self.assertEqual(value.get(),'Cutscene Studio')
        self.assertEqual(controller.session_id,'EXISTING-USER-SESSION')
        with patch('tools.total_resolver.capture_gui.create_session') as create:
            with self.assertRaisesRegex(ValueError,'unsupported'):
                controller.start(focused_profile_id='')
            create.assert_not_called()
        controller.session_id=None
        for label,profile_id in FOCUSED_PRESET_LABELS.items():
            value.set(label);widget.bind.call_args.args[1]()
            with patch('tools.total_resolver.capture_gui.create_session',return_value={'sessionId':'NEW'}) as create:
                controller.start(focused=True)
            self.assertEqual(create.call_args.kwargs['focused_profile_id'],profile_id)
            self.assertFalse(create.call_args.kwargs['auto_ingest'])
            controller.session_id=None


if __name__=='__main__':
    unittest.main()
