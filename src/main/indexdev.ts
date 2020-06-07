import {app, BrowserWindow, Tray, Menu, MenuItem, shell, ipcMain, Session} from "electron";
/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
import path from "path";

require("electron-debug")({ showDevTools: true });


// Require `main` process to boot app
require('./index.ts');

