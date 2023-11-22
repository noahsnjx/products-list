const errorMiddleware = (err, req, res, next) => {
  console.log("Error trace from errorMiddleware ------->");
  console.trace(err);
  res.status(err.status || 500).json(
    err instanceof Error
      ? {
          status: 500,
          message: err.message,
          stack: err.stack?.split("\n"),
          from: "errorMiddleware"
        }
      : err
  );
};

export default errorMiddleware;
