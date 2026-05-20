import sys
from pathlib import Path

_backend_root = Path(__file__).resolve().parent.parent
_backend_root_str = str(_backend_root)
if _backend_root_str not in sys.path:
    sys.path.insert(0, _backend_root_str)

from app.main import app

__all__ = ["app"]
