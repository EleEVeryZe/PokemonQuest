export const formatError = (error) => {
    if (process.env.NODE_ENV === 'production') {
        return { message: 'Internal server error', code: 'INTERNAL_ERROR' };
    }
    return error; 
};