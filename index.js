const crypto = require('crypto');
const IGNORED_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const KEY = 'csrf-token';


function makeToken() {
  return crypto
    .randomBytes(Math.ceil(32 * 3 / 4))
    .toString('base64')
    .slice(0, 32);
}


module.exports = () => {
  return (req, res, next) => {
    const token = req.session.get(KEY) || makeToken();
    const isAllowed = IGNORED_METHODS.includes(req.method)
      || req.body?.[KEY] === token
      || req.headers[KEY] === token;

    if (isAllowed) {
      req.session.set(KEY, token);
      res.locals.csrfToken = token;
      next();
    } else {
      req.session.delete(KEY);
      res.sendStatus(401);
    }
  }
}
