// charts library
// import * as am4core from '@amcharts/amcharts4/core';

// utils/constants
import { FUNNEL_COLORS } from './constants';

export const CreateRandomIdChart = (typeChart = 'noname'): string => {
  return typeChart
    .concat(Math.floor(Date.now() / 1000).toString())
    .concat(Math.floor(Math.random() * (1000 - 1) + 1).toString())
    .concat(Math.floor(Math.random() * (1000 - 1) + 1).toString());
};

export const DataInLineForFunnel = (seriesName: string[]): any => {
  let finalData: any = [];
  seriesName.forEach((value, index) => {
    const max = (seriesName.length - index) * 900 + (index === 0 ? 600 : 0);
    const min =
      max -
      Math.floor(Math.random() * (700 - 200) + 200) -
      (index === seriesName.length - 1 ? 200 : 0);
    finalData.push({
      name: value,
      value: Math.floor(Math.random() * (max - min) + min),
    });
  });
  return finalData;
};

export const CreateFunnelColors = (totalSeries: number): any => {
  let incremetal: number = 0;
  let totalAdd: number = 0;
  return FUNNEL_COLORS.map((value, index) => {
    if (totalAdd < totalSeries) {
      // if (totalSeries > 5) {
      //   totalAdd++;
      //   return am4core.color(value);
      // } else {
      //   totalAdd++;
      //   incremetal = index + 1;
      //   if (totalSeries < 5) {
      //     incremetal++;
      //   }
      //   return am4core.color(FUNNEL_COLORS[incremetal]);
      // }
    }
  }).filter((value) => {
    return value !== undefined;
  });
};

export const CreateFunnelMarginLabels = (totalSeries: number): string => {
  switch (totalSeries) {
    case 1:
      return '5rem';
    case 2:
      return '6rem';
    case 3:
      return '3.5rem';
    case 4:
      return '2.25rem';
    case 5:
      return '1.25rem';
    case 6:
      return '0.5rem';
    case 7:
      return '0.10rem';
    default:
      return '0';
  }
};
