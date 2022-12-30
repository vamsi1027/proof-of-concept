import React, { useState } from "react";
import { Button, makeStyles, Grid } from "@material-ui/core";

// chart
import { DateLineChart } from "../../../components/Charts";
import { CreateDummyData, DUMMY_SERIES_DATELINE } from "../../../components/Charts/Line/DateLine/utilsDateLine";

// tableEvents
import TableEvents, { eventsType } from "./TableEvents";

import { GraphCardLayout, RowLayout } from "../../../Layouts";
import { SeriesConfig } from "../../../components/Charts/Utils/chartsTypes";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    flexDirection: "column",
  },
  body: {
    height: '100%'
  },
  chartContainer: {
    height: '480px',
    padding: 0,
  },
  table: {
    overflow: "auto",
    height: "100%",
    paddingLeft: "20px",
    paddingTop: "10px",
    paddingRight: "5px",
    maxHeight: '450px'
  },
});

const EventsTriggerComponent: React.FunctionComponent = () => {

  const [dummyData] = useState<any[]>(CreateDummyData(DUMMY_SERIES_DATELINE));
  const [seriesVisible, setSeriesVisible] = useState<string[]>([]);
  const classes = useStyles();

  const toggleSeries = (e: string[]) => {
    setSeriesVisible(e)
  }

  // for dummy data only
  const getTotalsForTable = () :eventsType[]  => {
    const finalData: eventsType[] = [];
    DUMMY_SERIES_DATELINE.forEach((val: SeriesConfig, index: number) => {
      const percent: number = Math.floor(Math.random() * (100 - 7)) + 7
      finalData.push({
        key: val.key,
        name: val.name,
        percent: percent,
        total: Math.round(percent * (Math.random() * (6 - 2) + 2)),
      })
    })
    return finalData;
  }

  const props = {
    parent: { columns: 1, style: { minHeight: "25rem", margin: "1rem 0" } },
    graph: {
      title: "Events trigger by the campaign",
      raised: true,
      className: classes.boxContainer,
    },
    body: {
      className: classes.body,
    },
    chartContainer: {
      className: classes.chartContainer,
    },
    chart: {
      data: dummyData,
      seriesConfig: DUMMY_SERIES_DATELINE,
      listSeriesVisible: seriesVisible
    },
    tableContainer: {
      className: classes.table,
    },
    tableEvents: {
      changeSeriesVisible: (e: string[]) => toggleSeries(e),
      data: getTotalsForTable()
    },
  };

  return (
    <RowLayout {...props.parent}>
      <GraphCardLayout
        actions={
          <section style={{ marginLeft: "100%" }}>
            <Button variant="outlined">Last month</Button>
          </section>
        }
        {...props.graph}
      >
        <Grid container spacing={0} {...props.body}>
          <Grid item xs={12} md={8} {...props.chartContainer}>
            <DateLineChart {...props.chart} />
          </Grid>
          <Grid item xs={12} md={4} {...props.tableContainer}>
            <TableEvents {...props.tableEvents} />
          </Grid>
        </Grid>
      </GraphCardLayout>
    </RowLayout>
  );
};

export default React.memo(EventsTriggerComponent);
