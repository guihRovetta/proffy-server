import { ErrorRequestHandler, Response } from 'express';

enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

class ErrorHandler extends Error {
  public statusCode: HttpStatusCode;
  public message: string;

  constructor(statusCode: HttpStatusCode, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err: ErrorHandler, res: Response) => {
  const { statusCode, message } = err;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export { ErrorHandler, handleError };
