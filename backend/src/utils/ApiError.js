class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "" // Here, stack refers to "error stack" or "stack trace"
    ) {
        super(message); // Calls the parent Error constructor with the message.
        this.statusCode = statusCode; // The HTTP status code representing the type of error (e.g., 400, 404, 500).
        this.data = null; // Always null for an error response. (Learn more about it online...)
        this.message = message; // Error message providing more details about the error.
        this.success = false; // Errors are always unsuccessful, hence 'false'.
        this.errors = errors; // An array containing additional error details (useful for validation errors).

        if (stack) {
            this.stack = stack; // Uses the provided stack trace if available.
        } else {
            Error.captureStackTrace(this, this.constructor); // Captures the current stack trace if not provided.
        }
    }

    // Method to return the error as JSON
    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            success: this.success,
            errors: this.errors,
            stack: this.stack || null,
        };
    }
}

export { ApiError };

/* Example Usage: -

import { ApiError } from './path/to/ApiError.js';

// Example of a Not Found error
const notFoundError = new ApiError(404, "Resource not found");
console.log(notFoundError);

>> Output: -
{
    statusCode: 404,
    data: null,
    message: "Resource not found",
    success: false,
    errors: [],
    stack: "<stack trace>"
}

// Example of a Validation Error
const validationError = new ApiError(400, "Invalid data", ["Email is required", "Password is too short"]);
console.log(validationError);

>> Output: -
{
    statusCode: 400,
    data: null,
    message: "Invalid data",
    success: false,
    errors: ["Email is required", "Password is too short"],
    stack: "<stack trace>"
}

*/
