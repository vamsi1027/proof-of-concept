import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
// types
import { BaseChartType } from '../../Utils/chartsTypes'
import { CreateRandomIdChart } from '../../Utils'

// utils for config chart
import { MakeChartConfig, CreateDummyData } from './utilsClustered'

type Props = BaseChartType & {
  data?: any[]
  usingCampaignTooltip?: boolean
  usingHistory?: boolean
  urlType?: string
}

const Clustered: React.FC<Props> = ({
  id,
  data,
  usingCampaignTooltip,
  usingDummyData,
  series,
  usingHistory,
  urlType,
}) => {
  let history = useHistory()
  const chartRef: any = useRef(null)
  const [idChart] = useState<string>(id || CreateRandomIdChart('clustered'))

  const makeSizeOfContainer = useCallback(
    (e: any) => {
      let containerDoom: Element | null = document.querySelector(`#${idChart}`)
      if (containerDoom) {
        let width: number = containerDoom.clientWidth
        const { target } = e
        const dataLength: number = target?.data.length | 0
        if (dataLength > 3) {
          if (width < 700 || dataLength > 6) {
            // @ts-ignore
            containerDoom.style.width = '100%'
          } else if (width > 1000) {
            // @ts-ignore
            containerDoom.style.width = `${dataLength * 12}%`
          }
        }
      }
    },
    [idChart],
  )

  useEffect(() => {
    chartRef.current && chartRef.current.dispose()
    chartRef.current = MakeChartConfig(
      idChart,
      series,
      usingCampaignTooltip,
      history,
      usingHistory,
      urlType,
    )
    chartRef.current.data = usingDummyData ? CreateDummyData(series) : data
    chartRef.current.events.on('validated', (e: any) => makeSizeOfContainer(e))
    return () => {
      chartRef.current && chartRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current && chartRef.current.dispose()
      chartRef.current = MakeChartConfig(
        idChart,
        series,
        usingCampaignTooltip,
        history,
        usingHistory,
        urlType,
      )
      chartRef.current.data = usingDummyData ? CreateDummyData(series) : data
      chartRef.current.events.on('validated', (e: any) =>
        makeSizeOfContainer(e),
      )
      chartRef.current.data = data
    }
  }, [data , usingDummyData])

  return (
    <div
      id={idChart}
      style={{
        width: '85%',
        height: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    />
  )
}

export default Clustered
