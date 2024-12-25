import { app, BrowserWindow, Menu } from 'electron';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getStaticData, pollResource } from './resourceManager.js';
import { getPreloadPath, getUIPath } from './pathResolve.js';
import { createTray } from './tray.js';
import { createMenu } from './menu.js';

Menu.setApplicationMenu(null);

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath()
    },
    frame: false,
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResource(mainWindow);

  ipcMainHandle('getStaticData', async (): Promise<StaticData> => {
    const { totalStorage, cpuModel, totalMemoryGB } = await getStaticData();
    return {
      totalStorage: totalStorage || 0,
      cpuModel,
      totalMemoryGB
    };
  });

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
      case 'MAXIMIZE':
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        break

      default:
        break;
    }
  });
  createTray(mainWindow);
  createMenu(mainWindow);
  handleCloseEvents(mainWindow);
});


function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  })
}