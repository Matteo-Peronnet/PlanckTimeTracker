import moment from "moment";
import "moment-duration-format";

class Timer {
    constructor(config) {
        const {
            delay,
            initialDuration,
            unit,
            onDisplayChange,
        } = this.validateConfigObject(config);
        this.unit = unit;
        this.initialDuration = this.getInitialDuration(initialDuration);
        this.duration = this.initialDuration;
        this.delay = delay;
        this.display = this.getTimeDisplay();
        this.interval = null;
        this.onDisplayChange = onDisplayChange;
    }

    start(cb) {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.duration += this.delay;
                this.updateDisplay();
            }, this.delay);
            return cb ? cb() : null;
        }
    }

    stop(cb) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            return cb ? cb() : null;
        }
    }

    updateDisplay(reset = false) {
        const newDisplay = this.getTimeDisplay();
        if (this.display !== newDisplay) {
            this.display = newDisplay;
            this.onDisplayChange(this.display, { reset });
        }
    }

    updateDisplayWithoutUpdateTimer () {
        this.onDisplayChange(this.display, false)
    }

    getInitialDuration(duration) {
        return moment.duration(duration, this.unit).asMilliseconds();
    }

    getTimeDisplay() {
        return moment.duration(this.duration).format("hh:mm", { trim: false });
    }

    validateConfigObject(config) {
        const { unit, onDisplayChange } = config;

        const initialDuration = parseInt(config.initialDuration);
        if (typeof initialDuration !== "number") {
            throw new TypeError("Timer class requires duration = Number");
        }

        const validUnits = {
            seconds: true,
            minutes: true,
            hours: true
        };

        if (!validUnits[unit]) {
            throw new TypeError(
                "Timer class requires valid unit of time (seconds, minutes, or hours)"
            );
        }

        const availableDelay = {
            seconds: 60,
            minutes: 60000,
            hours: 216000000
        }

        const delay = availableDelay[unit];

        return { delay, initialDuration, unit, onDisplayChange };
    }
}

export default Timer;
