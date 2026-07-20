import { toast } from "react-toastify";

export const SESSION_EXPIRED_TOAST_ID = "session-expired";

function buildToastId(prefix, message) {
  return `${prefix}:${message}`;
}

export function getErrorMessage(error, fallback = "Não foi possível concluir a operação.") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function notifySuccess(message, options = {}) {
  return toast.success(message, {
    toastId: options.toastId || buildToastId("success", message),
    ...options,
  });
}

export function notifyError(errorOrMessage, fallback, options = {}) {
  const message = typeof errorOrMessage === "string"
    ? errorOrMessage
    : getErrorMessage(errorOrMessage, fallback);

  return toast.error(message, {
    toastId: options.toastId || buildToastId("error", message),
    ...options,
  });
}

export function notifyInfo(message, options = {}) {
  return toast.info(message, {
    toastId: options.toastId || buildToastId("info", message),
    ...options,
  });
}
