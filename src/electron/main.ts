import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { pollResource } from './resourceManager.js';
app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }

  pollResource();
});