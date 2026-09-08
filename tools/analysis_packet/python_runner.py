"""Isolated m2c launcher; record imported-file identities for cache validation."""
import hashlib
import json
from pathlib import Path
import runpy
import sys

root, dependencies, *args = sys.argv[1:]
sys.dont_write_bytecode = True
sys.path.insert(0, root)
sys.argv = [str(Path(root) / "m2c.py"), *args]
try:
    runpy.run_path(sys.argv[0], run_name="__main__")
finally:
    files = {}
    for module in tuple(sys.modules.values()):
        name = getattr(module, "__file__", None)
        if name:
            p = Path(name).resolve()
            if p.is_file():
                files[str(p)] = hashlib.sha256(p.read_bytes()).hexdigest().upper()
    Path(dependencies).write_text(json.dumps({"python": sys.version, "searchPath": sys.path, "files": files}, indent=2))
