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

interface Window {
    electron: {
        subscribeStatistics: (callback: (stats: Statistics) => void) => void,
        getStaticData: () => Promise<StaticData>
    }
}