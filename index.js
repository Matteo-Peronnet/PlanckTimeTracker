const path = require('path');
const electron = require('electron');
const keytar = require('keytar');
const moment = require('moment');
const PlanckTray = require('./app/planckTray');
const MainWindow = require('./app/mainWindow');
const { app, ipcMain } = electron;
require('./app/updater');

let mainWindow;
let tray;
let canClose = false;
let lockScreenAt;

process.setMaxListeners(Infinity);

app.on('ready', () => {

    if (process.platform === 'darwin') {
        app.dock.hide();
    }

    if(process.env.NODE_ENV !== "production") {
        const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
        [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
            installExtension(extension)
                .then((name) => console.log(`Added Extension: ${name}`))
                .catch((err) => console.log('An error occurred: ', err));
        });
    }
    mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);
    mainWindow.webContents.openDevTools();

    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'default-icon.png';
    const iconPath = path.join(__dirname, `src/assets/${iconName}`);
    tray = new PlanckTray(iconPath, mainWindow);

    mainWindow.on('close', (event) => {
        if (!canClose) {
            event.preventDefault();
            mainWindow.webContents.send('closeAppRequest');
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    electron.powerMonitor.on('lock-screen', () => {
        lockScreenAt = new Date();
    })

    electron.powerMonitor.on('unlock-screen', () => {
        let unlockScreenAt = new Date();
        let iddleTime = moment(unlockScreenAt).diff(lockScreenAt, 'minutes');
        // Show window if it is not visible
        if(!mainWindow.isVisible()){
            tray.onClick(null, tray.getBounds())
        }
        mainWindow.webContents.send('unlockScreen', iddleTime);
    })

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


ipcMain.on('closeApp', (event) => {
    canClose = true;
    app.quit();
})

ipcMain.on('getToken', (event, arg) => {
    keytar.getPassword('PlanckTimeTracker', 'Planck').then((res) => {
        event.sender.send('getTokenResult', res)
    });
});
ipcMain.on('setToken', (event, arg) => {
    keytar.setPassword('PlanckTimeTracker', 'Planck', arg).then(() => {
        event.sender.send('setTokenResult');
    });
});
ipcMain.on('deleteToken', (event, arg) => {
    keytar.deletePassword('PlanckTimeTracker', 'Planck').then(() => {
        event.sender.send('deleteTokenResult');
    });
});
ipcMain.on('update-timer', (event, timeLeft) => {
    tray.setTitle(timeLeft);
});

