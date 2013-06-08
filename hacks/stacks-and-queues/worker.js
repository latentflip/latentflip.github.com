importScripts('utils.js', 'instrumentor.js');

var context = this;
var msgbus = {
  emit: function(type, msg) {
    msg.type = type;
    postMessage(msg);
  }
}

var i = new Instrumentor(context, msgbus);

onmessage = function(event) {
  event = event.data
  if (event.type === 'code') {
    i.start()
    eval(event.code, context);
    i.run();
    eval(event.run, context);
    msgbus.emit('instrumentor:ran', { ran: true })
  }
  if (event.type == 'callback') {
    factorial(5)
    msgbus.emit('callback:ran', {})
  }
};
