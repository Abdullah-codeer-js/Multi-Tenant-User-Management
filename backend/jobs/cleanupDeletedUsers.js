function cleanupDeletedUsers() {
  return Promise.resolve({ removed: 0, message: "No cleanup scheduled by default." });
}

module.exports = {
  cleanupDeletedUsers,
};
