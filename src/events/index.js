import {ipcRenderer} from "electron";
import { storage } from '../i18n';
import { isInTimerView } from '../utils'

function init(store) {

    ipcRenderer.on('closeAppRequest', (event) => {
        // Close the Application if we don't need to save the timer
        if (!isInTimerView(store.getState()) && !storage.has('timer')) {
            ipcRenderer.send('closeApp')
        }
    });

    ipcRenderer.on('checkingForUpdate', (event) => {
        console.log("checkingForUpdate")
    });

    ipcRenderer.on('updateAvailable', (event, arg) => {
        console.log("updateAvailable", arg)
    });

    ipcRenderer.on('updateNotAvailable', (event, arg) => {
        console.log("updateNotAvailable", arg)
    });

    ipcRenderer.on('updateError', (event, arg) => {
        console.log("updateError", arg)
    });

    ipcRenderer.on('downloadProgress', (event, arg) => {
        console.log("downloadProgress", arg)
    });

    ipcRenderer.on('updateDownloaded', (event, arg) => {
        console.log("updateDownloaded", arg)
    });


}


export default init;


