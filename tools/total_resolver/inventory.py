"""Verification for the frozen Total Resolver R3 migration boundary."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
from typing import Any


CONFIG_SCHEMA = "ob64-total-resolver-source-freeze.v1"
EXPECTED_ADAPTERS = {
    "static-db-r3",
    "resource-chain-static",
    "structure-field-static",
    "overlay-atlas-r3",
    "runtime-provenance-r3",
}
HISTORICAL_DYNAMIC_ADAPTERS = {"overlay-atlas-r3", "runtime-provenance-r3"}


@dataclass(frozen=True)
class Check:
    name: str
    status: str
    detail: str

    def to_dict(self) -> dict[str, str]:
        return asdict(self)


@dataclass(frozen=True)
class ActiveProject64Binary:
    path: Path
    sha256: str
    project64_root: Path
    bridge_path: Path | None = None
    bridge_sha256: str | None = None
    bridge_port: int | None = None


def repository_root() -> Path:
    return Path(__file__).resolve().parents[2]


def config_path() -> Path:
    return repository_root() / "config" / "total-resolver" / "sources.json"


def load_inventory(path: Path | None = None) -> dict[str, Any]:
    source = path or config_path()
    value = json.loads(source.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError("source freeze must be a JSON object")
    if value.get("schema") != CONFIG_SCHEMA:
        raise ValueError(f"unsupported source-freeze schema: {value.get('schema')!r}")

    snapshots = value.get("sourceSnapshots")
    if not isinstance(snapshots, list):
        raise ValueError("sourceSnapshots must be an array")
    adapter_ids = {entry.get("adapterId") for entry in snapshots if isinstance(entry, dict)}
    if adapter_ids != EXPECTED_ADAPTERS:
        raise ValueError("sourceSnapshots do not contain the five frozen adapter identities")
    for entry in snapshots:
        adapter = entry["adapterId"]
        role = entry.get("cleanR3Role")
        if adapter in HISTORICAL_DYNAMIC_ADAPTERS and role != "historical-reference-only":
            raise ValueError(f"{adapter} must remain historical-reference-only")

    for artifact in value.get("legacyResolver", {}).get("artifacts", []):
        relative = artifact.get("path")
        if not isinstance(relative, str) or Path(relative).is_absolute():
            raise ValueError("legacy artifact paths must be relative")
        digest = artifact.get("sha256")
        if not isinstance(digest, str) or len(digest) != 64:
            raise ValueError(f"legacy artifact has invalid SHA-256: {relative}")
    return value


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def framed_file_set_sha256(root: Path, relative_paths: list[str]) -> str:
    """Hash an ordered file set without ambiguous path/content concatenation."""

    digest = hashlib.sha256()
    normalized: list[tuple[str, Path]] = []
    for raw in relative_paths:
        relative = Path(raw)
        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError(f"file-set path must stay relative to its root: {raw}")
        name = relative.as_posix()
        path = root / relative
        if not path.is_file():
            raise FileNotFoundError(path)
        normalized.append((name, path))
    for name, path in sorted(normalized):
        name_bytes = name.encode("utf-8")
        size = path.stat().st_size
        digest.update(len(name_bytes).to_bytes(8, "big"))
        digest.update(name_bytes)
        digest.update(size.to_bytes(8, "big"))
        with path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(chunk)
    return digest.hexdigest().upper()


def _git_blob_sha256(root: Path, commit: str, path: str) -> str:
    completed = subprocess.run(
        ("git", "-C", str(root), "show", f"{commit}:{Path(path).as_posix()}"),
        check=True,
        capture_output=True,
    )
    return hashlib.sha256(completed.stdout).hexdigest().upper()


def _resolve_research_root(config: dict[str, Any], explicit: Path | None) -> Path | None:
    if explicit is not None:
        return explicit.resolve()
    environment = config["locators"]["research-workspace"]["environment"]
    configured = os.environ.get(environment)
    if configured:
        return Path(configured).resolve()
    candidate = (repository_root() / config["locators"]["research-workspace"]["defaultRelativeToDecomp"]).resolve()
    return candidate if candidate.exists() else None


def _resolve_project64_root(config: dict[str, Any], explicit: Path | None) -> Path | None:
    if explicit is not None:
        return explicit.resolve()
    environment = config["locators"]["project64-repository"]["environment"]
    configured = os.environ.get(environment)
    if configured:
        return Path(configured).resolve()
    candidate = repository_root().parent.parent / "project64"
    return candidate.resolve() if candidate.exists() else None


def _resolve_active_runtime_bridge(
    project64_root: Path, native: dict[str, Any]
) -> tuple[Path, str, int]:
    raw_path = native.get("bridgeScriptPath")
    expected_sha256 = native.get("bridgeScriptSha256")
    expected_port = native.get("bridgePort")
    if (
        not isinstance(raw_path, str)
        or not raw_path
        or Path(raw_path).is_absolute()
        or ".." in Path(raw_path).parts
    ):
        raise ValueError("active Project64 bridge path must stay relative to its repository")
    if not isinstance(expected_sha256, str) or len(expected_sha256) != 64:
        raise ValueError("active Project64 bridge SHA-256 is missing or malformed")
    if not isinstance(expected_port, int) or not 1 <= expected_port <= 65535:
        raise ValueError("active Project64 bridge port is missing or invalid")

    bridge = (project64_root / raw_path).resolve()
    try:
        bridge.relative_to(project64_root)
    except ValueError as exc:
        raise ValueError("active Project64 bridge resolves outside its repository") from exc
    if not bridge.is_file():
        raise FileNotFoundError(bridge)
    actual_sha256 = sha256_file(bridge)
    if actual_sha256 != expected_sha256.upper():
        raise RuntimeError(
            "configured Project64 bridge failed SHA-256 authentication: "
            f"expected {expected_sha256.upper()}, got {actual_sha256}"
        )

    text = bridge.read_text(encoding="utf-8")
    ports = re.findall(r"^\s*var\s+PORT\s*=\s*(\d+)\s*;\s*$", text, re.MULTILINE)
    if len(ports) != 1:
        raise RuntimeError("configured Project64 bridge has no unique literal PORT declaration")
    actual_port = int(ports[0])
    if actual_port != expected_port:
        raise RuntimeError(
            "configured Project64 bridge port disagrees with its runtime inventory: "
            f"expected {expected_port}, got {actual_port}"
        )
    return bridge, actual_sha256, actual_port


def resolve_active_project64_binary(
    *,
    project64_root: Path | None = None,
    inventory: dict[str, Any] | None = None,
) -> ActiveProject64Binary:
    """Resolve and authenticate the one Project64 binary frozen for capture."""

    config = inventory or load_inventory()
    resolved_root = _resolve_project64_root(config, project64_root)
    if resolved_root is None:
        environment = config["locators"]["project64-repository"]["environment"]
        raise FileNotFoundError(
            f"Project64 repository was not found; set {environment} or pass its root"
        )
    resolved_root = resolved_root.resolve()
    native = config.get("project64", {}).get("activeNativeRuntime")
    if not isinstance(native, dict):
        raise ValueError("source freeze has no active Project64 native runtime")
    raw_binary = native.get("binaryPath")
    expected = native.get("binarySha256")
    if (
        not isinstance(raw_binary, str)
        or not raw_binary
        or Path(raw_binary).is_absolute()
        or ".." in Path(raw_binary).parts
    ):
        raise ValueError("active Project64 binary path must stay relative to its repository")
    if not isinstance(expected, str) or len(expected) != 64:
        raise ValueError("active Project64 binary SHA-256 is missing or malformed")
    binary = (resolved_root / raw_binary).resolve()
    try:
        binary.relative_to(resolved_root)
    except ValueError as exc:
        raise ValueError("active Project64 binary resolves outside its repository") from exc
    if not binary.is_file():
        raise FileNotFoundError(binary)
    actual = sha256_file(binary)
    if actual != expected.upper():
        raise RuntimeError(
            "configured Project64 binary failed SHA-256 authentication: "
            f"expected {expected.upper()}, got {actual}"
        )
    bridge, bridge_sha256, bridge_port = _resolve_active_runtime_bridge(
        resolved_root, native
    )
    return ActiveProject64Binary(
        binary, actual, resolved_root, bridge, bridge_sha256, bridge_port
    )


def _git_value(root: Path, *arguments: str) -> str:
    completed = subprocess.run(
        ("git", "-C", str(root), *arguments),
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()


def verify_inventory(
    *,
    research_root: Path | None = None,
    project64_root: Path | None = None,
) -> list[Check]:
    checks: list[Check] = []
    try:
        config = load_inventory()
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        return [Check("source-freeze-config", "FAIL", str(exc))]
    checks.append(Check("source-freeze-config", "PASS", CONFIG_SCHEMA))

    resolved_research = _resolve_research_root(config, research_root)
    if resolved_research is None:
        checks.append(Check("research-workspace", "SKIP", "set OB64_RESEARCH_ROOT to verify frozen R2 inputs"))
    else:
        legacy = config["legacyResolver"]
        product = resolved_research / legacy["productPath"]
        for artifact in legacy["artifacts"]:
            path = product / artifact["path"]
            name = "legacy-resolver:" + artifact["path"]
            if not path.is_file():
                status = "SKIP" if legacy.get("role") == "historical-reference" else "FAIL"
                checks.append(
                    Check(
                        name,
                        status,
                        f"optional historical reference is absent: {path}"
                        if status == "SKIP"
                        else f"missing {path}",
                    )
                )
                continue
            actual = sha256_file(path)
            expected = artifact["sha256"].upper()
            checks.append(Check(name, "PASS" if actual == expected else "FAIL", actual))

        for key in ("clientReference", "bridgeReference"):
            entry = config["project64"][key]
            name = "project64:" + key
            if entry.get("identitySource") == "research-workspace-git-commit":
                commit = entry.get("gitCommit") or legacy["researchWorkspaceGitCommit"]
                try:
                    actual = _git_blob_sha256(resolved_research, commit, entry["path"])
                except (OSError, subprocess.CalledProcessError) as exc:
                    checks.append(Check(name, "FAIL", str(exc)))
                    continue
            else:
                path = resolved_research / entry["path"]
                if not path.is_file():
                    checks.append(Check(name, "FAIL", f"missing {path}"))
                    continue
                actual = sha256_file(path)
            expected = entry["sha256"].upper()
            checks.append(Check(name, "PASS" if actual == expected else "FAIL", actual))

        active_bridge = config["project64"].get("activeBridge")
        if isinstance(active_bridge, dict):
            path = resolved_research / active_bridge["path"]
            if not path.is_file():
                checks.append(Check("project64:activeBridge", "FAIL", f"missing {path}"))
            else:
                actual = sha256_file(path)
                expected = active_bridge["sha256"].upper()
                checks.append(
                    Check(
                        "project64:activeBridge",
                        "PASS" if actual == expected else "FAIL",
                        actual,
                    )
                )

    resolved_project64 = _resolve_project64_root(config, project64_root)
    if resolved_project64 is None:
        checks.append(Check("project64-repository", "SKIP", "set OB64_PROJECT64_ROOT to verify ob64-core"))
    else:
        expected = config["project64"]["runtimeRepository"]
        try:
            branch = _git_value(resolved_project64, "branch", "--show-current")
            commit = _git_value(resolved_project64, "rev-parse", "HEAD").upper()
        except (OSError, subprocess.CalledProcessError) as exc:
            checks.append(Check("project64-repository", "FAIL", str(exc)))
        else:
            branch_ok = branch == expected["branch"]
            commit_ok = commit == expected["gitCommit"].upper()
            checks.append(
                Check(
                    "project64-repository",
                    "PASS" if branch_ok and commit_ok else "FAIL",
                    f"{branch}@{commit}",
                )
            )
            native = config["project64"].get("activeNativeRuntime")
            if isinstance(native, dict):
                try:
                    source_hash = framed_file_set_sha256(
                        resolved_project64, list(native["sourceFiles"])
                    )
                except (OSError, ValueError) as exc:
                    checks.append(Check("project64:native-source-set", "FAIL", str(exc)))
                else:
                    expected_source = native["sourceFileSetSha256"].upper()
                    checks.append(
                        Check(
                            "project64:native-source-set",
                            "PASS" if source_hash == expected_source else "FAIL",
                            source_hash,
                        )
                    )
                binary = resolved_project64 / native["binaryPath"]
                if not binary.is_file():
                    checks.append(
                        Check("project64:active-binary", "FAIL", f"missing {binary}")
                    )
                else:
                    binary_hash = sha256_file(binary)
                    expected_binary = native["binarySha256"].upper()
                    checks.append(
                        Check(
                            "project64:active-binary",
                            "PASS" if binary_hash == expected_binary else "FAIL",
                            binary_hash,
                        )
                    )
                try:
                    _bridge, bridge_hash, bridge_port = _resolve_active_runtime_bridge(
                        resolved_project64, native
                    )
                except (OSError, ValueError, RuntimeError) as exc:
                    checks.append(
                        Check("project64:active-runtime-bridge", "FAIL", str(exc))
                    )
                else:
                    checks.append(
                        Check(
                            "project64:active-runtime-bridge",
                            "PASS",
                            f"{bridge_hash}@127.0.0.1:{bridge_port}",
                        )
                    )
    return checks
