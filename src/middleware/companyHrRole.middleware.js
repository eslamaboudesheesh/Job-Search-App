import { asyncHandler } from "../utils/asyncHandler.js";

// Middleware function to check if the user has the required role (Company_HR)
export const authorizeCompanyHR = asyncHandler(async (req, res, next) => {
    const userRole = req.user.role;

    if (userRole !== 'Company_HR') {
        return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to perform this action.' });
    }

    return next()
});
