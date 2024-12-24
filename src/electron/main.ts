import {app, BrowserWindow} from 'electron';
import path from 'path';
app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
});