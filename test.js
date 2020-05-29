const chai = require('chai');
const { expect } = chai;

const csrf = require('./index')();

describe('csrf middleware', () => {
  const next = () => {};
  const req = {
    headers: {}
  };
  const res = {
    sendStatus: function(status) {
      this.status = status;
    }
  };

  beforeEach(() => {
    req.method = 'POST';
    req.session = {
        get: function(key) {
          return this[key]
        },
        set: function(key, token) {
          this[key] = token;
        }
      };
    req.body = {};
    res.status = 200;
  });

  it('sets a csrf token', () => {
    expect(req.session.get('csrf-token')).to.not.exist;
    csrf(req, res, next);
    expect(req.session.get('csrf-token')).to.exist;
  });

  ['GET', 'HEAD', 'OPTIONS'].forEach(requestType => {
    it(`does not set tokens on ${requestType} requests`, () => {
      req.method = requestType;
      csrf(req, res, next);
      expect(req.session.get('csrf-token')).to.not.exist;
    });
  });

  describe('token set', () => {
    beforeEach(() => req.session.set('csrf-token', 'some-token'));

    describe('token matches', () => {
      beforeEach(() => {
        req.body['csrf-token'] = 'some-token'  ;
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

      it('does not change csrf token', () => {
        csrf(req, res, next);
        expect(req.session.get('csrf-token')).to.not.equal('some-token');
      });
    });
  });
});
