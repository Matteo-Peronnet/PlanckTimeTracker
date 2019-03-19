const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;


module.exports = function (mainWindow) {
    autoUpdater.autoDownload = true;
    autoUpdater.setFeedURL(
        {
            provider: 'github',
            owner: 'Matteo-Peronnet',
            repo: 'PlanckTimeTracker'
        }
    )

    autoUpdater.on('checking-for-update', function () {
        mainWindow.webContents.send('checkingForUpdate');
    });

    autoUpdater.on('update-available', function (info) {
        mainWindow.webContents.send('updateAvailable', info);
    });

    autoUpdater.on('update-not-available', function (info) {
        mainWindow.webContents.send('updateNotAvailable', info);
    });

    autoUpdater.on('error', function (err) {
        mainWindow.webContents.send('updateError', err);
    });

    autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', parseInt(progressObj.percent));
    });

    autoUpdater.on('update-downloaded', function (info) {
        mainWindow.webContents.send('updateDownloaded', info);
    });

    autoUpdater.on('update-downloaded', function (info) {
        setTimeout(function () {
            autoUpdater.quitAndInstall();
        }, 1000);
    });

    autoUpdater.checkForUpdates();
}
