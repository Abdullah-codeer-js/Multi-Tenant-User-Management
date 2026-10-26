function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

module.exports = {
  log,
};
