import {ipcRenderer} from "electron";
import { storage } from '../i18n';
import { isInTimerView } from '../utils'
import { remote } from 'electron';
import { message, Button } from 'antd';
import log from 'electron-log';
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
        log.info("checkingForUpdate")
    });

    updater.on('update-available', (meta) => {
        log.info("updateAvailable", meta)
        message.success('updateAvailable');
    });

    updater.on('update-not-available', () => {
        log.info("updateNotAvailable")
        message.success('updateNotAvailable');
    });

    updater.on('error', (err) => {
        log.info("error", err)
        message.error('Error update');
    });

    updater.on('update-downloading', (meta) => {
        log.info(meta)
        message.loading('Action in progress..');
    });

    updater.on('update-downloaded', (meta) => {
        log.info('downloaded !!!!', meta)
        message.success('Updated !' + meta.version);
        setTimeout(() => updater.quitAndInstall(), 8000)
    });


}


export default init;


