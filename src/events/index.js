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

}


export default init;


