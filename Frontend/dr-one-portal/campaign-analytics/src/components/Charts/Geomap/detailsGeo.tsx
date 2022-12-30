import React, { useEffect, useRef, useState } from "react";

import { CreateRandomIdChart } from "../Utils";

// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4maps from "@amcharts/amcharts4/maps";
// import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
// import am4geodata_brazilLow from "@amcharts/amcharts4-geodata/brazilLow";
// import am4geodata_NicaraguaLow from "@amcharts/amcharts4-geodata/nicaraguaLow";
// import am4geodata_MexicoLow from "@amcharts/amcharts4-geodata/mexicoLow";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  boxContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },
});

type Props = {
  back: () => void;
  currentMap: string;
};

const DetailsGeo: React.FC<Props> = ({ back, currentMap }) => {
  const chartRef: any = useRef(null);
  const [idChart] = useState<string>(CreateRandomIdChart("GeoMap"));
  const classes = useStyles();

  useEffect(() => {
    // chartRef.current && chartRef.current.dispose();

    // const chart = am4core.create(idChart, am4maps.MapChart);
    // const idCharts: any[] = [
    //   am4geodata_usaLow,
    //   am4geodata_brazilLow,
    //   am4geodata_NicaraguaLow,
    //   am4geodata_MexicoLow,
    // ];
    // // Set map definition
    // chart.geodata = idCharts[Math.floor(Math.random() * 3)];
    // // Set map definition
    // // Set projection
    // chart.projection = new am4maps.projections.Mercator();

    // // Create map polygon series
    // const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // // Make map load polygon (like country names) data from GeoJSON
    // polygonSeries.useGeodata = true;

    // //Set min/max fill color for each area
    // polygonSeries.heatRules.push({
    //   property: "fill",
    //   target: polygonSeries.mapPolygons.template,
    //   min: am4core.color("#5569FF82").brighten(1),
    //   max: am4core.color("#5569FF82").brighten(-0.3),
    // });

    // // Set up heat legend
    // let heatLegend = chart.createChild(am4maps.HeatLegend);
    // heatLegend.series = polygonSeries;
    // heatLegend.width = am4core.percent(40);
    // heatLegend.marginLeft = am4core.percent(4);
    // heatLegend.valign = "bottom";
    // heatLegend.align = "left";

    // // Configure series
    // const polygonTemplate = polygonSeries.mapPolygons.template;
    // polygonTemplate.tooltipText = "{name}";
    // polygonTemplate.fill = am4core.color("#5569FF82");
    // polygonTemplate.strokeOpacity = 0.07;
    // polygonTemplate.stroke = am4core.color("#000");

    // // background
    // chart.backgroundSeries.mapPolygons.template.polygon.fill =
    //   am4core.color("#eef1fa");
    // chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

    // // Create hover state and set alternative fill color
    // const hs = polygonTemplate.states.create("hover");
    // hs.properties.fill = am4core.color("#FFB192");

    // // Add zoom control
    // chart.zoomControl = new am4maps.ZoomControl();

    // chartRef.current = chart;

    // return () => {
    //   chartRef.current && chartRef.current.dispose();
    // };
  }, []);

  return (
    <>
      <div className={classes.boxContainer}>
        <div
          id={idChart}
          style={{ width: "55%", height: "100%", marginRight: "auto" }}
        />
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => back()}
          style={{ height: "30px", marginRight: "auto" }}
        >
          Back to world map
        </Button>
      </div>
    </>
  );
};

export default DetailsGeo;
