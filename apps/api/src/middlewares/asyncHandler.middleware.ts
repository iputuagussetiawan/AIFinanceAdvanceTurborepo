// why this function create?? untuk mengurangi pembautan try catch secara berulang2 di tiang function
// Import the standard Express types for middleware/controller arguments
import { NextFunction, Request, Response } from 'express'

// Define a custom Type for asynchronous controllers
// It expects the standard (req, res, next) and must return a Promise
type AyncControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>

// Export the asyncHandler which takes a 'controller' function as an argument
export const asyncHandler =
    (controller: AyncControllerType): AyncControllerType =>
    // It returns a new asynchronous function that Express will actually execute
    async (req, res, next) => {
        try {
            // Execute the original controller logic and wait for it to finish
            await controller(req, res, next)
        } catch (error) {
            // If any error occurs inside the controller, "catch" it here
            // and pass it to the next(error) function to trigger your Global Error Handler
            next(error)
        }
    }
