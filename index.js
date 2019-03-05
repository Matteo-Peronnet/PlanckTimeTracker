require('dotenv').config()
const path = require('path');
const electron = require('electron');
const PlanckTray = require('./app/planckTray');
const MainWindow = require('./app/mainWindow');
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

const { app, /**ipcMain*/ } = electron;

let mainWindow;
let tray;

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
