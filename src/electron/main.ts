import { app, BrowserWindow } from 'electron';
import { ipcMainHandle, isDev } from './util.js';
import { getStaticData, pollResource } from './resourceManager.js';
import { getPreloadPath, getUIPath } from './pathResolve.js';

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: getPreloadPath()
    }
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
});