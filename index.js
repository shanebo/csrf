const crypto = require('crypto');

module.exports = (opts = {}) => {
  const { ignoreMethods = ['GET', 'HEAD', 'OPTIONS'] } = opts;

  return (req, res, next) => {
    const tokenMatches = () => {
      const token = req.session.get('csrf-token');
      if (token == undefined) return false;
      const headers = ['csrf-token', 'xsrf-token', 'x-csrf-token', 'x-xsrf-token'];
      const matchesHeader = headers.some(header => req.headers[header] === token);
      return req.body.csrf-token === token || matchesHeader;
    }

    req.csrfToken = (reset) => {
      const len = 32;
      const newToken = crypto.randomBytes(Math.ceil(len * 3 / 4)).toString('base64').slice(0, len);
      const token = reset ? newToken : (req.session.get('csrf-token') || newToken);
      req.session.set('csrf-token', token);
      return token;
    }

    if (ignoreMethods.includes(req.method) || tokenMatches()) {
      next();
    } else {
      req.csrfToken(true);
      res.sendStatus(401);
    }
  }
}
