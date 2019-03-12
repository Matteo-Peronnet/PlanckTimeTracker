import React from 'react';
import { notification } from 'antd';
import {shell} from "electron";


export const Ov = (obj) => Object.values(obj)
export const openUrl = (url) => shell.openExternal(url);

export const openNotificationByType = (type, title, message) => {
    notification[type]({
        message: title,
        description: message,
        duration: 2
    });
};

export const isInTimerView = (state) => state.router.location.pathname === '/timer'
