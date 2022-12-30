import React, { useEffect, useRef, useState } from "react";

import { CreateRandomIdChart } from "../Utils";

// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4maps from "@amcharts/amcharts4/maps";
// import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import dummyDataMap from "./data";

// details chart
import DetailsGeo from "./detailsGeo";

const GeoMap: React.FC = () => {
  const chartRef: any = useRef(null);
  const [countrySelected, setCountrySelected] = useState<string | null>(null);
  const [idChart] = useState<string>(CreateRandomIdChart("GeoMap"));

  const backToMain = () => {
    setCountrySelected(null);
  };

  useEffect(() => {
    // chartRef.current && chartRef.current.dispose();

    // const chart = am4core.create(idChart, am4maps.MapChart);
    // // Set map definition
    // chart.geodata = am4geodata_worldHigh;
    // // Set projection
    // chart.projection = new am4maps.projections.Miller();

    // // Create map polygon series
    // var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    // polygonSeries.data = dummyDataMap();
    // //polygonSeries.mapPolygons.template.propertyFields.fill = "fill";

    // polygonSeries.heatRules.push({
    //   property: "fill",
    //   target: polygonSeries.mapPolygons.template,
    //   min: am4core.color("#5A6EFF"),
    //   max: am4core.color("#B7B7F3"),
    //   logarithmic: true,
    // });

    // // Make map load polygon (like country names) data from GeoJSON
    // polygonSeries.useGeodata = true;

    // // Configure series
    // var polygonTemplate = polygonSeries.mapPolygons.template;
    // polygonTemplate.tooltipText = "{name}";
    // polygonTemplate.fill = am4core.color("#FBFBFD");
    // polygonTemplate.strokeOpacity = 0.05;
    // polygonTemplate.stroke = am4core.color("#000");
    // polygonTemplate.events.on("hit", function (ev) {
    //   const data: any = ev.target.dataItem.dataContext;
    //   setCountrySelected(data.id);
    // });

    // // Create hover state and set alternative fill color
    // const hs = polygonTemplate.states.create("hover");
    // hs.properties.fill = am4core.color("#FFB192");

    // // Add zoom control
    // chart.zoomControl = new am4maps.ZoomControl();

    // // Add and configure small map
    // chart.smallMap = new am4maps.SmallMap();
    // chart.smallMap.series.push(polygonSeries);

    // // background
    // chart.backgroundSeries.mapPolygons.template.polygon.fill =
    //   am4core.color("#eef1fa");
    // chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

    // // zoom to latam
    // let zoomTo = ["CA", "NI", "AR"];
    // chart.events.on("ready", function (ev) {
    //   // Init extremes
    //   let north: number | undefined,
    //     south: number | undefined,
    //     west: number | undefined,
    //     east: number | undefined;
    //   // Find extreme coordinates for all pre-zoom countries
    //   for (let i = 0; i < zoomTo.length; i++) {
    //     let country = polygonSeries.getPolygonById(zoomTo[i]);
    //     if (north == undefined || country.north > north) {
    //       north = country.north;
    //     }
    //     if (south == undefined || country.south < south) {
    //       south = country.south;
    //     }
    //     if (west == undefined || country.west < west) {
    //       west = country.west;
    //     }
    //     if (east == undefined || country.east > east) {
    //       east = country.east;
    //     }
    //     country.isActive = true;
    //   }
    //   // Pre-zoom
    //   // @ts-ignore
    //   chart.zoomToRectangle(north, east, south, west, 2, true);
    // });
    // chartRef.current = chart;

    // return () => {
    //   chartRef.current && chartRef.current.dispose();
    // };
  }, []);

  return (
    <>
      <div
        id={idChart}
        style={{
          width: "100%",
          height: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          position: countrySelected ? "absolute" : "initial",
          visibility: countrySelected ? "hidden" : "visible",
        }}
      />
      {countrySelected && (
        <DetailsGeo back={backToMain} currentMap={countrySelected} />
      )}
    </>
  );
};

export default GeoMap;
