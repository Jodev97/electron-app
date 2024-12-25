import { useMemo } from "react"
import { BaseChart } from "./BaseChart"
export type ChartProps = {
    data: number[],
    maxDataPoints: number,
    fill: string,
    stroke: string
}

const Chart = (props: ChartProps) => {

    const prepareData = useMemo(() => {
        const points = props.data.map(point => ({ value: point * 100 }))
        return [
            ...points,
            ...Array(props.maxDataPoints - points.length).fill(0)    
        ]
    }, [props.data])
    return (
        <BaseChart
            data={prepareData}
            fill={props.fill}
            stroke={props.stroke}
        />)
}

export default Chart
