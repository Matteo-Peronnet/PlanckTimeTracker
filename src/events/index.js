import {ipcRenderer} from "electron";
import {intl, storage} from '../i18n';
import { isInTimerView } from '../utils'
import { remote } from 'electron';
import { Modal } from 'antd';
import { message } from 'antd';
import log from 'electron-log';

const updater = remote.require('electron-simple-updater');
const confirm = Modal.confirm;
let newVersionFound = false;

export const currentVersion = updater.version || '';

function init(store) {

    ipcRenderer.on('closeAppRequest', (event) => {
        // Close the Application if we don't need to save the timer
        if (!isInTimerView(store.getState()) || newVersionFound) {
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
        newVersionFound = true;
        log.info('downloaded !!!!', meta)
        confirm({
            title: intl.formatMessage({ id: 'updater.title' }),
            content: `${intl.formatMessage({ id: 'updater.message' })} (v${meta.version}) ?`,
            onOk() {
                updater.quitAndInstall()
            },
            onCancel() {},
            okText: intl.formatMessage({ id: 'shared.yes' }),
            cancelText: intl.formatMessage({ id: 'shared.no' }),
        });
    });

   setInterval(()=> {
       if(!newVersionFound) {
           updater.checkForUpdates()
       }
   }, 1000 * 60 * 10) // Check for updates every 10 minutes

}


export default init;


