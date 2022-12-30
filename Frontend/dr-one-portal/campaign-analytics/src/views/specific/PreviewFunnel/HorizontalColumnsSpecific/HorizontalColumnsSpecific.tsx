import React, { useContext } from 'react'
import { GraphCardLayout, RowLayout } from '../../../../Layouts'
import { HorizontalColumnChart } from '../../../../components/Charts';
import { icon_n1, icon_n2 } from '../../../../assets'
import { ContextSpecific } from "../../context/context-specific";
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';


type Props = {
  id?: string
  type?: string
}

const HorizontalColumnsSpecific: React.FunctionComponent<Props> = ({ id, type }) => {

  const { data } = useContext(ContextSpecific);
  const columns: number = (data.campaignType === 'PUSH' || data.campaignType === 'INAPP') ? 1 : 2;
  const { t } = useTranslation();

  let listCharts = [];
  if (columns === 2) {
    listCharts = [t('CAMPAIGN_ANALYTICS_CAMPAIGN_TYPE_PUSH'), t('CAMPAIGN_ANALYTICS_CAMPAIGN_TYPE_IN_APP')];
  } else {
    if (type === 'PUSH') {
      listCharts = [t('CAMPAIGN_ANALYTICS_CAMPAIGN_TYPE_PUSH')];
    } else {
      listCharts = [t('CAMPAIGN_ANALYTICS_CAMPAIGN_TYPE_IN_APP')];
    }
  }

  const props = {
    parent: {
      columns: 1,
      style: { minHeight: '10rem', margin: '1rem 0' },
    },

    graph1: {
      title: 'Push Text',
      avatar: icon_n1,
      raised: true,
      isExportable: false,
    },

    // graph2: {
    //   title: 'Inapp Message',
    //   avatar: icon_n2,
    //   raised: true,
    //   isExportable: false,
    // },
  }

  return (
    <>
      <Grid container>
        {data?.campaignmeterics && listCharts.map((val, index) => (
          <GraphCardLayout
            key={index}
            title={val}
            raised={true}
            isExportable={false}
          >

            <HorizontalColumnChart data={{ ...data, ...{ campaignContainerType: val.toUpperCase().replace(/\s/g, "") } }} />
          </GraphCardLayout>
        ))}
      </Grid>
    </>
  )
}

export default React.memo(HorizontalColumnsSpecific)
