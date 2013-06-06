function WindowController () {
    var now = Date.now(),
        ping = 0;
    try {
        ping = +localStorage.getItem( 'ping' ) || 0;
    } catch ( error ) {}
    if ( now - ping > 45000 ) {
        this.becomeMaster();
    } else {
        this.loseMaster();
    }
    window.addEventListener( 'storage', this, false );
    window.addEventListener( 'unload', this, false );
}

WindowController.prototype.isMaster = false;
WindowController.prototype.destroy = function () {
    if ( this.isMaster ) {
        try {
            localStorage.setItem( 'ping', 0 );
        } catch ( error ) {}
    }
    window.removeEventListener( 'storage', this, false );
    window.removeEventListener( 'unload', this, false );
};

WindowController.prototype.handleEvent = function ( event ) {
    if ( event.type === 'unload' ) {
        this.destroy();
    } else {
        var type = event.key,
            ping = 0,
            data;
        if ( type === 'ping' ) {
            try {
                ping = +localStorage.getItem( 'ping' ) || 0;
            } catch ( error ) {}
            if ( ping ) {
                this.loseMaster();
            } else {
                // We add a random delay to try avoid the race condition in 
                // Chrome, which doesn't take out a mutex on local storage. It's
                // imperfect, but will eventually work out.
                clearTimeout( this._ping );
                this._ping = setTimeout(
                    this.becomeMaster.bind( this ),
                    ~~( Math.random() * 1000 )
                );
            }
        } else if ( type === 'broadcast' ) {
            try {
                data = JSON.parse(
                    localStorage.getItem( 'broadcast' )
                );
                this[ data.type ]( data.event );
            } catch ( error ) {}
        }
    }
};

WindowController.prototype.becomeMaster = function () {
    try {
        localStorage.setItem( 'ping', Date.now() );
    } catch ( error ) {}

    clearTimeout( this._ping );
    this._ping = setTimeout( this.becomeMaster.bind( this ),
        20000 + ~~( Math.random() * 10000 ) );

    var wasMaster = this.isMaster;
    this.isMaster = true;
    if ( !wasMaster ) {
        this.masterDidChange();
    }
};

WindowController.prototype.loseMaster = function () {
    clearTimeout( this._ping );
    this._ping = setTimeout( this.becomeMaster.bind( this ),
        35000 + ~~( Math.random() * 20000 ) );

    var wasMaster = this.isMaster;
    this.isMaster = false;
    if ( wasMaster ) {
        this.masterDidChange();
    }
};

WindowController.prototype.masterDidChange = function () {};

WindowController.prototype.broadcast = function ( type, event ) {
    try {
        localStorage.setItem( 'broadcast',
            JSON.stringify({
                type: type,
                event: event
            })
        );
    } catch ( error ) {}
};
