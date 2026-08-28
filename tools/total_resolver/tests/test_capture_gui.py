from __future__ import annotations

from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

from tools.total_resolver.capture_gui import (
    CAPTURE_GUI_DEFAULT_PORT,
    CaptureGuiLog,
    CaptureWorkflowController,
)
from tools.total_resolver.cli import build_parser
from tools.total_resolver.inventory import ActiveProject64Binary
from tools.total_resolver.sessions import SessionConnection


class CaptureGuiControllerTests(unittest.TestCase):
    def test_gui_command_defaults_to_the_deployed_bridge_port(self) -> None:
        args = build_parser().parse_args(["gui"])
        self.assertEqual(args.port, CAPTURE_GUI_DEFAULT_PORT)

    def test_controller_defers_ingestion_until_human_name(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            knowledge = root / "knowledge.sqlite"
            knowledge.touch()
            log = CaptureGuiLog(root / "capture-gui.log")
            controller = CaptureWorkflowController(
                root=root / "sessions",
                knowledge_database=knowledge,
                connection=SessionConnection("127.0.0.1", 64640, 1.0),
                log=log,
            )
            started = {
                "sessionId": "SESSION-1",
                "sessionDirectory": str(root / "sessions" / "SESSION-1"),
                "state": "running",
            }
            stopped = {
                "sessionId": "SESSION-1",
                "closureStatus": "closed",
                "workerAlive": False,
                "workerState": "closed-awaiting-ingest",
            }
            semantic = {"result": "PASS", "sessionId": "SESSION-1"}
            ingestion = {
                "result": "PASS",
                "action": "ingested",
                "sessionId": "SESSION-1",
            }
            recorded = {"workerState": "closed", "ingestion": ingestion}
            with (
                patch(
                    "tools.total_resolver.capture_gui.create_session",
                    return_value=started,
                ) as create_mock,
                patch(
                    "tools.total_resolver.capture_gui.request_session_stop",
                    return_value=stopped,
                ),
                patch(
                    "tools.total_resolver.capture_gui.set_session_semantic_context",
                    return_value=semantic,
                ) as semantic_mock,
                patch(
                    "tools.total_resolver.capture_gui.ingest_session",
                    return_value=ingestion,
                ) as ingest_mock,
                patch(
                    "tools.total_resolver.capture_gui.record_session_ingestion",
                    return_value=recorded,
                ),
            ):
                controller.start(before_rom=True)
                controller.stop(wait_seconds=1.0)
                result = controller.name_and_ingest(
                    "Neutral encounter and persuasion", notes="successful Talk"
                )

            self.assertFalse(create_mock.call_args.kwargs["auto_ingest"])
            self.assertTrue(create_mock.call_args.kwargs["before_rom"])
            semantic_mock.assert_called_once_with(
                "SESSION-1",
                "Neutral encounter and persuasion",
                notes="successful Talk",
                root=(root / "sessions").resolve(),
            )
            ingest_mock.assert_called_once_with(
                knowledge.resolve(), (root / "sessions" / "SESSION-1").resolve()
            )
            self.assertEqual(result["status"], recorded)
            self.assertIn("Capture integrated successfully", log.read())

    def test_focused_start_and_single_note_use_the_bounded_context_window(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            knowledge = root / "knowledge.sqlite"
            knowledge.touch()
            controller = CaptureWorkflowController(
                root=root / "sessions",
                knowledge_database=knowledge,
                connection=SessionConnection("127.0.0.1", 64640, 1.0),
                log=CaptureGuiLog(root / "capture-gui.log"),
            )
            with patch(
                "tools.total_resolver.capture_gui.create_session",
                return_value={"sessionId": "FOCUSED-1", "state": "running"},
            ) as create_mock:
                started = controller.start(focused=True)
            self.assertEqual(started["sessionId"], "FOCUSED-1")
            self.assertEqual(
                create_mock.call_args.kwargs["focused_profile_id"],
                "cutscene-studio-v1",
            )
            self.assertFalse(create_mock.call_args.kwargs["auto_ingest"])

            with (
                patch(
                    "tools.total_resolver.capture_gui.session_status",
                    return_value={"closureStatus": "open", "workerAlive": True},
                ),
                patch(
                    "tools.total_resolver.capture_gui.add_session_annotation",
                    return_value={"markerId": 7},
                ) as note_mock,
            ):
                note = controller.add_note("chair changed pose")
            self.assertEqual(note["action"], "note-added")
            self.assertEqual(note_mock.call_args.kwargs["frame_context_before"], 60)
            self.assertEqual(note_mock.call_args.kwargs["frame_context_after"], 30)
            self.assertEqual(note_mock.call_args.kwargs["context_before"], 256)
            self.assertEqual(note_mock.call_args.kwargs["context_after"], 256)

    def test_project64_button_launches_only_the_authenticated_binary_once(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            binary = root / "Project64-TR-CallAware.exe"
            bridge = root / "Scripts" / "000_ob64_pj64_bridge.js"
            active = ActiveProject64Binary(
                binary,
                "A" * 64,
                root,
                bridge,
                "B" * 64,
                CAPTURE_GUI_DEFAULT_PORT,
            )
            process = Mock(pid=4242)
            process.poll.return_value = None
            log = CaptureGuiLog(root / "capture-gui.log")
            controller = CaptureWorkflowController(root=root / "sessions", log=log)
            with (
                patch(
                    "tools.total_resolver.capture_gui.resolve_active_project64_binary",
                    return_value=active,
                ) as resolve_mock,
                patch(
                    "tools.total_resolver.capture_gui.subprocess.Popen",
                    return_value=process,
                ) as popen_mock,
            ):
                launched = controller.launch_project64()
                repeated = controller.launch_project64()
            resolve_mock.assert_called_once_with(project64_root=None)
            popen_mock.assert_called_once()
            self.assertEqual(popen_mock.call_args.args[0], (str(binary),))
            self.assertEqual(popen_mock.call_args.kwargs["cwd"], str(root))
            self.assertEqual(launched["action"], "launched-authenticated-project64")
            self.assertEqual(launched["bridgeScript"], str(bridge))
            self.assertEqual(launched["bridgeScriptSha256"], "B" * 64)
            self.assertEqual(repeated["action"], "already-running-from-this-gui")
            self.assertIn("Authenticated Project64", log.read())

    def test_project64_button_rejects_runtime_bridge_port_mismatch_before_launch(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            binary = root / "Project64-TR-CallAware.exe"
            active = ActiveProject64Binary(
                binary,
                "A" * 64,
                root,
                root / "000_ob64_pj64_bridge.js",
                "B" * 64,
                64640,
            )
            controller = CaptureWorkflowController(
                root=root / "sessions",
                connection=SessionConnection(
                    "127.0.0.1", CAPTURE_GUI_DEFAULT_PORT, 1.0
                ),
                log=CaptureGuiLog(root / "capture-gui.log"),
            )
            with (
                patch(
                    "tools.total_resolver.capture_gui.resolve_active_project64_binary",
                    return_value=active,
                ),
                patch("tools.total_resolver.capture_gui.subprocess.Popen") as popen_mock,
            ):
                with self.assertRaisesRegex(RuntimeError, "does not match the GUI"):
                    controller.launch_project64()
            popen_mock.assert_not_called()

    def test_failed_stop_includes_worker_log_tail_in_attachable_log(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            sessions = root / "sessions"
            worker_log = sessions / "SESSION-FAIL" / "session.log"
            worker_log.parent.mkdir(parents=True)
            worker_log.write_text("synthetic worker failure\n", encoding="utf-8")
            log = CaptureGuiLog(root / "capture-gui.log")
            controller = CaptureWorkflowController(root=sessions, log=log)
            controller.session_id = "SESSION-FAIL"
            with patch(
                "tools.total_resolver.capture_gui.request_session_stop",
                return_value={"closureStatus": "open", "workerAlive": True},
            ):
                with self.assertRaisesRegex(TimeoutError, "verified normal stop"):
                    controller.stop(wait_seconds=0.0)
            text = log.read()
            self.assertIn("synthetic worker failure", text)
            self.assertIn("worker log tail", text)

    def test_new_capture_cannot_hide_a_closed_unintegrated_capture(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            controller = CaptureWorkflowController(
                root=root / "sessions",
                knowledge_database=root / "knowledge.sqlite",
                log=CaptureGuiLog(root / "capture-gui.log"),
            )
            controller.session_id = "SESSION-PENDING"
            pending = {
                "sessionId": "SESSION-PENDING",
                "closureStatus": "closed",
                "workerAlive": False,
                "ingestion": None,
            }
            with (
                patch(
                    "tools.total_resolver.capture_gui.session_status",
                    return_value=pending,
                ),
                patch("tools.total_resolver.capture_gui.create_session") as create_mock,
            ):
                with self.assertRaisesRegex(RuntimeError, "previous capture"):
                    controller.start()
            create_mock.assert_not_called()


if __name__ == "__main__":
    unittest.main()
