import {ipcRenderer} from "electron";
import { storage } from '../i18n';
import { isInTimerView } from '../utils'
import { remote } from 'electron';
import { message, Button } from 'antd';
const updater = remote.require('electron-simple-updater');

let downloadLoading;

function init(store) {

    ipcRenderer.on('closeAppRequest', (event) => {
        // Close the Application if we don't need to save the timer
        if (!isInTimerView(store.getState()) && !storage.has('timer')) {
            ipcRenderer.send('closeApp')
        }
    });

    updater.on('checking-for-update', () => {
        console.log("checkingForUpdate")
    });

    updater.on('update-available', (meta) => {
        console.log("updateAvailable", meta)
        message.success('updateAvailable');
    });

    updater.on('update-not-available', () => {
        console.log("updateNotAvailable")
        message.success('updateNotAvailable');
    });

    updater.on('error', (err) => {
        console.log("error", err)
        message.error('Error update');
    });

    updater.on('update-downloading', (meta) => {
        console.log(meta)
        message.loading('Action in progress..');
    });

    updater.on('update-downloaded', (meta) => {
        console.log('downloaded !!!!', meta)
        message.success('Updated !', meta);
        setTimeout(() => updater.quitAndInstall(), 8000)
    });


}


export default init;


