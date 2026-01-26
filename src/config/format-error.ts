export const formatError = (error) => {
    const isProduction = process.env.NODE_ENV !== 'production';

    if (isProduction) {
        const message = error.extensions?.status === 500
            ? 'Internal server error'
            : error.message;

        return {
            message,
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            extensions: {
                status: error.extensions?.status,
                timestamp: error.extensions?.timestamp,
            },
        };
    }
    return error;
};