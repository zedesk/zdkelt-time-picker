'use strict';

Polymer({
    is: 'zdkelt-time-picker',
    properties: {
        value: {
            type: String,
            value: '',
            reflectToAttribute: true,
            notify: true,
            observer: '_valueChanged'
        },
        view: {
            type: String,
            value: 'hours'
        },
        hour12: {
            type: Boolean,
            value: false,
            notify: true
        },
        meridiem: {
            type: String,
            value: "PM",
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
        var str;
        if (this.hour12) {
            if (parseInt(this.hours,10)<12) {
                str = '<zdkelt-clock hour12 id="hourClock" meridiem="AM"></zdkelt-clock>';
            } else {
                str = '<zdkelt-clock hour12 id="hourClock" meridiem="PM"></zdkelt-clock>';
            }
        } else {
            str = '<zdkelt-clock id="hourClock"></zdkelt-clock>';
        }
        this.querySelector('.hours').innerHTML = str;
        this.querySelector('.minutes').innerHTML = '<zdkelt-clock minutes id="minuteClock" ></zdkelt-clock>';
        this._hourClock = this.querySelector('#hourClock');
        this._hourClock.addEventListener('update',this._hourChange.bind(this));
        this._hourClock.addEventListener('change',this._setHours.bind(this));
        this._hourClock.addEventListener('meridiem-change',this._meridiemChange.bind(this));
        this._minuteClock = this.querySelector('#minuteClock');
        this._minuteClock.addEventListener('update',this._minutesChange.bind(this));
        this._minuteClock.addEventListener('change',this._setMinutes.bind(this));
    },
    attached: function() {
        this.refresh();
    },
    refresh: function() {
        // ensure on firefox that the hour view is selected
        this.querySelector('.box').scrollTop = 0;
        this._valueChanged(this.value);
        this._hourClock.value = this.hours;
        this._minuteClock.value = this.minutes;
        this._hourClock.refresh();
        this._minuteClock.refresh();
    },
    toggleView: function(evt) {
        var select = this.$.header.querySelector('.selected');
        if (evt && evt.target === select) { return; }
        this.$.hours.classList.toggle('selected');
        this.$.minutes.classList.toggle('selected');
        switch (select.id) {
            case 'hours':
                this.querySelector('.box').scrollTop = 240;
                break;
            case 'minutes':
                this.querySelector('.box').scrollTop = 0;
                break;
        }
    },
    _valueChanged: function(newValue) {
        if (!newValue) {
            this.value = this.hours + ':' + this.minutes;
            return;
        }
        var tmp = newValue.match(/(\d+):(\d+)/);
        if (tmp) {
            if (this.hour12) {
                this.set('meridiem',parseInt(tmp[1],10) < 12?'AM':'PM');
                this.set('hours', parseInt(tmp[1],10) % 12);
            } else {
                this.set('hours', tmp[1]);
            }
            this.set('minutes', tmp[2]);
        }
    },
    _hourChange: function(evt) {
        if (this.$.header.querySelector('.selected').id !== 'hours') {
            return;
        }
        this.set('hours', evt.detail);
        this._value = this.hours + ':' + this.minutes;
    },
    _minutesChange: function(evt) {
        this.set('minutes', evt.detail);
        this._value = this.hours + ':' + this.minutes;
    },
    _meridiemChange: function(evt) {
        // debugger;
        this.meridiem = evt.detail;
        this._setHours();
    },
    _setHours: function(evt) {
        if (evt) { evt.stopPropagation(); }
        var value;
        if (this.hour12) {
            switch (this.meridiem) {
                case "AM":
                    value = (parseInt(this.hours,10) < 10?'0':'')+this.hours + ':' + this.minutes
                    break;
                case "PM":
                    value = (parseInt(this.hours,10)+12) + ':' + this.minutes
                    break;
            }
        } else {
            value = this.hours + ':' + this.minutes
        }
        this.set('value', value);
        this.toggleView();
        this.fire('change',this.value);
    },
    _setMinutes: function(evt) {
        if (evt) { evt.stopPropagation(); }
        this.set('value', this.hours + ':' + this.minutes);
        this.fire('change',this.value);
    }
});
