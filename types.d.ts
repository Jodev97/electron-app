type Statistics = {
    cpuUsage: number,
    ramUsage: number,
    storageUse: number
}

type StaticData = {
    totalStorage: number,
    cpuModel: string,
    totalMemoryGB: number
}

type FrameWindowAction = 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE'

type EventPayloadMapping = {
    statistics: Statistics,
    getStaticData: Promise<StaticData>,
    changeView: View,
    sendFrameAction: FrameWindowAction
}

type UnsubscribeFunction = () => void

type View = 'CPU' | 'RAM' | 'STORAGE'
interface Window {
    electron: {
        subscribeStatistics: (callback: (stats: Statistics) => void) => UnsubscribeFunction,
        getStaticData: () => Promise<StaticData>,
        subscribeChangeView: (callback: (view: View) => void) => UnsubscribeFunction,
        sendFrameAction: (payload: FrameWindowAction) => void
    }
}