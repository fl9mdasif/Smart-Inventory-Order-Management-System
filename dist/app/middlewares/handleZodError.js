"use strict";
// export default handleZodError;
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleZodError = (err) => {
    const statusCode = 400;
    // get the required path form error response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessages = err.issues.map((issue) => {
        const pathNames = issue.path.map(String).join(', '); // Join path names with ', '
        return `${pathNames.slice(6)} is required`;
    });
    const formattedError = errorMessages.join('. ');
    return {
        statusCode,
        message: 'Validation Error',
        errorMessage: `${formattedError} `,
    };
};
exports.default = handleZodError;
