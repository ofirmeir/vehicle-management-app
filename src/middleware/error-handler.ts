import { Request, Response, NextFunction } from "express";
import { getErrorMessage } from "../utils";
import { DatabaseError, ConnectionError, ValidationError } from "sequelize";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ValidationError) {
    res.status(422).json({
      error: {
        message: error.message,
        details: error.errors.map((e) => ({
          message: e.message,
          path: e.path,
          value: e.value,
        })),
      },
    });
    return;
  }

  if (error instanceof ConnectionError) {
    res.status(503).json({
      error: {
        message: "Could not connect to the database. Please try again later.",
        details: {
          message: error.message,
        },
      },
    });
    return;
  }

  if (error instanceof DatabaseError) {
    res.status(500).json({
      error: {
        message: "A database error occurred.",
        details: {
          message: error.message,
        },
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(error),
    },
  });

  next(error);
}
