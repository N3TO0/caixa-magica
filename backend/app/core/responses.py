from typing import Any


def success_response(data: Any, message: str = "ok") -> dict:
    return {"success": True, "data": data, "message": message}


def error_response(code: str, message: str) -> dict:
    return {"success": False, "error": {"code": code, "message": message}}
