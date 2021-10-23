# CSRF

Middleware for Dylan which can generate csrf tokens and protect from csrf attacks.

## Install

`npm install @dylan/csrf`

## Usage

``` js
const dylan = require('dylan');
const session = require('@dylan/session');
const csrf = require('@dylan/csrf');
const app = dylan();

app.use(session({
  cookie: 'foo',
  secret: 'boo'
}));

app.use(csrf());

app.get('/contact', (req, res) => {
  res.send(`
    <form method="post" action="/contact">
      <input type="hidden" name="csrf-token" value="${req.csrfToken()}">
      <input type="text" name="message" value="hello world">
      <button>Talk</button>
    </form>
  `);
});

app.post('/contact', (req, res) => {
  console.log(req.body.message); // hello world
  res.end('safely handled');
});
```
