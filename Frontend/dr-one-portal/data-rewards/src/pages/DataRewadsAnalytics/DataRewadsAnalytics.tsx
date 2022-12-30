import { useEffect, useState } from "react";
// IMPORTING UTILS FUNCTION FROM OTHER MICRO-APP
import { apiDashboard, Colors } from "@dr-one/utils";
import { useUser } from "../../hooks/userHooks";
import { Breadcrumbs, Typography, Link } from "@material-ui/core";
import * as S from "./DataRewadsAnalytics.styles";
import Title from "../../components/Common/Title/TitleView";
import CardDisplay from "../../components/Common/CardDisplay/CardDisplay";
import CardStatus from "../../components/Common/CardStatus/CardStatus";
import CardAmount from "../../components/Common/CardAmount/CardAmount";
import BudgetAllocation from "../../components/Common/BudgetAllocation/BudgetAllocation";
import AvailableData from "../../components/Common/AvailableData/AvailableData";
import NumberOfAppInstallations from "../../components/Common/NumberOfAppInstallations/NumberOfAppInstallations";

const requestApi = {
  nameCampaing: 'name Campaing',
  status:{
    start: '2021/07/29',
    end: '2021/11/29',
    status: 'Active'
  },
  videoViews:{
    title: 'Video views',
    amount: 56_475.00,
    percentage: 12.5,
    time: 24,
    analytics: [
      {
        date: "2021-08-18",
        percent: 25,
      },
      {
        date: "2021-08-19",
        percent: 54,
      },
      {
        date: "2021-08-20",
        percent: 34,
      },
      {
        date: "2021-08-21",
        percent: 97,
      },
      {
        date: "2021-08-22",
        percent: 65,
      },
      {
        date: "2021-08-23",
        percent: 100,
      },
      {
        date: "2021-08-24",
        percent: 34,
      },
    ],
  },
  appInstalled:{
    title: 'App Installed',
    amount: 5.24,
    percentage: 0,
    time: 24,
    analytics: [
      {
        date: "2021-08-18",
        percent: 25,
      },
      {
        date: "2021-08-19",
        percent: 54,
      },
      {
        date: "2021-08-20",
        percent: 34,
      },
      {
        date: "2021-08-21",
        percent: 97,
      },
      {
        date: "2021-08-22",
        percent: 65,
      },
      {
        date: "2021-08-23",
        percent: 100,
      },
      {
        date: "2021-08-24",
        percent: 34,
      },
    ],
  },
  budgetAllocation:[
    {
      title: "CPV for each video",
      value: 1050123.23
    },
    {
      title: "CPV for app install",
      value: 105.23,
    },
    {
      title: "Total budget",
      value: 100050123.23,
    },
  ],
  numberOfAppInstallations:[
    {
      name: 'Page A',
      pv: 25,
      uv: 15,
    },
    {
      name: 'Page B',
      pv: 15,
      uv: 9,
    },
    {
      name: 'Page C',
      pv: 28,
      uv: 20,
    },
    {
      name: 'Page D',
      pv: 14,
      uv: 12,
    },
    {
      name: 'Page E',
      pv: 24,
      uv: 28,
    },
    {
      name: 'Page F',
      pv: 20,
      uv: 22,
    },
    {
      name: 'Page G',
      pv: 25,
      uv: 14,
    },
  ],
  avaliable:{
    percentage: 85
  }
}
interface Count {
  count?: number;
}
export default function DataRewadsAnalytics() {
  const {status, videoViews, appInstalled, budgetAllocation, numberOfAppInstallations, avaliable, nameCampaing} = requestApi
  // const { user } = useUser();
  // const [deviceData, setDevice] = useState<Count>();
  // useEffect(() => {
  //   if (user && !!user.activePartner) {
  //     setDevice(null);
  //     const partnerUUID = user.activePartner.partner_uuid;
  //     apiDashboard
  //       .get(`/api/devices/count/?partner_uuid=${partnerUUID}`)
  //       .then(({ data }) => {
  //         setDevice(data.count);
  //       });
  //   }
  // }, [user]);
  return (
    <S.Container className="data-rewards-analytics">
      <S.Header>
        <S.Nav>
          <Breadcrumbs aria-label="breadcrumb" separator='  >  '>
            <Link
              color="inherit"
              href="#"
              onClick={(a) => console.log("value:", a)}
            >
              Data Rewards
            </Link>
            <Link
              color="inherit"
              href="#"
              onClick={(a) => console.log("value:", a)}
            >
              Anlytics
            </Link>
            <Typography color="textPrimary">Campaign name</Typography>
          </Breadcrumbs>
          <Title title="Data Rewards Analytics" />
        </S.Nav>
      </S.Header>
      <S.Content>
        <S.Card className="display">
          <CardDisplay />
        </S.Card>
        <S.Card className="status">
          <CardStatus status={status} nameCampaing={nameCampaing}/>
        </S.Card>
        <S.Card className="videoViews">
          <CardAmount
            time={videoViews.time}
            title={videoViews.title}
            amount={videoViews.amount}
            percentage={videoViews.percentage}
            analytics={videoViews.analytics}
            icon={"/img/dra-video-views-icon.svg"}
            color={Colors.BTNPRIMARY}
          />
        </S.Card>
        <S.Card className="preview">
          preview
        </S.Card>
        <S.Card className="budget">
          <BudgetAllocation budgetAllocation={budgetAllocation} />
        </S.Card>
        <S.Card className="installed">
          <CardAmount
            time={appInstalled.time}
            title={appInstalled.title}
            amount={appInstalled.amount}
            percentage={appInstalled.percentage}
            analytics={appInstalled.analytics}
            icon={"/img/dra-app-installed-icon.svg"}
            color={Colors.SUCCESS}
          />
        </S.Card>
        <S.Card className="numberInstalation">
          <NumberOfAppInstallations data={numberOfAppInstallations} />
        </S.Card>
        <S.Card className="avaliable">
          <AvailableData percentage={avaliable.percentage}/>
        </S.Card>
      </S.Content>
    </S.Container>
  );
}
