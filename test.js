const chai = require('chai');
const { expect } = chai;

const csrf = require('./index')();

describe('csrf middleware', () => {
  const next = () => {};
  const req = {
    headers: {}
  };
  const res = {
    locals: {},
    sendStatus: function(status) {
      this.status = status;
    },
  };

  beforeEach(() => {
    req.method = 'POST';
    req.session = {
      get: function(key) {
        return this[key]
      },
      set: function(key, token) {
        this[key] = token;
      },
      delete: function(key) {
        delete this[key];
      }
    };
    req.body = {};
    res.status = 200;
  });

  it('sets a csrf token', () => {
    req.method = 'GET';
    expect(req.session.get('csrf-token')).to.not.exist;
    csrf(req, res, next);
    expect(res.locals.csrfToken).to.exist;
    expect(req.session.get('csrf-token')).to.exist;
  });

  describe('token set', () => {
    beforeEach(() => req.session.set('csrf-token', 'some-token'));

    describe('token matches', () => {
      beforeEach(() => {
        req.body['csrf-token'] = 'some-token';
      });

      it('runs normally', () => {
        csrf(req, res, next);
        expect(res.status).to.equal(200);
      });

      it('does not change csrf token', () => {
        csrf(req, res, next);
        expect(req.session.get('csrf-token')).to.equal('some-token');
      });
    });

    describe('token does not match', () => {
      beforeEach(() => req.body['csrf-token'] = 'other-token');

      it('sends a 401', () => {
        csrf(req, res, next);
        expect(res.status).to.equal(401);
      });

      it('deletes csrf token from session', () => {
        csrf(req, res, next);
        expect(req.session.get('csrf-token')).to.not.exist;
      });
    });

    describe('request has no body', () => {
      it('sends a 401', () => {
        req.body = undefined;
        csrf(req, res, next);
        expect(res.status).to.equal(401);
      });
    });
  });
});
