/**
 * Central Error Handling Middleware
 * Handles custom application errors, validation errors, 404s, and MySQL/Database specific error codes.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error Log] ${req.method} ${req.url}:`, err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MySQL specific error code mapping
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
      case 'SQLITE_CONSTRAINT_UNIQUE':
        statusCode = 400;
        message = 'A record with this unique attribute already exists.';
        break;
      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
      case 'SQLITE_CONSTRAINT_FOREIGNKEY':
        statusCode = 400;
        message = 'Invalid reference: Foreign key constraint failed.';
        break;
      case 'ER_ROW_IS_REFERENCED':
      case 'ER_ROW_IS_REFERENCED_2':
        statusCode = 400;
        message = 'Cannot delete or update record because it is referenced by another entity.';
        break;

      case 'PROTOCOL_CONNECTION_LOST':
      case 'ER_CON_COUNT_ERROR':
      case 'ECONNREFUSED':
        statusCode = 500;
        message = 'Database connection failure. Please check database status.';
        break;

      case 'ER_BAD_FIELD_ERROR':
      case 'ER_PARSE_ERROR':
        statusCode = 400;
        message = 'Database query syntax or field error.';
        break;
      
      default:
        break;
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      status: statusCode,
      message: message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;
