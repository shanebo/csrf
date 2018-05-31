# CSRF

Middleware for Calvin which can generate csrf tokens and protect from csrf attacks.

## Install

`npm install @calvin/csrf`

## Usage

``` js
const session = require('@calvin/session');
const csrf = require('@calvin/csrf');

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

