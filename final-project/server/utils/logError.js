const { ErrorLogs } = require("../models/index");

const logError = async (error, controllerName, userId = null) => {
  if (error.statusCode && error.statusCode >= 500) {
    try {
      await ErrorLogs.create({
        error_message: error.error || "Unknown error",
        stack_trace: error.stack || "",
        user_id: userId, // Optional user ID if the error is related to a specific user
        controller: controllerName || "Unknown controller", // Log the controller name
        created_at: new Date(),
        updated_at: new Date(), // Set the same value for created and updated timestamps
      });
    } catch (loggingError) {
      console.error("Failed to log error:", loggingError);
    }
  }
};

module.exports = logError;
