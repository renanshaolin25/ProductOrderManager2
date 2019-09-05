const checkAuth = (request, response, next) => {
  const token = request.headers.authorization;
  if(/aW5hdGVsOmFsdW5vc2luYXRlbA==/.test(token)) {
    next();
  } else {
    response.status(401).json({
      error: 'Not authorized'
    });
  }
}

module.exports = checkAuth;