const allowedContentTypes = ['Image', 'Video', 'Text'];

function validateContentType(type) {
  if (!allowedContentTypes.includes(type)) {
    throw new Error('Invalid content type');
  }
}

module.exports = {
  validateContentType,
};
