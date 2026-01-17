export function ok(res, data, message = "OK", statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function fail(res, statusCode, code, message, details) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  });
}