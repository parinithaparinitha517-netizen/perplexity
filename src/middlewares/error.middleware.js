async function errorhandle(err, req, res, next) {
    const response = {
        message: err.message
    };

    if (process.env.ENVIRONMENT === "development") {
        response.stack = err.stack;
    }

    res.status(err.status || 500).json(response);
    
}

export default errorhandle;