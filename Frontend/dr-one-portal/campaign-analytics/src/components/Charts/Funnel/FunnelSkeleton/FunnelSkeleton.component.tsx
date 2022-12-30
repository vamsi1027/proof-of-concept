import { useRef, useEffect, useState } from 'react'
// import * as am4core from '@amcharts/amcharts4/core'
// import * as am4charts from '@amcharts/amcharts4/charts'
import {
  CreateRandomIdChart,
  DataInLineForFunnel,
  CreateFunnelColors,
  CreateFunnelMarginLabels,
} from '../../Utils/index'
import * as S from "./FunnelSkeleton.styles";

const FunnelSkeleton: React.FC = () => {
  const chart: any = useRef(null)
  const [idChart] = useState(CreateRandomIdChart('skeletonFunnel'))

  useEffect(() => {
    // const height: string = '400px'
    // let x = am4core.create(idChart, am4charts.SlicedChart)
    // const dataForChart: any = DataInLineForFunnel([
    //   'test1',
    //   'test2',
    //   'test3',
    //   'test4',
    //   'test5',
    // ])
    // const dataLength: number = dataForChart.length
    // x.data = dataForChart

    // const indicator: any = x.tooltipContainer.createChild(am4core.Container)
    // indicator.background.fillOpacity = 0
    // indicator.width = am4core.percent(100)
    // indicator.height = am4core.percent(100)

    // let series = x.series.push(new am4charts.FunnelSeries())
    // series.dataFields.value = 'value'
    // series.dataFields.category = 'name'
    // series.alignLabels = true
    // series.labelsOpposite = false
    // series.labels.template.html = `<span>{category}</span>`
    // series.ticks.template.strokeOpacity = 0.15
    // series.ticks.template.strokeDasharray = '5,5'
    // series.ticks.template.strokeWidth = 0.5
    // series.sliceLinks.template.height = x.data.length > 4 ? 15 : 25
    // series.ticks.template.locationX = 100
    // series.ticks.template.locationY = 0
    // series.slices.template.tooltipText = 'gffff'
    // series.colors.list = CreateFunnelColors(dataForChart.length)
    // x.legend = new am4charts.Legend()
    // x.legend.markers.template.disabled = false
    // x.legend.position = 'right'
    // x.legend.labels.template.text = '[/]'
    // x.legend.valign = 'top'
    // x.legend.margin(0, 0, 0, 0)
    // x.legend.visible = false

    // let lenghtY: number = Math.round(100 / dataLength)
    // //@ts-ignore
    // const max: number = dataForChart.reduce(
    //   (acc: any, shot: any) => (acc = acc > shot.value ? acc : shot.value),
    //   0,
    // )
    // dataForChart.forEach((value: any, index: any) => {
    //   let label = x.createChild(am4core.Label)
    //   // create custom html
    //   let color = '#000'
    //   let backGround = '#f5f5f5'
    //   let percentCalc: string = '100'
    //   if (index > 0) {
    //     percentCalc = Math.round((value.value / max) * 100).toString()
    //   }
    //   const labelRest: number = height === '400px' ? 12 : 7
    //   label.html = `<div style='background-color: ${backGround}; padding: 7px; text-align: center; border-radius: 5px;'><span style='font-weight: 700; color: ${color}'>${percentCalc}%</span></div>`
    //   label.fontSize = 10
    //   label.align = 'left'
    //   label.isMeasured = false
    //   label.x = am4core.percent(90)
    //   label.y = am4core.percent(lenghtY * (index + 1) - labelRest)
    // })

    // x.legend.margin(0, 0, 0, 20)

    // let marginLabels: string = CreateFunnelMarginLabels(dataLength)
    // x.legend.labels.template.html = `<p style='margin-top: ${marginLabels}'>&nbsp;</p>`

    // chart.current = x
    // return () => {
    //   x.dispose()
    // }
  }, [])

  return (
    <S.Container>
        <div
      id={idChart}
      className="funnelSkeleton"
    />
    </S.Container>
    
  )
}

export default FunnelSkeleton;
