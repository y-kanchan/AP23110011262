/**
 * Reusable Logging Middleware
 * 
 * @param {string} stack - The component or function stack name
 * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
 * @param {string} pkg - The package or module name
 * @param {string} message - The log message
 */
function Log(stack, level, pkg, message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] [${pkg}] [${stack}] - ${message}`;
  
  // In a real scenario, this might write to a file or a logging service.
  // For this track, we output to the console with clean formatting.
  console.log(logEntry);
  
  return logEntry;
}

module.exports = Log;
