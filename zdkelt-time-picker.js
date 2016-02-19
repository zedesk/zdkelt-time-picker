Polymer({
    is: 'zdkelt-time-picker',
    properties: {
        value: {
            type: String,
            value: '00:00',
            reflectToAttribute: true,
            notify: true,
            observer: '_valueChanged'
        },
        view: {
            type: String,
            value: 'hours',
            observer: '_setView'
        },
        hour12: {
            type: Boolean,
            value: false,
            notify: true
        },
        hours: {
            type: String,
            value: '00'
        },
        minutes: {
            type: String,
            value: '00'
        }
    },

    ready: function() {
        this.refresh();
    },

    refresh: function() {
        this.view = 'minutes';
        setTimeout(() => {
            this.view = 'hours';
        }, 0);
    },

    _setView: function() {
        this.$.hours.classList.remove('selected');
        this.$.minutes.classList.remove('selected');
        switch (this.view) {
            case 'hours':
                this.$.hours.classList.toggle('selected');
                this.$.clock.minutes = false;
                this.$.clock.value = parseInt(this.hours, 10);
                break;
            case 'minutes':
                this.$.minutes.classList.toggle('selected');
                this.$.clock.minutes = true;
                this.$.clock.value = parseInt(this.minutes, 10);
                break;
        }
    },

    _toggleView: function(evt) {
        var select = this.$.header.querySelector('.selected');
        if (evt && evt.target === select) {
            return;
        }
        this.view = select.id === 'hours' ? 'minutes' : 'hours';
    },

    _valueChanged: function(newValue) {
        if (!newValue) {
            this.value = this.hours + ':' + this.minutes;
            return;
        }
        var tmp = newValue.match(/(\d+):(\d+)/);
        if (tmp) {
            this.set('hours', tmp[1]);
            this.set('minutes', tmp[2]);
            this.refresh();
        }
    },

    _clockChange: function(evt) {
        evt.stopPropagation();
        if (this.view === 'hours') {
            this._toggleView();
        }
    },

    _clockUpdate: function(evt) {
        evt.stopPropagation();
        var tmp = parseInt(evt.detail, 10);
        this.set(this.view, (tmp < 10 ? '0' : '') + tmp);
        this.value = this.hours + ':' + this.minutes;
        this.fire('update', this.value);
    }
});
