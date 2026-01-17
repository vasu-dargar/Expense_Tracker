export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const userId = req.user?.userId || "anonymous";

    // Log
    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs,
        userId
      })
    );
  });

  next();
}