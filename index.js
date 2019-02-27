const path = require('path');
const electron = require('electron');
const PlanckTray = require('./app/planckTray');
const MainWindow = require('./app/mainWindow');

const { app, /**ipcMain*/ } = electron;

let mainWindow;
let tray;

app.on('ready', () => {
    app.dock.hide();
    mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);

    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'default-icon.png';
    const iconPath = path.join(__dirname, `src/assets/${iconName}`);
    tray = new PlanckTray(iconPath, mainWindow);
});
