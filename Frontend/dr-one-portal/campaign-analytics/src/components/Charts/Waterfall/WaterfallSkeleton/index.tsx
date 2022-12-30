import React, { useRef, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import './styles.css'
// charts library
// import * as am4core from '@amcharts/amcharts4/core'
// import * as am4charts from '@amcharts/amcharts4/charts'

//utils
import { CreateRandomIdChart } from '../../Utils'
import { WATERFALL_COLORS } from '../../Utils/constants'

const useStyles = makeStyles({
  containerChart: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '400px',
    width: '100%',
  },
})

type Props = {
  className?: string
}

const WaterfallSkeleton: React.FC<Props> = ({ className  }) => {
  const chart: any = useRef(null)
  const [idChart] = useState(CreateRandomIdChart('skeleton'))
  const classes = useStyles()

  useEffect(() => {
    // let x = am4core.create(idChart, am4charts.XYChart)

    // const dataForChart: any = [
    //   {
    //     category: 'Targeted',
    //     parent: 'Push',
    //     value: 100,
    //     open: 0,
    //     stepValue: 100,
    //     color: am4core.color(WATERFALL_COLORS[0]),
    //   },
    //   {
    //     category: 'Sent',
    //     parent: 'Push',
    //     value: 100 - 25,
    //     open: 95,
    //     stepValue: 100 - 25,
    //     color: am4core.color(WATERFALL_COLORS[1]),
    //   },
    //   {
    //     category: 'Reached',
    //     parent: 'Push',
    //     value: 100 - 25 - 15,
    //     open: 100 - 20,
    //     stepValue: 100 - 30 - 20,
    //     color: am4core.color(WATERFALL_COLORS[2]),
    //   },
    //   {
    //     category: 'Push Impressions',
    //     parent: 'Push',
    //     value: 100 - 25 - 15 - 10,
    //     open: 100 - 25 - 15,
    //     stepValue: 100 - 25 - 15 - 10,
    //     color: am4core.color(WATERFALL_COLORS[3]),
    //   },
    //   {
    //     category: 'Push Clicks',
    //     parent: 'In-App',
    //     value: 100 - 25 - 15 - 10 - 10,
    //     open: 100 - 25 - 15 - 10,
    //     stepValue: 100 - 25 - 15 - 10 - 10,
    //     color: am4core.color(WATERFALL_COLORS[4]),
    //   },
    //   {
    //     category: 'Inapp Impressions',
    //     parent: 'In-App',
    //     value: 100 - 25 - 15 - 10 - 10 - 15,
    //     open: 100 - 25 - 15 - 10 - 5,
    //     stepValue: 100 - 25 - 15 - 10 - 10 - 15,
    //     color: am4core.color(WATERFALL_COLORS[5]),
    //   },
    //   {
    //     category: 'Inapp Clicks',
    //     parent: 'In-App',
    //     value: 100 - 25 - 15 - 10 - 5 - 5 - 5,
    //     open: 0,
    //     color: am4core.color(WATERFALL_COLORS[6]),
    //   },
    // ]

    // x.data = dataForChart

    // const categoryAxis = x.xAxes.push(new am4charts.CategoryAxis())
    // categoryAxis.dataFields.category = 'category'
    // categoryAxis.renderer.minGridDistance = 10
    // categoryAxis.renderer.grid.template.disabled = true
    // categoryAxis.margin(20, 0, 0, 0)
    // categoryAxis.fontWeight = '100'
    // categoryAxis.cursorTooltipEnabled = false
    // const label_xAxis = categoryAxis.renderer.labels.template
    // label_xAxis.wrap = true
    // categoryAxis.events.on('sizechanged', function (ev) {
    //   let axis = ev.target
    //   let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
    //   axis.renderer.labels.template.maxWidth = cellWidth
    // })

    // const valueAxis = x.yAxes.push(new am4charts.ValueAxis())
    // valueAxis.renderer.grid.template.disabled = true
    // valueAxis.strictMinMax = true
    // valueAxis.cursorTooltipEnabled = false

    // const columnSeries = x.series.push(new am4charts.ColumnSeries())
    // columnSeries.dataFields.categoryX = 'category'
    // columnSeries.dataFields.valueY = 'value'
    // columnSeries.dataFields.openValueY = 'open'
    // columnSeries.tooltipText = null

    // const columnTemplate = columnSeries.columns.template
    // columnTemplate.strokeOpacity = 0
    // columnTemplate.propertyFields.fill = 'color'
    // columnTemplate.width = am4core.percent(45)

   /* let label = x.createChild(am4core.Label)
    label.html = `<div style='display: flex; flex-direction: row; align-items: center; justify-content: center'><div style='height: 15px; width: 15px; background-color: ${WATERFALL_COLORS[1]}; border-radius: 50%; margin-right: 5px'></div> <span>Push</span></div>`
    label.fontSize = 12
    label.align = 'right'
    label.isMeasured = false
    label.x = am4core.percent(85)
    label.y = am4core.percent(5)

    let label2 = x.createChild(am4core.Label)
    label2.html = `<div style='display: flex; flex-direction: row; align-items: center; justify-content: center'><div style='height: 15px; width: 15px; background-color: ${WATERFALL_COLORS[6]}; border-radius: 50%; margin-right: 5px'></div> <span>In-App</span></div>`
    label2.fontSize = 12
    label2.align = 'right'
    label2.isMeasured = false
    label2.x = am4core.percent(92)
    label2.y = am4core.percent(5)
*/
    // x.background.visible = false

    // const indicator: any = x.tooltipContainer.createChild(am4core.Container)
    // indicator.background.fillOpacity = 0
    // indicator.width = am4core.percent(100)
    // indicator.height = am4core.percent(100)

    // chart.current = x

    // return () => {
    //   x.dispose()
    // }
  }, [idChart])

  return (
    <div
      id={idChart}
      className={'waterFallSkeleton ' + ((className) ? className : classes.containerChart)}
    />
  )
}

export default WaterfallSkeleton
