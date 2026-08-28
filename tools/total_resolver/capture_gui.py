"""Human-operated Project64 launch and Total Resolver capture GUI.

Project64 launch is a deliberate button action limited to the authenticated
frozen binary.  The GUI never loads a ROM, injects input, or mutates game
memory; capture itself remains observation-only.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import queue
import subprocess
import threading
import traceback
from typing import Any, Callable, Mapping, Sequence

from .knowledge import selected_knowledge_database
from .knowledge_ingest import ingest_session
from .focused_capture import CUTSCENE_STUDIO_PROFILE_ID
from .inventory import resolve_active_project64_binary
from .pj64_client import DEFAULT_HOST, Pj64Client
from .schema import utc_now
from .sessions import (
    SessionConnection,
    active_session_id,
    add_session_annotation,
    create_session,
    record_session_ingestion,
    request_session_stop,
    session_status,
    sessions_root,
    set_session_semantic_context,
)


CAPTURE_GUI_DEFAULT_PORT = 64656


def default_gui_log_path() -> Path:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ")
    return (
        Path(__file__).resolve().parents[2]
        / "build"
        / "total-resolver"
        / "gui"
        / "logs"
        / f"capture-gui-{stamp}.log"
    ).resolve()


class CaptureGuiLog:
    """Thread-safe plain-text log suitable for attaching to a bug report."""

    def __init__(self, path: Path | None = None) -> None:
        self.path = (path or default_gui_log_path()).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self.write("GUI log opened", details={"path": str(self.path)})

    def write(
        self,
        message: str,
        *,
        level: str = "INFO",
        details: Mapping[str, Any] | None = None,
    ) -> None:
        line = f"{utc_now()} [{level}] {message}"
        if details:
            line += " " + json.dumps(dict(details), sort_keys=True, default=str)
        with self._lock:
            with self.path.open("a", encoding="utf-8") as output:
                output.write(line + "\n")

    def exception(self, operation: str, error: BaseException) -> None:
        self.write(
            f"{operation} failed: {type(error).__name__}: {error}",
            level="ERROR",
        )
        with self._lock:
            with self.path.open("a", encoding="utf-8") as output:
                output.write("".join(traceback.format_exception(error)))

    def append_file_tail(
        self, source: Path, *, label: str, maximum_characters: int = 24000
    ) -> None:
        """Copy a bounded worker-log tail into the attachable GUI log."""

        try:
            content = source.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            self.write(
                f"Could not read {label}: {exc}",
                level="WARNING",
                details={"path": str(source)},
            )
            return
        tail = content[-maximum_characters:]
        with self._lock:
            with self.path.open("a", encoding="utf-8") as output:
                output.write(
                    f"--- {label} tail ({source}; {len(tail)} characters) ---\n"
                )
                output.write(tail)
                if tail and not tail.endswith("\n"):
                    output.write("\n")
                output.write(f"--- end {label} tail ---\n")

    def read(self) -> str:
        with self._lock:
            return self.path.read_text(encoding="utf-8")


class CaptureWorkflowController:
    """Testable lifecycle controller used by the Tk front end."""

    def __init__(
        self,
        *,
        root: Path | None = None,
        knowledge_database: Path | None = None,
        project64_root: Path | None = None,
        connection: SessionConnection = SessionConnection(port=CAPTURE_GUI_DEFAULT_PORT),
        log: CaptureGuiLog | None = None,
    ) -> None:
        self.root = sessions_root(root)
        self.knowledge_database = (
            knowledge_database.resolve() if knowledge_database is not None else None
        )
        self.project64_root = (
            project64_root.resolve() if project64_root is not None else None
        )
        self.connection = connection
        self.log = log or CaptureGuiLog()
        self.session_id: str | None = active_session_id(self.root)
        self.project64_process: subprocess.Popen[bytes] | None = None
        self.log.write(
            "Controller initialized",
            details={
                "sessionsRoot": str(self.root),
                "knowledgeDatabase": (
                    str(self.knowledge_database) if self.knowledge_database else "selected"
                ),
                "host": connection.host,
                "port": connection.port,
                "project64Root": (
                    str(self.project64_root) if self.project64_root is not None else "configured"
                ),
                "activeSessionId": self.session_id,
            },
        )

    def _append_worker_log(self) -> None:
        if self.session_id is None:
            return
        path = self.root / self.session_id / "session.log"
        if path.is_file():
            self.log.append_file_tail(path, label=f"session {self.session_id} worker log")

    def _knowledge(self) -> Path:
        selected = self.knowledge_database or selected_knowledge_database()
        if selected is None:
            raise RuntimeError("No Total Resolver knowledge database is selected")
        return selected.resolve()

    def launch_project64(self) -> dict[str, Any]:
        """Launch only the exact Project64 build frozen in the source inventory."""

        if self.project64_process is not None and self.project64_process.poll() is None:
            result = {
                "result": "PASS",
                "action": "already-running-from-this-gui",
                "pid": self.project64_process.pid,
                "bridgePort": self.connection.port,
            }
            self.log.write("Project64 is already running from this GUI", details=result)
            return result
        self.log.write("Authenticating configured Project64 capture build")
        try:
            active = resolve_active_project64_binary(
                project64_root=self.project64_root
            )
            if (
                active.bridge_port is not None
                and active.bridge_port != self.connection.port
            ):
                raise RuntimeError(
                    "authenticated Project64 runtime bridge port does not match the GUI: "
                    f"runtime {active.bridge_port}, GUI {self.connection.port}"
                )
            process = subprocess.Popen(
                (str(active.path),),
                cwd=str(active.path.parent),
                stdin=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                close_fds=True,
            )
        except Exception as exc:
            self.log.exception("Project64 launch", exc)
            raise
        self.project64_process = process
        result = {
            "result": "PASS",
            "action": "launched-authenticated-project64",
            "pid": process.pid,
            "binary": str(active.path),
            "binarySha256": active.sha256,
            "bridgeScript": (
                str(active.bridge_path) if active.bridge_path is not None else None
            ),
            "bridgeScriptSha256": active.bridge_sha256,
            "bridgePort": self.connection.port,
            "romLoaded": False,
            "captureStarted": False,
        }
        self.log.write("Authenticated Project64 capture build launched", details=result)
        return result

    def check_bridge(self) -> dict[str, Any]:
        self.log.write("Checking observation bridge")
        try:
            with Pj64Client(
                self.connection.host,
                self.connection.port,
                self.connection.timeout,
                allow_unloaded=True,
            ) as client:
                result = {
                    "handshake": client.handshake_result.to_dict()
                    if client.handshake_result is not None
                    else None,
                    "status": client.status(),
                }
        except Exception as exc:
            self.log.exception("Bridge check", exc)
            raise
        self.log.write("Bridge check passed", details=result)
        return result

    def refresh(self) -> dict[str, Any] | None:
        self.session_id = self.session_id or active_session_id(self.root)
        if self.session_id is None:
            return None
        try:
            result = session_status(self.session_id, root=self.root)
        except Exception as exc:
            self.log.exception("Session refresh", exc)
            self._append_worker_log()
            raise
        self.log.write("Session status refreshed", details=result)
        return result

    def start(
        self, *, before_rom: bool = False, focused: bool = False
    ) -> dict[str, Any]:
        current = self.refresh() if self.session_id is not None else None
        if (
            current is not None
            and current.get("closureStatus") == "closed"
            and current.get("ingestion") is None
        ):
            raise RuntimeError(
                "the previous capture is closed but not integrated; name and integrate it "
                "before starting another capture"
            )
        self.log.write(
            "Starting deferred-ingestion capture",
            details={
                "beforeRom": before_rom,
                "launchesProject64": False,
                "captureMode": "focused-research" if focused else "manual-play",
                "focusedProfile": CUTSCENE_STUDIO_PROFILE_ID if focused else None,
            },
        )
        try:
            result = create_session(
                root=self.root,
                connection=self.connection,
                knowledge_database=self._knowledge(),
                before_rom=before_rom,
                auto_ingest=False,
                focused_profile_id=(CUTSCENE_STUDIO_PROFILE_ID if focused else None),
            )
        except Exception as exc:
            self.log.exception("Capture start", exc)
            self.session_id = active_session_id(self.root) or self.session_id
            self._append_worker_log()
            raise
        self.session_id = str(result["sessionId"])
        self.log.write("Capture started", details=result)
        return result

    def add_note(self, text: str) -> dict[str, Any]:
        note = text.strip()
        if not note:
            raise ValueError("Enter a short note before pressing Add Note")
        if self.session_id is None:
            self.session_id = active_session_id(self.root)
        if self.session_id is None:
            raise RuntimeError("There is no active Total Resolver capture")
        current = session_status(self.session_id, root=self.root)
        if current.get("closureStatus") != "open" or not current.get("workerAlive"):
            raise RuntimeError("Add Note is available only while a capture is running")
        self.log.write(
            "Adding focused contextual note",
            details={
                "sessionId": self.session_id,
                "text": note,
                "frameWindow": "60 before / 30 after at the game's 30 FPS baseline",
            },
        )
        try:
            result = add_session_annotation(
                note,
                marker_type="note",
                session_id=self.session_id,
                root=self.root,
                connection=self.connection,
                context_before=256,
                context_after=256,
                frame_context_before=60,
                frame_context_after=30,
            )
        except Exception as exc:
            self.log.exception("Add Note", exc)
            self._append_worker_log()
            raise
        result["action"] = "note-added"
        self.log.write("Contextual note added", details=result)
        return result

    def stop(self, *, wait_seconds: float = 180.0) -> dict[str, Any]:
        if self.session_id is None:
            self.session_id = active_session_id(self.root)
        if self.session_id is None:
            raise RuntimeError("There is no active Total Resolver capture")
        self.log.write("Requesting clean capture stop", details={"sessionId": self.session_id})
        try:
            result = request_session_stop(
                self.session_id,
                root=self.root,
                wait_seconds=wait_seconds,
            )
        except Exception as exc:
            self.log.exception("Capture stop", exc)
            self._append_worker_log()
            raise
        if result.get("closureStatus") != "closed" or result.get("workerAlive"):
            error = TimeoutError(
                "capture did not finish a verified normal stop before the wait limit"
            )
            self.log.exception("Capture stop", error)
            self._append_worker_log()
            raise error
        self.log.write("Capture stop completed", details=result)
        return result

    def name_and_ingest(self, semantic_name: str, *, notes: str | None = None) -> dict[str, Any]:
        if self.session_id is None:
            raise RuntimeError("There is no stopped capture to integrate")
        self.log.write(
            "Saving semantic context before explicit ingestion",
            details={"sessionId": self.session_id, "semanticName": semantic_name},
        )
        try:
            semantic = set_session_semantic_context(
                self.session_id,
                semantic_name,
                notes=notes,
                root=self.root,
            )
            session_directory = self.root / self.session_id
            ingestion = ingest_session(self._knowledge(), session_directory)
            status = record_session_ingestion(
                self.session_id,
                ingestion,
                root=self.root,
            )
        except Exception as exc:
            self.log.exception("Capture integration", exc)
            self._append_worker_log()
            raise
        result = {"semanticContext": semantic, "ingestion": ingestion, "status": status}
        self.log.write("Capture integrated successfully", details=result)
        return result


def _build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Total Resolver capture GUI")
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--port", type=int, default=CAPTURE_GUI_DEFAULT_PORT)
    parser.add_argument("--timeout", type=float, default=5.0)
    parser.add_argument("--sessions-root", type=Path)
    parser.add_argument("--knowledge", type=Path)
    parser.add_argument("--project64-root", type=Path)
    parser.add_argument("--log", type=Path)
    return parser


def launch_capture_gui(
    *,
    root: Path | None = None,
    knowledge_database: Path | None = None,
    project64_root: Path | None = None,
    connection: SessionConnection = SessionConnection(port=CAPTURE_GUI_DEFAULT_PORT),
    log_path: Path | None = None,
) -> int:
    import tkinter as tk
    from tkinter import messagebox, scrolledtext, ttk

    log = CaptureGuiLog(log_path)
    controller = CaptureWorkflowController(
        root=root,
        knowledge_database=knowledge_database,
        project64_root=project64_root,
        connection=connection,
        log=log,
    )
    window = tk.Tk()
    window.title("OB64 Total Resolver Capture")
    window.geometry("900x790")
    work_queue: queue.Queue[tuple[str, Any]] = queue.Queue()
    busy = tk.BooleanVar(value=False)
    status_text = tk.StringVar(
        value="Ready. Launch Project64 explicitly, then check its bridge before capture."
    )
    session_text = tk.StringVar(value=controller.session_id or "None")
    before_rom = tk.BooleanVar(value=False)
    semantic_name = tk.StringVar()
    note_text = tk.StringVar()
    log_path_text = tk.StringVar(value=str(log.path))

    outer = ttk.Frame(window, padding=12)
    outer.pack(fill="both", expand=True)
    ttk.Label(
        outer,
        text=(
            "Launch the authenticated Total Resolver Project64 build here, or use an already-open "
            "instance. This GUI never loads a ROM; capture remains a separate explicit action."
        ),
        wraplength=850,
    ).pack(fill="x", pady=(0, 10))

    connection_frame = ttk.LabelFrame(outer, text="Capture")
    connection_frame.pack(fill="x")
    ttk.Label(connection_frame, text="Current session:").grid(
        row=0, column=0, sticky="w", padx=6, pady=6
    )
    ttk.Label(connection_frame, textvariable=session_text).grid(
        row=0, column=1, columnspan=3, sticky="w"
    )
    ttk.Checkbutton(
        connection_frame,
        text="Arm before manually loading the ROM",
        variable=before_rom,
    ).grid(row=1, column=0, columnspan=4, sticky="w", padx=6, pady=6)

    button_frame = ttk.Frame(connection_frame)
    button_frame.grid(row=2, column=0, columnspan=4, sticky="w", padx=6, pady=6)

    note_frame = ttk.LabelFrame(outer, text="Context note (while capture is running)")
    note_frame.pack(fill="x", pady=(10, 0))
    ttk.Label(
        note_frame,
        text=(
            "Focused targets are captured automatically. Add Note marks 2 seconds before "
            "and 1 second after the current frame."
        ),
        wraplength=840,
    ).grid(row=0, column=0, columnspan=2, sticky="w", padx=6, pady=(6, 2))
    note_entry = ttk.Entry(note_frame, textvariable=note_text, width=78)
    note_entry.grid(row=1, column=0, sticky="ew", padx=6, pady=6)
    note_frame.columnconfigure(0, weight=1)

    naming = ttk.LabelFrame(outer, text="Name and integrate after stop")
    naming.pack(fill="x", pady=(10, 0))
    ttk.Label(naming, text="Semantic name:").grid(row=0, column=0, sticky="w", padx=6, pady=6)
    name_entry = ttk.Entry(naming, textvariable=semantic_name, width=70)
    name_entry.grid(row=0, column=1, sticky="ew", padx=6, pady=6)
    ttk.Label(naming, text="Notes (optional):").grid(row=1, column=0, sticky="nw", padx=6, pady=6)
    notes_box = tk.Text(naming, height=4, width=70)
    notes_box.grid(row=1, column=1, sticky="ew", padx=6, pady=6)
    naming.columnconfigure(1, weight=1)

    ttk.Label(outer, textvariable=status_text, wraplength=850).pack(fill="x", pady=(10, 4))
    log_frame = ttk.LabelFrame(outer, text="Diagnostic log")
    log_frame.pack(fill="both", expand=True)
    ttk.Entry(log_frame, textvariable=log_path_text, state="readonly").pack(
        fill="x", padx=6, pady=6
    )
    log_view = scrolledtext.ScrolledText(log_frame, height=18, state="disabled")
    log_view.pack(fill="both", expand=True, padx=6, pady=(0, 6))

    def show_log() -> None:
        text = log.read()
        log_view.configure(state="normal")
        log_view.delete("1.0", "end")
        log_view.insert("end", text)
        log_view.see("end")
        log_view.configure(state="disabled")

    def set_busy(value: bool) -> None:
        busy.set(value)
        for widget in (
            launch_button,
            check_button,
            start_button,
            focused_start_button,
            stop_button,
            note_button,
            integrate_button,
        ):
            widget.configure(state="disabled" if value else "normal")

    def run_async(label: str, operation: Callable[[], Any]) -> None:
        if busy.get():
            return
        set_busy(True)
        status_text.set(label + "…")

        def worker() -> None:
            try:
                work_queue.put(("ok", operation()))
            except Exception as exc:  # logged by the controller
                work_queue.put(("error", exc))

        threading.Thread(target=worker, daemon=True).start()

    def poll_work() -> None:
        try:
            kind, value = work_queue.get_nowait()
        except queue.Empty:
            window.after(100, poll_work)
            return
        set_busy(False)
        show_log()
        if kind == "error":
            status_text.set(f"Failed: {type(value).__name__}: {value}")
            messagebox.showerror(
                "Total Resolver",
                f"{type(value).__name__}: {value}\n\nDiagnostic log:\n{log.path}",
            )
        else:
            session_text.set(controller.session_id or "None")
            if (
                isinstance(value, Mapping)
                and value.get("action") == "launched-authenticated-project64"
            ):
                status_text.set(
                    "Correct Project64 build launched. Check Bridge when it finishes opening."
                )
            elif (
                isinstance(value, Mapping)
                and value.get("action") == "already-running-from-this-gui"
            ):
                status_text.set("Project64 launched by this GUI is already running.")
            elif isinstance(value, Mapping) and "ingestion" in value:
                semantic_name.set("")
                notes_box.delete("1.0", "end")
                name_entry.focus_set()
                status_text.set(
                    "Capture integrated successfully. Name and notes cleared for the next capture."
                )
            elif isinstance(value, Mapping) and value.get("action") == "note-added":
                note_text.set("")
                note_entry.focus_set()
                status_text.set(
                    "Note added with a 2-seconds-before / 1-second-after frame window."
                )
            else:
                status_text.set("Operation completed. See the status and log below.")
        window.after(100, poll_work)

    launch_button = ttk.Button(
        button_frame,
        text="Launch Project64",
        command=lambda: run_async("Launching Project64", controller.launch_project64),
    )
    launch_button.pack(side="left", padx=(0, 6))
    check_button = ttk.Button(
        button_frame,
        text="Check Bridge",
        command=lambda: run_async("Checking bridge", controller.check_bridge),
    )
    check_button.pack(side="left", padx=(0, 6))

    def start_capture() -> None:
        # Tk variables must be read on the GUI thread, before worker dispatch.
        arm_before_rom = bool(before_rom.get())
        run_async(
            "Starting capture",
            lambda: controller.start(before_rom=arm_before_rom),
        )

    start_button = ttk.Button(
        button_frame,
        text="Start Capture",
        command=start_capture,
    )
    start_button.pack(side="left", padx=6)
    def start_focused_capture() -> None:
        arm_before_rom = bool(before_rom.get())
        run_async(
            "Starting focused capture",
            lambda: controller.start(before_rom=arm_before_rom, focused=True),
        )

    focused_start_button = ttk.Button(
        button_frame,
        text="Start Focused Capture",
        command=start_focused_capture,
    )
    focused_start_button.pack(side="left", padx=6)
    stop_button = ttk.Button(
        button_frame,
        text="Stop Capture",
        command=lambda: run_async("Stopping capture", controller.stop),
    )
    stop_button.pack(side="left", padx=6)

    def add_note() -> None:
        text = note_text.get()
        run_async("Adding note", lambda: controller.add_note(text))

    note_button = ttk.Button(note_frame, text="Add Note", command=add_note)
    note_button.grid(row=1, column=1, sticky="e", padx=6, pady=6)
    note_entry.bind("<Return>", lambda _event: add_note())
    def integrate_capture() -> None:
        # Snapshot widget contents before the database work moves off the GUI thread.
        name = semantic_name.get()
        notes = notes_box.get("1.0", "end").strip() or None
        run_async(
            "Integrating capture",
            lambda: controller.name_and_ingest(name, notes=notes),
        )

    integrate_button = ttk.Button(
        naming,
        text="Save Name and Integrate",
        command=integrate_capture,
    )
    integrate_button.grid(row=2, column=1, sticky="e", padx=6, pady=6)

    utility = ttk.Frame(outer)
    utility.pack(fill="x", pady=(6, 0))
    ttk.Button(utility, text="Refresh Log", command=show_log).pack(side="left")

    def open_log_folder() -> None:
        if os.name == "nt":
            os.startfile(str(log.path.parent))  # type: ignore[attr-defined]

    ttk.Button(utility, text="Open Log Folder", command=open_log_folder).pack(side="left", padx=6)

    def close_window() -> None:
        if busy.get():
            messagebox.showwarning(
                "Operation in progress",
                "Wait for the current Total Resolver operation to finish before closing.",
            )
            return
        try:
            current = controller.refresh()
        except Exception as exc:
            current = None
            log.exception("GUI close status check", exc)
        if current and current.get("workerAlive"):
            proceed = messagebox.askyesno(
                "Capture still running",
                "Closing this GUI will not stop the capture worker. Close anyway?",
            )
            if not proceed:
                return
        log.write("GUI closed", details={"activeSessionId": controller.session_id})
        window.destroy()

    window.protocol("WM_DELETE_WINDOW", close_window)
    show_log()
    window.after(100, poll_work)
    window.mainloop()
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    args = _build_argument_parser().parse_args(argv)
    return launch_capture_gui(
        root=args.sessions_root,
        knowledge_database=args.knowledge,
        project64_root=args.project64_root,
        connection=SessionConnection(args.host, args.port, args.timeout),
        log_path=args.log,
    )


if __name__ == "__main__":
    raise SystemExit(main())
