const updater = require('electron-simple-updater')
const env = require('../env.json')

updater.init({
    checkUpdateOnStart: true,
    autoDownload: true,
    url: env.UPDATE_FILE
});
