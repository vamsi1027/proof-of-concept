import { apiDashboard, Colors } from "@dr-one/utils";
import { useUser } from "../../hooks/userHooks";
import { useEffect, useState } from "react";
import { Breadcrumbs, Typography, Link } from "@material-ui/core";
import * as S from "./DataRewadsAnalyticsGlobal.styles";
import CardAmountAreaChart from "../../components/Common/CardAmountAreaChart/CardAmountAreaChart";
import { Title } from "@dr-one/shared-component";

const responseApi = [
  {
    title: "Video watched",
    amount: 254.087,
    percentage: 12,
    time: 24,
    gains: 250,
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
  {
    title: "App installations per day",
    amount: 2.54,
    percentage: -1.5,
    time: 24,
    gains: 0,
    analytics: [
      {
        date: "2021-08-18",
        percent: 0,
      },
      {
        date: "2021-08-19",
        percent: 54,
      },
      {
        date: "2021-08-20",
        percent: 0,
      },
      {
        date: "2021-08-21",
        percent: 28,
      },
      {
        date: "2021-08-22",
        percent: 0,
      },
      {
        date: "2021-08-23",
        percent: 100,
      },
      {
        date: "2021-08-24",
        percent: 0,
      },
    ],
  },
  {
    title: "Banner visualization",
    amount: 12_224.697,
    percentage: 12,
    time: 24,
    gains: 250,
    analytics: [
      {
        date: "2021-08-18",
        percent: 25,
      },
      {
        date: "2021-08-19",
        percent: 154,
      },
      {
        date: "2021-08-20",
        percent: 94,
      },
      {
        date: "2021-08-21",
        percent: 170,
      },
      {
        date: "2021-08-22",
        percent: 130,
      },
      {
        date: "2021-08-23",
        percent: 164,
      },
      {
        date: "2021-08-24",
        percent: 125,
      },
    ],
  },
];

interface IDataRewadsAnalyticsGlobalProps {
  responseApi: {
    title: string;
    amount: number;
    percentage: number;
    time: number;
    gains: number;
    analytics: {
      date: string;
      percent: number;
    }[];
  }[];
}
interface Count {
  count?: number;
}

const DataRewadsAnalyticsGlobal = () => {
  const { user } = useUser();
  const [deviceData, setDevice] = useState<Count>();
  useEffect(() => {
    if (user && !!user.activePartner) {
      setDevice(null);
      const partnerUUID = user.activePartner.partner_uuid;
      apiDashboard
        .get(`/api/devices/count/?partner_uuid=${partnerUUID}`)
        .then(({ data }) => {
          setDevice(data.count);
        });
    }
  }, [user]);
  console.log();
  return (
    <S.Container>
      <S.Header>
        <S.Nav>
          <Breadcrumbs aria-label="breadcrumb" separator='>'>
            <Link
              color="inherit"
              href="#"
              onClick={(a) => console.log("value:", a)}
            >
              Data Rewards
            </Link>
            <Typography color="textPrimary">Anlytics</Typography>
          </Breadcrumbs>

          <Title title="Data Rewards Analytics" />
        </S.Nav>
      </S.Header>
      <S.Content>
        <S.Card className="AppInstallationsPerDay">
          <CardAmountAreaChart
            title={responseApi[1].title}
            amount={responseApi[1].amount}
            color={Colors.IN_PROGRESS}
            percentage={responseApi[1].percentage}
            gains={responseApi[1].gains}
            time={responseApi[1].time}
            icon={"/img/dra-app-installed-icon-bg.svg"}
            data={responseApi[1].analytics}
          />
        </S.Card>
        <S.Card className="VideoWatched">
          <CardAmountAreaChart
            title={responseApi[0].title}
            amount={responseApi[0].amount}
            color={Colors.BTNPRIMARY}
            percentage={responseApi[0].percentage}
            gains={responseApi[0].gains}
            time={responseApi[0].time}
            icon={"/img/dra-video-watched-icon.svg"}
            data={responseApi[0].analytics}
          />
        </S.Card>

        <S.Card className="BannerVisualization">
          <CardAmountAreaChart
            title={responseApi[2].title}
            amount={responseApi[2].amount}
            color={Colors.LOADING}
            percentage={responseApi[2].percentage}
            gains={responseApi[2].gains}
            time={responseApi[2].time}
            icon={"/img/dra-banner-visualization-icon.svg"}
            data={responseApi[2].analytics}
          />
        </S.Card>
      </S.Content>
    </S.Container>
  );
};

export default DataRewadsAnalyticsGlobal;
