// Import necessary types and classes for the middleware
import { ErrorRequestHandler, Response } from 'express'
import { MulterError } from 'multer'
import { z, ZodError } from 'zod'

import { HTTPSTATUS } from '../config/http.config'
import { ErrorCodeEnum } from '../enums/error-code.enum'
import { AppError } from '../utils/appError'

// Helper function to transform complex Zod validation errors into a clean, readable format
const formatZodError = (res: Response, error: z.ZodError) => {
    // Loop through each Zod issue and create a simplified object
    const errors = error?.issues?.map((err) => ({
        // Join the path array (e.g., ['body', 'email']) into a string ('body.email')
        field: err.path.join('.'),
        // Get the specific validation message (e.g., "Invalid email")
        message: err.message,
    }))

    // Return a 400 Bad Request with the list of validation errors
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    })
}

const handleMulterError = (error: MulterError) => {
    const messages = {
        LIMIT_UNEXPECTED_FILE: "Invalid file field name. Please use 'file'",
        LIMIT_FILE_SIZE: 'File size exceeds the limit',
        LIMIT_FILE_COUNT: 'Too many files uploaded',
        default: 'File upload error',
    }

    return {
        status: HTTPSTATUS.BAD_REQUEST,
        message: messages[error.code as keyof typeof messages] || messages.default,
        error: error.message,
    }
}

// The main Global Error Handling middleware (must have 4 arguments: error, req, res, next)
export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
    // Log the error to the console with the URL path where it happened for easier debugging
    console.error(`Error Occured on PATH: ${req.path} `, error)

    // 1. Check for JSON Syntax Errors (e.g., a user sent a body with a missing comma or quote)
    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: 'Invalid JSON format. Please check your request body.',
        })
    }

    // 2. Check for Zod Validation Errors (e.g., user input didn't match the schema)
    if (error instanceof ZodError) {
        return formatZodError(res, error)
    }

    // 3. Check for Custom App Errors (errors you throw manually like 'User not found')
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        })
    }

    if (error instanceof MulterError) {
        const { status, message, error: err } = handleMulterError(error)
        return res.status(status).json({
            message,
            error: err,
            errorCode: ErrorCodeEnum.FILE_UPLOAD_ERROR,
        })
    }

    // 4. Fallback for all other unexpected errors (e.g., Database connection issues)
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        // Show the error message if it exists, otherwise show a generic unknown error string
        error: error?.message || 'Unknown error occurred',
    })
}
