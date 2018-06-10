# CSRF

Middleware for Dylan which can generate csrf tokens and protect from csrf attacks.

## Install

`npm install @dylan/csrf`

## Usage

``` js
const session = require('@dylan/session');
const csrf = require('@dylan/csrf');

app.use(session({ cookie: 'foo', secret: 'boo' }));
app.use(csrf());
app.get('/contact', (req, res) => {
  res.render('template', {
    token: req.csrfToken();
  })
});
app.post('/contact', (req, res) => {
  // got through csrf protection
});
```

