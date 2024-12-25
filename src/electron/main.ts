import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ipcMainHandle, isDev } from './util.js';
import { getStaticData, pollResource } from './resourceManager.js';
import { getPreloadPath } from './pathResolve.js';

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
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
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