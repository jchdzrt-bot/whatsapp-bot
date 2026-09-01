import type { NextFunction, Request, Response } from "express";

type MongoDuplicateKeyError = {
  code: number;
  keyValue: Record<string, unknown>;
};

function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as any).code === 11000
  );
}

const getErrorStatusCode = (error: unknown) => {
  if (isDuplicateKeyError(error)) return 409;
  return typeof error === "object" && error && "statusCode" in error
    ? Number((error as any).statusCode)
    : 500;
};

const getErrorMessage = (error: unknown) => {
  if (isDuplicateKeyError(error)) {
    const entry = Object.entries(error.keyValue)[0];
    if (entry) {
      const [field, value] = entry;
      return `A record with ${field} "${value}" already exists`;
    }
    return "A record with these values already exists";
  }
  return error instanceof Error ? error.message : "Internal Server Error";
};

export default function routeErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const errorStatusCode = getErrorStatusCode(error);
  const errorMessage = getErrorMessage(error);
  const path = req.path ?? req.url;

  console.log(`Error on route ${path}: ${errorMessage}`);

  res.status(errorStatusCode).json({
    message: errorMessage,
  });
}
