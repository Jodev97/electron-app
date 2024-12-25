import { BrowserWindow, Menu, app } from 'electron';
import { ipcWebContentsSend, isDev } from './util.js';

export function createMenu(mainWindow: BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: process.platform === 'darwin' ? undefined : 'App',
            submenu: [
                {
                    label: 'Quit',
                    click: () => app.quit()
                },
                {
                    label: 'DevTools',
                    click: () => mainWindow.webContents.toggleDevTools(),
                    visible: isDev()
                }
            ]
        },
        {
            label: 'View',
            type: 'submenu',
            submenu: [
                {
                    label: 'CPU',
                    click: () => ipcWebContentsSend('changeView', mainWindow.webContents, 'CPU')
                },
                {
                    label: 'RAM',
                    click: () => ipcWebContentsSend('changeView', mainWindow.webContents, 'RAM')
                },
                {
                    label: 'STORAGE',
                    click: () => ipcWebContentsSend('changeView', mainWindow.webContents, 'STORAGE')
                }
            ]
        }
    ]));
}