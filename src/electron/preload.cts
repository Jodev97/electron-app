import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback) => {
        return ipcOn('statistics', (stats) => callback(stats));
    },
    getStaticData: async () => await ipcMainInvoke('getStaticData'),
    subscribeChangeView: (callback) => {
        return ipcOn('changeView', (view) => callback(view));
    },
    sendFrameAction: (payload) => ipcSend('sendFrameAction', payload),
} satisfies Window['electron']);

function ipcOn<Key extends keyof EventPayloadMapping>(key: Key, callback: (payload: EventPayloadMapping[Key]) => void) {
    const cb = (event: Electron.IpcRendererEvent, payload: any) => callback(payload)
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb)
}

function ipcMainInvoke<Key extends keyof EventPayloadMapping>(key: Key): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload: EventPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload);
}