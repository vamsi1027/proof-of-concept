import React, { useEffect, useRef, useState } from 'react'
import './styles.css'
// types
import { CreateRandomIdChart } from '../../../Utils'
// charts library
// import * as am4core from '@amcharts/amcharts4/core'
// utils for config chart
import { SkeletonConfig, CreateDummyData } from '../utilsClustered'

const ClusteredSkeleton: React.FC = () => {
  const chartRef: any = useRef(null)
  const [idChart] = useState<string>(CreateRandomIdChart('skeleton'))

  useEffect(() => {
    const series:string[] = ["test1", "test2"]
    chartRef.current && chartRef.current.dispose()
    chartRef.current = SkeletonConfig(
      idChart,
      series
    )
    chartRef.current.data = CreateDummyData(series)
    return () => {
      chartRef.current && chartRef.current.dispose()
    }
  }, [idChart])

  return (
    <div
      id={idChart}
      className='clusteredSkeleton'
      style={{
        width: '85%',
        height: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    />
  )
}

export default ClusteredSkeleton