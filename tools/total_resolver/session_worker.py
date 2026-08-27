"""Private background entry point for one Total Resolver capture worker."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Sequence

from .sessions import SessionConnection, run_session_worker, session_location, sessions_root


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Total Resolver capture worker")
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--session-id", required=True)
    parser.add_argument("--host", required=True)
    parser.add_argument("--port", required=True, type=int)
    parser.add_argument("--timeout", required=True, type=float)
    parser.add_argument("--knowledge", type=Path)
    parser.add_argument("--before-rom", action="store_true")
    parser.add_argument("--defer-ingest", action="store_true")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    location = session_location(sessions_root(args.root), args.session_id)
    connection = SessionConnection(args.host, args.port, args.timeout)
    return run_session_worker(
        location,
        connection,
        args.knowledge,
        before_rom=args.before_rom,
        auto_ingest=not args.defer_ingest,
    )


if __name__ == "__main__":
    raise SystemExit(main())
