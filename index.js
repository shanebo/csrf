const crypto = require('crypto');

const generateToken = () => crypto.randomBytes(Math.ceil(32 * 3 / 4)).toString('base64').slice(0, 32);

module.exports = (opts = {}) => {
  const { ignoreMethods = ['GET', 'HEAD', 'OPTIONS'] } = opts;

  return (req, res, next) => {
    const tokenMatches = () => {
      const token = req.session.get('csrf-token');
      if (token == undefined) return false;
      const headers = ['csrf-token', 'xsrf-token', 'x-csrf-token', 'x-xsrf-token'];
      const matchesHeader = headers.some(header => req.headers[header] === token);
      return req.body['csrf-token'] === token || matchesHeader;
    }

    if (!req.session.get('csrf-token')) {
      req.session.set('csrf-token', generateToken());
    }

    res.locals.csrfToken = req.session.get('csrf-token');

    if (ignoreMethods.includes(req.method) || tokenMatches()) {
      next();
    } else {
      req.session.delete('csrf-token');
      res.sendStatus(401);
    }
  }
}
