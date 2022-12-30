import React from 'react'
import { ContextSpecific } from "./context/context-specific";
import { ContextCampaignType } from "./context/context-campaign-type";
import SkeletonLoader from "./SkeletonLoader/SkeletonLoader";
import useSpecific from "./useSpecific";
import { memo } from "react";
import { withRouter } from "react-router-dom";
import { userHasPermission } from "@dr-one/utils";
import { useCampaignType } from "./hooks/useCampaignType";
import * as S from "./Specific.style";
import RenderListSpecific, { ComponentListType } from './RenderListSpecific';
import { Grid } from '@material-ui/core';
import { Skeleton } from "@material-ui/lab";

const SpecificView = (properties) => {

  const [campaignType, changeCampaignType] = useCampaignType();

  let campaignTypeContextValue = {
    campaignTypeValue: { campaignType, changeCampaignType }
  }

  const hasPermission: boolean = userHasPermission([
    "R_CAMPAIGN",
    "R_CAMPAIGN_OWN_ORG",
    "R_CAMPAIGN_OWN",
  ])

  if (!hasPermission) {
    return (
      <Grid container>
        <Grid item xs={12}>
          You do not have permissions for this section.
        </Grid>
      </Grid>
    )
  }
  const { campaignData, campaignMetrics, props, campaignDataLoader, campaignMetricsLoader } = useSpecific(properties);

  if (campaignDataLoader || campaignMetricsLoader) return <Skeleton animation="wave" variant="rect"  width={950} height={50}/>;

  return (
    <S.Container>
      <ContextSpecific.Provider {...props.context}>
        <ContextCampaignType.Provider value={campaignTypeContextValue}>
          <main className="specific">
            {
              RenderListSpecific.map((val: ComponentListType, index: number) => {
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
        </ContextCampaignType.Provider>
      </ContextSpecific.Provider>
    </S.Container>

  );
};

export default withRouter(memo(SpecificView));
