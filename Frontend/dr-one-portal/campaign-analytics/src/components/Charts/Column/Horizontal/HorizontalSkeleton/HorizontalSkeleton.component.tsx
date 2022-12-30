import React, { useRef, useLayoutEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Grid } from '@material-ui/core'
// import * as am4core from '@amcharts/amcharts4/core'
// import * as am4charts from '@amcharts/amcharts4/charts'
// import am4themes_material from '@amcharts/amcharts4/themes/material'
// import am4themes_animated from '@amcharts/amcharts4/themes/animated'

//utils
import { CreateRandomIdChart } from '../../../Utils'
import { BAR_COLORS } from '../../../Utils/constants'
import * as S from "./HorizontalSkeleton.style";

const useStyles = makeStyles({
  containerChart: {
    display: 'flex',
    height: '100px',
    flexDirection: 'column',
    width: '100%',
  },
})


const HorizontalColumn: React.FC = () => {
  const chart: any = useRef(null)
  const [idChart] = useState(CreateRandomIdChart('HorizontalBar'))
  const [idExternalLegend] = useState(CreateRandomIdChart('legend'))
  const classes = useStyles()

  useLayoutEffect(() => {
    // am4core.useTheme(am4themes_animated)
    // am4core.useTheme(am4themes_material)
    // // am4core.addLicense("ch-custom-attribution");
    // let x = am4core.create(idChart, am4charts.XYChart)

    // // Add data
    // x.data = [
    //   {
    //     category: 'Impressions',
    //     value: Math.floor(Math.random() * (95 - 40) + 40),
    //     color: am4core.color(BAR_COLORS[1]),
    //   },
    //   {
    //     category: 'Clicks',
    //     value: Math.floor(Math.random() * (70 - 7) + 7),
    //     color: am4core.color(BAR_COLORS[0]),
    //   },
    // ]

    // const categoryAxis = x.yAxes.push(new am4charts.CategoryAxis())
    // categoryAxis.dataFields.category = 'category'
    // categoryAxis.renderer.grid.template.location = 0
    // categoryAxis.renderer.labels.template.disabled = true
    // categoryAxis.renderer.grid.template.disabled = true
    // categoryAxis.renderer.cellStartLocation = 1
    // categoryAxis.renderer.cellEndLocation = 1
    // categoryAxis.renderer.height = 0
    // categoryAxis.renderer.labels.template.wrap = true
    // categoryAxis.renderer.cellStartLocation = 0
    // categoryAxis.cursorTooltipEnabled = false
    // categoryAxis.fontWeight = '100'

    // const valueAxis = x.xAxes.push(new am4charts.ValueAxis())
    // valueAxis.min = 0
    // valueAxis.max = 100
    // valueAxis.strictMinMax = true
    // valueAxis.calculateTotals = true
    // valueAxis.renderer.minGridDistance = 100
    // valueAxis.cursorTooltipEnabled = false
    // valueAxis.renderer.grid.template.strokeOpacity = 0.15
    // valueAxis.renderer.grid.template.strokeDasharray = '5,5'
    // valueAxis.renderer.labels.template.adapter.add('text', function (text) {
    //   return `${text}%`
    // })

    // const series = x.series.push(new am4charts.ColumnSeries())
    // series.dataFields.valueX = 'value'
    // series.dataFields.categoryY = 'category'
    // series.name = 'value'
    // series.columns.template.width = am4core.percent(100)
    // series.columns.template.height = am4core.percent(40)
    // series.columns.template.column.cornerRadiusTopLeft = 10
    // series.columns.template.column.cornerRadiusTopRight = 10
    // series.columns.template.column.cornerRadiusBottomLeft = 10
    // series.columns.template.column.cornerRadiusBottomRight = 10
    // series.columns.template.propertyFields.fill = 'color'
    // series.tooltipText = null
    // series.strokeOpacity = 0
    // series.strokeWidth = 0
    // series.reverseOrder = true
    // series.fill = am4core.color('#000')

    // const indicator: any = x.tooltipContainer.createChild(am4core.Container)
    // indicator.background.fillOpacity = 0
    // indicator.background.fill = am4core.color('#fff')
    // indicator.width = am4core.percent(100)
    // indicator.height = am4core.percent(100)
    // indicator.zIndex = 'infinity'

    // x.paddingTop = 0
    // x.paddingBottom = 0
    // x.paddingLeft = 10
    // x.paddingRight = -20
    // chart.current = x

    // return () => {
    //   x.dispose()
    // }
  }, [idChart])

  return (
    <S.Container>
      <Grid container spacing={2}>
        <div id={idChart} className={classes.containerChart + ' horizontalColumnSkeleton'} />
      </Grid>
    </S.Container>
  )
}

export default HorizontalColumn
