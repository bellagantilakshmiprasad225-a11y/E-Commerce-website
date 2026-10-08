/**
 * API Key Middleware
 * Validates request x-api-key header against process.env.API_KEY
 */
const apiKeyMiddleware = (req, res, next) => {
  const expectedApiKey = process.env.API_KEY;

  // If no API_KEY configured in environment, bypass check
  if (!expectedApiKey) {
    return next();
  }

  const clientApiKey =
    req.headers['x-api-key'] ||
    req.query.api_key ||
    (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));

  if (!clientApiKey || clientApiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      error: {
        status: 401,
        message: 'Unauthorized: Invalid or missing x-api-key header.'
      }
    });
  }

  next();
};

module.exports = apiKeyMiddleware;
