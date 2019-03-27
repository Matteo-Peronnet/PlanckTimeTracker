import {ipcRenderer} from "electron";
import {intl, storage} from '../i18n';
import { isInTimerView } from '../utils'
import { remote } from 'electron';
import { Modal } from 'antd';
import isDev from 'electron-is-dev';
import { message } from 'antd';
import log from 'electron-log';
import { matchRoutes } from "react-router-config";
import * as Sentry from '@sentry/browser';
import routes from '../routes/routes';
import store from '../store'
import {getCustomersRequest, getProjectRequest} from "../store/ducks/planck";
const updater = remote.require('electron-simple-updater');
const confirm = Modal.confirm;
let newVersionFound = false;

export const currentVersion = updater.version || '';


export const forceUpdate = () => updater.checkForUpdates()

function init() {

    ipcRenderer.on('closeAppRequest', (event) => {
        // Close the Application if we don't need to save the timer
        if (!isInTimerView(store.getState())) {
            ipcRenderer.send('closeApp')
        }
    });

    updater.on('checking-for-update', () => {
        log.info("checkingForUpdate")
    });

    updater.on('update-available', (meta) => {
        log.info("updateAvailable", meta)
        message.success(intl.formatMessage({ id: 'updater.updateAvailable' }));
    });

    updater.on('update-not-available', () => {
        log.info("updateNotAvailable")
        message.success(intl.formatMessage({ id: 'updater.updateNotAvailable' }));
    });

    updater.on('error', (err) => {
        log.info("error", err)
        if (!isDev) {
            Sentry.captureException(new Error(err.toString()));
        }
        message.error(intl.formatMessage({ id: 'updater.errorUpdate' }));
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

export const refreshCurrentRoute = () => {
    const { match } = matchRoutes(routes, store.getState().router.location.pathname)[1];

    switch (match.path) {
        case '/': store.dispatch(getCustomersRequest()); break;
        case '/customer/:customerId/project/:projectId/task/:taskType/:taskId':
        case '/customer/:customerId/project/:projectId': store.dispatch(getProjectRequest(match.params.projectId)); break;

        default: return;
    }

}
