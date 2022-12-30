// charts library
// import * as am4core from '@amcharts/amcharts4/core'
// import * as am4charts from '@amcharts/amcharts4/charts'
// import am4themes_material from '@amcharts/amcharts4/themes/material'
// import am4themes_animated from '@amcharts/amcharts4/themes/animated'
// import { XYSeries } from '@amcharts/amcharts4/charts'

// global utils for charts
import { BAR_COLORS } from '../../Utils/constants'

const STYLE_CONTAINER_TOOLTIP =
  'display: flex; flex-direction: column; padding: 0.3rem; min-height: 30px; font-size: 12px; max-width: 250px;'

export const MakeChartConfig = (
  idChart: string,
  series: string[] = [],
  usingCampaignTooltip: boolean = false,
  history: any,
  usingHistory: boolean,
  urlType: string
) => {
  // am4core.useTheme(am4themes_animated)
  // am4core.useTheme(am4themes_material)
  
  // let chart = am4core.create(idChart, am4charts.XYChart)

  // // legend
  // chart.legend = new am4charts.Legend()
  // chart.legend.useDefaultMarker = true
  // chart.legend.position = 'bottom'
  // const marker: any = chart.legend.markers.template.children.getIndex(0)
  // marker.cornerRadius(12, 12, 12, 12)
  // marker.strokeWidth = 1
  // marker.strokeOpacity = 0.1
  // marker.height = 15
  // marker.width = 15
  // marker.vAlign = 'middle'
  // marker.stroke = am4core.color('#ccc')

  // // xAxis
  // const xAxis: any = chart.xAxes.push(new am4charts.CategoryAxis())
  // xAxis.dataFields.category = 'category'
  // xAxis.renderer.cellStartLocation = 0.2
  // xAxis.renderer.cellEndLocation = 0.8
  // xAxis.renderer.grid.template.strokeOpacity = 0
  // xAxis.renderer.grid.template.location = 0
  // xAxis.renderer.minGridDistance = 0
  // xAxis.renderer.grid.template.disabled = true

  // if (usingHistory) {
  //   // Add events
  //   xAxis.renderer.labels.template.events.on('hit', function (ev: any) {
  //     const { category } = ev.target.dataItem.dataContext
  //     history.push(`/campaign/manage/${category}/${urlType}`)
  //   })
  //   xAxis.renderer.labels.hoverable = true
  //   xAxis.renderer.labels.template.events.on('over', function (ev: any) {
  //     let axis = ev.target
  //     axis.fontWeight = 800
  //     axis.cursorOverStyle = am4core.MouseCursorStyle.pointer
  //   })
  //   xAxis.renderer.labels.template.events.on('out', function (ev: any) {
  //     let axis = ev.target
  //     axis.fontWeight = 400
  //     axis.cursorOverStyle = am4core.MouseCursorStyle.default
  //   })
  // }

  // const label_xAxis = xAxis.renderer.labels.template
  // label_xAxis.truncate = true
  // xAxis.events.on('sizechanged', function (ev) {
  //   let axis = ev.target
  //   let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
  //   axis.renderer.labels.template.maxWidth = cellWidth
  // })
  // xAxis.margin(30, 0, 15, 0)

  // let axisTooltip = xAxis.tooltip
  // axisTooltip.background.fill = am4core.color('#223354')
  // axisTooltip.background.opacity = 0.85
  // axisTooltip.background.strokeWidth = 0
  // axisTooltip.background.cornerRadius = 5
  // axisTooltip.background.pointerLength = 0
  // axisTooltip.hoverOnFocus = true

  // if (usingCampaignTooltip) {
  //   xAxis.tooltip.label.adapter.add('html', function (
  //     text: string,
  //     target: any,
  //   ) {
  //     // target.dataItem
  //     if (target.dataItem) {
  //       const info = target.dataItem.dataContext
  //       return `
	// 			<div style='${STYLE_CONTAINER_TOOLTIP}'>
	// 				<span style='font-weight: bold; margin-bottom: 5px'>Campaign Detail</span>
	// 				<span style='font-weight: 200'><strong>Name:</strong> ${info.category}</span>
	// 				<span><strong>Start Date:</strong> ${info.startDate}</span>
	// 				<span><strong>End Date:</strong> ${info.endDate}</span>
	// 				<span><strong>Status:</strong> ${info.status}</span>
	// 				<span><strong>Agency:</strong> ${info.agency}</span>
	// 			</div>
	// 		`
  //     }
  //   })
  // } else {
  //   xAxis.tooltip.label.adapter.add('html', function (
  //     text: string,
  //     target: any,
  //   ) {
  //     if (target.dataItem) {
  //       const info = target.dataItem.dataContext
  //       return `
	// 			<div style='${STYLE_CONTAINER_TOOLTIP}'>
	// 				<span style='font-weight: bold; margin-bottom: 5px'>Details</span>
	// 				<span style='font-weight: 200'><strong>Name:</strong> ${info.category}</span>
	// 			</div>
	// 		`
  //     }
  //   })
  // }

  // xAxis.tooltip.ignoreBounds = true
  // xAxis.tooltip.adapter.add('dy', (dy: any) => {
  //   xAxis.tooltip.setBounds({ x: 0, y: 0, width: 100000, height: 100000 })
  //   return -xAxis.tooltip.pixelY
  // })
  // xAxis.tooltip.adapter.add('tooltipPosition', () => {
  //   return 'pointer'
  // })
  // xAxis.tooltip.adapter.add('valign', () => {
  //   return 'middle'
  // })

  // // yAxis
  // const yAxis = chart.yAxes.push(new am4charts.ValueAxis())
  // yAxis.min = 0
  // yAxis.renderer.grid.template.strokeOpacity = 0.08
  // yAxis.renderer.grid.template.strokeDasharray = '8,8'
  // yAxis.cursorTooltipEnabled = false
  // // @ts-ignore
  // yAxis.tooltip.strokeOpacity = 0

  // // create and config series
  // series.forEach((value, index) => {
  //   chart.series.push(createSeries(value, index))
  // })

  // // Add cursor
  // chart.cursor = new am4charts.XYCursor()
  // chart.cursor.lineY.disabled = true
  // chart.cursor.lineX.disabled = true

  // // valueAxis
  // //const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
  // //valueAxis.renderer.minGridDistance = 0.5;

  // const indicator: any = chart.tooltipContainer.createChild(am4core.Container)
  // indicator.background.fillOpacity = 0
  // indicator.background.fill = am4core.color('#fff')
  // indicator.width = am4core.percent(100)
  // indicator.height = am4core.percent(100)
  // indicator.zIndex = 'infinity'

  return 
}

const createSeries = (value: string, index: number) => {
  // let temp: XYSeries = new am4charts.ColumnSeries()
  // temp.dataFields.valueY = value
  // temp.dataFields.categoryX = 'category'
  // temp.name = value
  // temp.fill = am4core.color(BAR_COLORS[index])
  // // @ts-ignore
  // temp.columns.template.width = am4core.percent(92)
  // // @ts-ignore
  // temp.columns.template.column.cornerRadiusTopLeft = 5
  // // @ts-ignore
  // temp.columns.template.column.cornerRadiusTopRight = 5
  // // @ts-ignore
  // temp.columns.template.column.cornerRadiusBottomLeft = 5
  // // @ts-ignore
  // temp.columns.template.column.cornerRadiusBottomRight = 5

  // // Add a drop shadow filter on columns
  // // @ts-ignore
  // var shadow = temp.columns.template.filters.push(
  //   new am4core.DropShadowFilter(),
  // )
  // shadow.opacity = 0.1

  // // Create a hover state
  // // @ts-ignore
  // const hoverState = temp.columns.template.states.create('hover')
  // hoverState.properties.dx = -2
  // hoverState.properties.dy = -2

  // const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter())
  // hoverShadow.dx = 6
  // hoverShadow.dy = 6
  // hoverShadow.opacity = 0.3

  return 
}

export const CreateDummyData = (
  series: string[] = [],
  category: string = 'C',
): any[] => {
  const dummyData: any[] = []
  const totalCategory: number = Math.floor(Math.random() * (8 - 3)) + 3
  const status: string[] = [
    'Approved',
    'Paused',
    'Removed',
    'Limited by budget',
  ]
  const agency: string[] = [
    'Claro Colombia',
    'Nicaragua',
    'DigitalReef',
    'Claro Mex',
  ]
  new Array(totalCategory).fill(0).forEach((val: number, index: number) => {
    let tempData: any = {}
    series.forEach((x: string) => {
      tempData[x] = Math.floor(Math.random() * (95 - 16)) + 16
      tempData.startDate = '01/01/2021'
      tempData.endDate = '03/03/2021'
      tempData.status = status[Math.floor(Math.random() * 3)]
      tempData.agency = agency[Math.floor(Math.random() * 3)]
    })
    dummyData.push({
      category: category.concat(' ').concat((index + 1).toString()),
      ...tempData,
    })
  })
  return dummyData
}

export const SkeletonConfig = (idChart: string,
  series: string[] = []) => {
    
    // let chart = am4core.create(idChart, am4charts.XYChart)
  
    // // legend
    // chart.legend = new am4charts.Legend()
    // chart.legend.useDefaultMarker = true
    // chart.legend.position = 'bottom'
    // const marker: any = chart.legend.markers.template.children.getIndex(0)
    // marker.cornerRadius(12, 12, 12, 12)
    // marker.strokeWidth = 1
    // marker.strokeOpacity = 0.1
    // marker.height = 15
    // marker.width = 15
    // marker.vAlign = 'middle'
    // marker.stroke = am4core.color('#ccc')
  
    // // xAxis
    // const xAxis: any = chart.xAxes.push(new am4charts.CategoryAxis())
    // xAxis.dataFields.category = 'category'
    // xAxis.renderer.cellStartLocation = 0.2
    // xAxis.renderer.cellEndLocation = 0.8
    // xAxis.renderer.grid.template.strokeOpacity = 0
    // xAxis.renderer.grid.template.location = 0
    // xAxis.renderer.minGridDistance = 0
    // xAxis.renderer.grid.template.disabled = true
  
    // // yAxis
    // const yAxis = chart.yAxes.push(new am4charts.ValueAxis())
    // yAxis.min = 0
    // yAxis.renderer.grid.template.strokeOpacity = 0.08
    // yAxis.renderer.grid.template.strokeDasharray = '8,8'
    // yAxis.cursorTooltipEnabled = false
    // // @ts-ignore
    // yAxis.tooltip.strokeOpacity = 0
  
    // // create and config series
    // series.forEach((value, index) => {
    //   chart.series.push(createSeries(value, index))
    // })

    // const indicator: any = chart.tooltipContainer.createChild(am4core.Container)
    // indicator.background.fillOpacity = 0
    // indicator.background.fill = am4core.color('#fff')
    // indicator.width = am4core.percent(100)
    // indicator.height = am4core.percent(100)
    // indicator.zIndex = 'infinity'
  
    return 

}