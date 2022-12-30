import React, { useEffect, useState, useContext } from 'react'
// import subDate from 'date-fns/sub';
// import { DateRange } from 'materialui-daterange-picker';
import "./Aggregate.style.css";
import { userHasPermission } from "@dr-one/utils";

// components list
import RenderListAggregate, { ComponentListType } from './RenderListAggregate'

// material
import { Grid } from '@material-ui/core'
import { GlobalContext } from '../../context/globalState';
// import { CAMPAIGN_ANALYTICS_ACTIONS } from "../../context/CampaignAnalyticsReducer";

const AggregateView = () => {
  // const { dispatch } = useContext(GlobalContext);

  const hasPermission: boolean = userHasPermission([
    "R_CAMPAIGN",
    "R_CAMPAIGN_OWN_ORG",
    "R_CAMPAIGN_OWN",
  ])

  // useEffect(() => {
  //   // {
  //   //   startDate: new Date(helper.convertDateByTimeZone(
  //   //     orgData[orgIndex]?.timeZone
  //   //   ).getTime() - (2 * 24 * 60 * 60 * 1000)),
  //   //   endDate: helper.convertDateByTimeZone(
  //   //     orgData[orgIndex]?.timeZone),
  //   // }
  //   // {
  //   //
  //   //   startDate: subDate(new Date(), { days: 120 }),
  //   //   endDate: new Date(),
  //   // }
  //   dispatch({
  //     type: CAMPAIGN_ANALYTICS_ACTIONS.SET_DATE_RANGE,
  //     payload: {
  //       startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  //       endDate: new Date()
  //     }
  //   })
  // }, [])

  if (!hasPermission) {
    return (
      <Grid container>
        <Grid item xs={12}>
          You do not have permissions for this section.
        </Grid>
      </Grid>
    )
  }

  return (
    <main className="kpPvTx inner-container">
      {
        RenderListAggregate.map((val: ComponentListType, index: number) => {
          if (val.render) {
            return (
              <React.Fragment key={index}>
                {
                  val.component
                }
              </React.Fragment>
            )
          } else {
            return null
          }
        })
      }
    </main>
  );
};

export default AggregateView;
