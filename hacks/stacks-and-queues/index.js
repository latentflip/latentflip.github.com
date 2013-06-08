var worker = new Worker('worker.js')
var leo = {
  callbacks: {},
  on: function(eventType, cb) {
    this.callbacks[eventType] = this.callbacks[eventType] || [];
    this.callbacks[eventType].push(cb);
  },
  emit: function(eventType, data) {
    data.type = eventType;
    worker.postMessage(data)
  }
}
worker.onmessage = function(ev) {
  ev = ev.data
  var cbs = leo.callbacks[ev.type];
  if (cbs) {
    cbs.forEach(function(cb) {
      cb(ev);
    });
  }
}
//worker.postMessage('')

leo.on( 'function:call', function(data) {
  var str = [data.name, 'called with', data.args].join(' ');
  var $el = $('<li class=running>'+str+'</li>');
  $('ul#stack').prepend($el);
});

leo.on( 'function:return', function(data) {
  var $el = $('ul li.running').first();
  var text = ['Returned', data.result].join(' ');

  $el.text( text )
     .removeClass('running')
     .css({position: 'relative'})
     .animate({left: 200}, function() {
       $(this).fadeOut('slow', function() {
         $(this).remove();
       })
     });
});

leo.on( 'callback:ran', function(data) {
  $('#callbacks li').first().remove()
});
