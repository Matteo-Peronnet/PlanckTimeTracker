import {shell} from "electron";


export const Ov = (obj) => Object.values(obj)
export const openUrl = (url) => shell.openExternal(url);
