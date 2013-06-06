function uuid(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid.split('-')[0];
};

var Leo = (function() {
  var callbacks = {};
  var Leo = function() {
    this.id = uuid(); 
    window.addEventListener('storage', this, false)
  }


  Leo.prototype.handleEvent = function(event) {
    if (event.type === 'storage') {
      var parts = event.key.split('-');
      if (parts[0] == 'leo') {
        var cbs = callbacks[parts[1]];
        if (cbs) { 
          cbs.forEach(function(cb) {
            cb(JSON.parse(event.newValue));
          });
        }
      }
    }
  }

  Leo.prototype.emit = function(msgType, data) {
    data.id = this.id;
    localStorage.setItem( ['leo',msgType,this.id].join('-'), JSON.stringify(data) );
  }

  Leo.prototype.on = function(msgType, cb) {
    callbacks[msgType] = callbacks[msgType] || [];
    callbacks[msgType].push(cb);
  }

  return Leo;
})()

leo = new Leo()

setInterval(function() {
  leo.emit( 'message', {date: new Date().valueOf().toString() } )
}, 500)

leo.on( 'message', function(data) {
  console.log(data)
});
