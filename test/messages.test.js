
/**
 * Module dependencies.
 */

var express = require('express')
  , messages = require('../')
  , request = require('./support/http');


var app = express();
app.use(express.cookieParser('wahoo'))
app.use(express.session())
app.use(messages(app)) // adds req.notify() and a `messages()` local
app.set('views', __dirname + '/fixtures');

app.get('/', function(req, res, next){
  req.notify('info', 'info one');
  req.notify('info', 'info two');
  req.notify('error', 'error one');
  res.render('messages.ejs');
});

app.get('/none', function(req, res, next){
  res.render('messages.ejs');
});

module.exports = {
  'messages should appear': function(done){
    var html = [
        '<div id="messages">'
      , '  <ul class="info">'
      , '    <li>info one</li>'
      , '    <li>info two</li>'
      , '  </ul>'
      , '  <ul class="error">'
      , '    <li>error one</li>'
      , '  </ul>'
      , '</div>'
    ].join('\n');

    request(app)
      .get('/')
      .expect(html,done);
  },
  'messages should be empty': function(done){
    request(app)
      .get('/none')
      .expect('',done)
  }
};