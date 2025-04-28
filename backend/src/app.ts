import express, { Response, NextFunction } from "express";
import { RegisterRoutes } from "./routes/routes";
import cors from "cors";
import { ValidateError } from "@tsoa/runtime";
import { ExpressRequestWithUser } from "./middleware/authentication";

const app = express();

// Use JSON parser for all non-webhook routes
app.use(express.json());
app.use(cors());

RegisterRoutes(app);

// Error handling middleware
app.use(
  (
    err: any,
    _req: ExpressRequestWithUser,
    res: Response,
    _next: NextFunction
  ) => {
    // Log the error for debugging
    console.error('API Error:', err);

    // Ensure content type is always application/json
    res.setHeader('Content-Type', 'application/json');

    // Handle validation errors from TSOA
    if (err instanceof ValidateError) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        details: err?.fields,
        error: {
          type: "ValidationError",
          code: 400
        }
      });
    }

    // Handle custom errors with status codes
    if (err.status && typeof err.status === 'number') {
      return res.status(err.status).json({
        success: false,
        message: err.message || `Error ${err.status}`,
        details: err.details || null,
        error: {
          type: err.type || "ApiError",
          code: err.status
        }
      });
    }

    // Handle specific HTTP status codes
    if (err.status === 404) {
      return res.status(404).json({
        success: false,
        message: err.message || "Resource not found",
        details: null,
        error: {
          type: "NotFoundError",
          code: 404
        }
      });
    }

    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        message: err.message || "Bad request",
        details: err.details || null,
        error: {
          type: "BadRequestError",
          code: 400
        }
      });
    }

    // Default to 500 internal server error for unhandled exceptions
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
      details: process.env.NODE_ENV === 'production' ? null : (err.stack || null),
      error: {
        type: "InternalServerError",
        code: 500
      }
    });
  }
);

export { app };
