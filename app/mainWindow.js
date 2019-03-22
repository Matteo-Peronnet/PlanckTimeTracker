const path = require('path')
const electron = require('electron');
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
    constructor(url) {
        super({
            height: 500,
            width: 350,
            frame: process.platform === 'linux',
            resizable: false,
            show: false,
            icon: path.join(__dirname, '/../build/icon.png'),
            webPreferences: { backgroundThrottling: false }
        });

        this.loadURL(url);
        process.env.NODE_ENV === "production" && (this.on('blur', this.onBlur.bind(this)))
    }

    onBlur() {
        this.hide();
    }
}

module.exports = MainWindow;
