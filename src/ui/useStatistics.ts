import { useEffect, useState } from "react";

export function useStatistics(dataPointCount: number) {
    const [statistics, setStatistics] = useState<Statistics[]>([]);

    useEffect(() => {
        const unsub = window.electron.subscribeStatistics((stats) =>
         setStatistics((prev) => [...prev, stats].slice(-dataPointCount)));
        return unsub;
    }, []);

    return statistics;
}