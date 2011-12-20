
/*!
 * Express - Contrib - messages
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var format = require('util').format;

function messages(req, res){
  return function(){
    var buf = []
      , messages = req.notify()
      , types = Object.keys(messages)
      , len = types.length;
    if (!len) return '';
    buf.push('<div id="messages">');
    for (var i = 0; i < len; ++i) {
      var type = types[i]
        , msgs = messages[type];
      if (msgs) {
        buf.push('  <ul class="' + type + '">');
        for (var j = 0, l = msgs.length; j < l; ++j) {
          var msg = msgs[j];
          buf.push('    <li>' + msg + '</li>');
        }
        buf.push('  </ul>');
      }
    }
    buf.push('</div>');
    return buf.join('\n');
  }
}

function notify(req,res){
  var sess = req.session;
  if (null == sess) throw new Error('req.notify() requires sessions');

  return function(type, msg){
    var msgs = sess.notifications = sess.notifications || {};
  
    switch (arguments.length) {
      // flush all messages
      case 0:
        sess.notifications = {};
        return msgs
      // flush messages for a specific type
      case 1:
        var arr = msgs[type];
        delete msgs[type];
        return arr || [];
      // set notification message
      default:
        var args = Array.prototype.slice.call(arguments,1);
        msg = format.apply({},args);
        return (msgs[type] = msgs[type] || []).push(msg);
    }
  }
}

module.exports = function middleware(){
  return function(req,res,next){
    req.notify = notify(req,res);
    res.locals.messages = messages(req,res);
    next();
  }
}