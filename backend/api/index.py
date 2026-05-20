import sys
from pathlib import Path

CURRENT_FILE = Path(__file__).resolve()
CWD = Path.cwd()

candidates = [
    CWD,
    CWD / "backend",
    CURRENT_FILE.parent,
    CURRENT_FILE.parent / "backend",
    CURRENT_FILE.parent.parent,
    CURRENT_FILE.parent.parent / "backend",
    Path("/var/task"),
    Path("/var/task/backend"),
]

backend_dir = None

for candidate in candidates:
    if (candidate / "app" / "main.py").exists():
        backend_dir = candidate
        break

print(f"[vercel-entrypoint] cwd={CWD}")
print(f"[vercel-entrypoint] file={CURRENT_FILE}")
print(f"[vercel-entrypoint] candidates={[str(c) for c in candidates]}")
print(f"[vercel-entrypoint] backend_dir={backend_dir}")

if backend_dir is None:
    raise RuntimeError(
        "Could not find app/main.py. "
        f"cwd={CWD}, file={CURRENT_FILE}, "
        f"candidates={[str(c) for c in candidates]}"
    )

backend_dir_str = str(backend_dir)
if backend_dir_str not in sys.path:
    sys.path.insert(0, backend_dir_str)

from app.main import app

__all__ = ["app"]
