const returnError = (error, req, res, next) => {
      const statusCode = error.status || 500;
      return res.status(statusCode).json({
            status: 'Error',
            code: statusCode,
            stack: error?.stack,
            stack: error.stack,
            message: error.message || 'Internal Server Error',
      });
};

const is404Handler = (req, res, next) => {
      const error = new Error('Not Found');
      error.status = 404;
      next(error);
};

module.exports = {
      returnError,
      is404Handler,
};
