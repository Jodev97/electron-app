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

type EventPayloadMapping = {
    statistics: Statistics,
    getStaticData: Promise<StaticData>
}

type UnsubscribeFunction = () => void

interface Window {
    electron: {
        subscribeStatistics: (callback: (stats: Statistics) => void) => UnsubscribeFunction,
        getStaticData: () => Promise<StaticData>
    }
}