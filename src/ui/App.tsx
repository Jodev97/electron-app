import { useEffect, useMemo, useState } from 'react'

import './App.css'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart'

function SelectOption(props: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button className="selectOption" onClick={props.onClick}>
      <div className="selectOptionTitle">
        <div>{props.title}</div>
        <div>{props.subTitle}</div>
      </div>
      <div className="selectOptionChart">
        <Chart selectedView={props.view} data={props.data} maxDataPoints={10} />
      </div>
    </button>
  );
}

function Header() {
  return (
    <header>
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
    </header>
  );
}


function App() {
  const staticData = useStaticData();
  const statatics = useStatistics(10)
  const [activeView, setActiveView] = useState<View>('CPU')

  const cpuUsages = useMemo(() => statatics.map((s) => s.cpuUsage), [statatics])
  const ramUsages = useMemo(() => statatics.map((s) => s.ramUsage), [statatics])
  const storageUsages = useMemo(() => statatics.map((s) => s.storageUse), [statatics])

  const activeUsage = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuUsages
      case 'RAM':
        return ramUsages
      case 'STORAGE':
        return storageUsages
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages])

  useEffect(() => {
    window.electron.subscribeChangeView((view) => {
      setActiveView(view)
    })
  }, [])
  return (
    <div className='App'>
      <Header />
      <div className='main'>
        <div>
          <SelectOption
            onClick={() => setActiveView('CPU')}
            title="CPU"
            view="CPU"
            subTitle={staticData?.cpuModel ?? ''}
            data={cpuUsages}
          />
          <SelectOption
            onClick={() => setActiveView('RAM')}
            title="RAM"
            view="RAM"
            subTitle={(staticData?.totalMemoryGB.toString() ?? '') + ' GB'}
            data={ramUsages}
          />
          <SelectOption
            onClick={() => setActiveView('STORAGE')}
            title="STORAGE"
            view="STORAGE"
            subTitle={(staticData?.totalStorage.toString() ?? '') + ' GB'}
            data={storageUsages}
          />
        </div>
        <div className='mainGrid'>

          <Chart
            selectedView={activeView}
            data={activeUsage}
            maxDataPoints={10}
          />
        </div>

      </div>
    </div>
  )
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}


export default App
