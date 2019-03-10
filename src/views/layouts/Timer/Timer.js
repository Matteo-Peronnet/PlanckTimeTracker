import moment from "moment";
import "moment-duration-format";

class Timer {
    constructor(config) {
        const {
            duration,
            unit,
            onDisplayChange,
        } = this.validateConfigObject(config);

        this.initialDuration = this.getInitialDuration(duration, unit);
        this.duration = this.initialDuration;
        this.delay = 1000;
        this.display = this.getTimeDisplay();
        this.interval = null;
        this.startTime = null;
        this.isPaused = false;
        this.onDisplayChange = onDisplayChange;
    }

    start(cb) {
        if (!this.interval) {
            this.startTime = moment();
            this.interval = setInterval(() => {
                if (!this.isPaused) {
                    this.duration += this.delay;
                    this.updateDisplay();
                }
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

    pause(cb) {
        this.isPaused = true;
        return cb ? cb() : null;
    }

    restart(cb) {
        this.isPaused = false;
        return cb ? cb() : null;
    }

    reset() {
        console.log(moment() - this.startTime);
        this.stop();
        this.duration = this.initialDuration;
        this.updateDisplay(true);
    }

    updateDisplay(reset = false) {
        const newDisplay = this.getTimeDisplay();
        if (this.display !== newDisplay) {
            this.display = newDisplay;
            this.onDisplayChange(this.display, { reset });
        }
    }

    getInitialDuration(duration, unit) {
        return moment.duration(duration, unit).asMilliseconds();
    }

    getTimeDisplay() {
        return moment.duration(this.duration).format("hh:mm:ss", { trim: false });
    }

    validateConfigObject(config) {
        const { unit, onDisplayChange } = config;

        const duration = parseInt(config.duration);
        if (typeof duration !== "number") {
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

        return { duration, unit, onDisplayChange };
    }
}

export default Timer;
