require('dotenv').config()
const path = require('path');
const electron = require('electron');
const keytar = require('keytar');
const PlanckTray = require('./app/planckTray');
const MainWindow = require('./app/mainWindow');
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, ipcMain } = electron;
let mainWindow;
let tray;

process.setMaxListeners(Infinity);

app.on('ready', () => {
    app.dock.hide();

    [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
        installExtension(extension)
            .then((name) => console.log(`Added Extension: ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    });

    mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);

    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'default-icon.png';
    const iconPath = path.join(__dirname, `src/assets/${iconName}`);
    tray = new PlanckTray(iconPath, mainWindow);

});

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
