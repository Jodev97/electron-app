import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback: (statitcs: any) => void) => {
        electron.ipcRenderer.on('statics', (_: any, stats: any) => callback(stats))
    },
    getStaticData: () => electron.ipcRenderer.invoke('getStaticData')
});
