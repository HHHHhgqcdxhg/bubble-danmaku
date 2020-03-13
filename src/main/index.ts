import { app, BrowserWindow } from "electron";
import { Config, loadConfigAsync } from "../common/config/config";
import { loadTemplateText } from "./loadTemplate";
import { fetchGiftInfoAsync, GiftInfo, requestGiftInfoAsync } from "../renderer/scripts/@type/giftInfo";
import store from "../renderer/store/index";
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
    (<any>global).__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\");
}

let mainWindow;
let config: Config;
let templates;
let configLoaded = false;
let ready = false;
let gifts: Map<number, GiftInfo> = new Map<number, GiftInfo>();
const winURL =
    process.env.NODE_ENV === "development" ? `http://message.bilibili.com/#/danmaku` : `file://${__dirname}/index.html/#/danmaku`;

async function loadConfigAndTemplates() {
    config = await loadConfigAsync();
    templates = await loadTemplateText(config);
}

async function loadGiftsAsync() {
    let giftsList = await requestGiftInfoAsync();
    for (let gift of giftsList) {
        gifts[gift.id] = gift;
    }
}
async function loadConfigAndTemplatesAndGifts() {
    await Promise.all([loadConfigAndTemplates(), loadGiftsAsync()]);
}

loadConfigAndTemplatesAndGifts().then(() => {
    configLoaded = true;
    tryCreateWindow();
});

function tryCreateWindow() {
    if (configLoaded && ready) {
        createWindow();
    }
}

app.on("ready", () => {
    ready = true;
    tryCreateWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000,
        webPreferences: {
            webSecurity: false,
        },
    });

    mainWindow.loadURL(winURL);
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    mainWindow.webContents.on("did-finish-load", function() {
        store.commit("SET_GIFTS", gifts);
        store.commit("SET_CONFIG", config);
        store.commit("SET_TEMPLATES", templates);
        mainWindow.webContents.send("configLoaded");
    });
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */