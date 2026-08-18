from __future__ import annotations

from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from tools.total_resolver.capture_db import CaptureStore
from tools.total_resolver.live_resolver import (
    build_bridge_context_bundle,
    build_event_bundle,
    replay_bridge_context_bundle,
    replay_event_bundle,
)
from tools.total_resolver.tests.test_capture_lifecycle import metadata, raw_event


def create_raw_session(root: Path) -> None:
    session_dir = root / "S"
    store = CaptureStore.create(session_dir / "capture.sqlite", metadata("S"))
    store.append_event_batch(
        (
            raw_event(
                stream="watch",
                stream_sequence=1,
                batch_index=0,
                host_ns=100,
                kind="exec",
            ),
        )
    )
    store.close_connection()


class LiveResolverTests(unittest.TestCase):
    def test_raw_event_survives_resolver_failure(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            sessions = root / "sessions"
            create_raw_session(sessions)
            with patch(
                "tools.total_resolver.live_resolver.derive_live_snapshot",
                return_value=object(),
            ), patch(
                "tools.total_resolver.live_resolver._enrich_raw_event",
                side_effect=RuntimeError("resolver unavailable"),
            ):
                result = build_event_bundle(
                    "S",
                    sequence_id=1,
                    sessions_directory=sessions,
                    output_directory=root / "bundles",
                )
            bundle = Path(result["bundleDirectory"])
            self.assertEqual(result["result"], "PARTIAL")
            self.assertTrue(result["rawPreserved"])
            self.assertTrue((bundle / "raw-event.json").is_file())
            self.assertFalse((bundle / "derived.json").exists())
            self.assertIn("resolver unavailable", result["manifest"]["error"])

    def test_saved_bundle_reproduces_offline(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            sessions = root / "sessions"
            create_raw_session(sessions)
            enrichment = {
                "schema": "fixture-live-enrichment.v1",
                "reviewState": "live-unreviewed",
                "mapping": {"status": "resolved-function", "functionId": 1},
            }
            with patch(
                "tools.total_resolver.live_resolver.derive_live_snapshot",
                return_value=object(),
            ), patch(
                "tools.total_resolver.live_resolver._enrich_raw_event",
                return_value=enrichment,
            ):
                built = build_event_bundle(
                    "S",
                    sequence_id=1,
                    sessions_directory=sessions,
                    output_directory=root / "bundles",
                )
                replayed = replay_event_bundle(
                    Path(built["bundleDirectory"]), sessions_directory=sessions
                )
            self.assertEqual(built["result"], "PASS")
            self.assertEqual(replayed["result"], "PASS")
            self.assertTrue(all(replayed["checks"].values()))

    def test_crash_context_is_raw_first_and_replayable(self) -> None:
        class FakeClient:
            @staticmethod
            def status() -> dict[str, object]:
                return {
                    "bridgeEpoch": "EPOCH-S1",
                    "nextEventSequence": 2,
                    "frameCount": 10,
                    "pc": "0x80002004",
                }

            @staticmethod
            def exception() -> dict[str, object]:
                return {"exception": {"pc": "0x80002004", "cause": "fixture"}}

        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            sessions = root / "sessions"
            create_raw_session(sessions)
            enrichment = {
                "schema": "fixture-bridge-enrichment.v1",
                "reviewState": "live-unreviewed",
                "mapping": {"status": "resolved-function", "functionId": 1},
            }
            with patch(
                "tools.total_resolver.live_resolver._enrich_bridge_context",
                return_value=enrichment,
            ):
                built = build_bridge_context_bundle(
                    client=FakeClient(),
                    session_id="S",
                    sessions_directory=sessions,
                    output_directory=root / "bundles",
                )
                replayed = replay_bridge_context_bundle(
                    Path(built["bundleDirectory"]), sessions_directory=sessions
                )
            bundle = Path(built["bundleDirectory"])
            self.assertEqual(built["result"], "PASS")
            self.assertTrue((bundle / "raw-bridge-context.json").is_file())
            self.assertEqual(replayed["result"], "PASS")


if __name__ == "__main__":
    unittest.main()
