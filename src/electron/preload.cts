import electron from 'electron';

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback) => {
        ipcOn('statistics', callback);
    },
    getStaticData: async () => await ipcMainInvoke('getStaticData')
} satisfies Window['electron']);

function ipcOn<Key extends keyof EventPayloadMapping>(key: Key, callback: (payload: EventPayloadMapping[Key]) => void) {
    electron.ipcRenderer.on(key, (_, payload) => callback(payload));
}

function ipcMainInvoke<Key extends keyof EventPayloadMapping>(key: Key): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}