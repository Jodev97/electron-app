import { BrowserWindow, Menu, Tray, app } from "electron";
import { getAssetPath } from "./pathResolve.js";
import path from 'path';

export function createTray(mainwindow: BrowserWindow) {
    const tray = new Tray(path.join(getAssetPath(), process.platform === 'darwin' ? 'desktopicon.png' : 'desktopicon.png'));

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                mainwindow.show();
                if (app.dock) {
                    app.dock.show();
                }
            },
        }, {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }]));
}