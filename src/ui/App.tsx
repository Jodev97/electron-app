import { useMemo, useState } from 'react'

import './App.css'
import { useStatistics } from './useStatistics'
import Chart from './Chart'

function App() {
  const [count, setCount] = useState(0)
  const statatics = useStatistics(10)
  const cpuUsages = useMemo(() => statatics.map((s) => s.cpuUsage), [statatics])

  return (
    <div className='App'>
      <div style={{ height: 120 }}>

        <Chart
          maxDataPoints={10}
          data={cpuUsages}
          fill={"#0a4d5c"}
          stroke={"#5DD4EE"} />
      </div>
      <h1>Electron app</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
