import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import SettingsTwoToneIcon from "@material-ui/icons/SettingsTwoTone";
import SearchIcon from "@material-ui/icons/Search";
import * as S from "./PageDataRewards.styles";

import { Title } from "@dr-one/shared-component";
import { Colors } from "@dr-one/utils";
import DataRewardsTable, {
  IDataRewardsList,
} from "../../components/Common/DataRewardsTable/DataRewardsTable";
import DataRewardsModalSettings from "../../components/Common/DataRewardsModalSettings/DataRewardsModalSettings";
import { DataRewardsModalSettingsValues } from "../../components/Common/DataRewardsModalSettingsInputs/DataRewardsModalSettingsInputs";

const dataRewardsContents: IDataRewardsList[] = [
  {
    id: 1,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Waiting for Approval",
    target: 1000,
    archived: 0,
  },
  {
    id: 2,
    name: "GIF ad-copy-2",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Completed",
    target: 1000,
    archived: 40,
  },
  {
    id: 3,
    name: "GIF ad-copy-3",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Draft",
    target: 1000,
    archived: 0,
  },
  {
    id: 4,
    name: "GIF ad-copy-4",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
  {
    id: 5,
    name: "GIF ad-copy-5",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Waiting for Approval",
    target: 1000,
    archived: 0,
  },
  {
    id: 6,
    name: "GIF ad-copy-6",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Completed",
    target: 1000,
    archived: 40,
  },
  {
    id: 7,
    name: "GIF ad-copy-7",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Draft",
    target: 1000,
    archived: 0,
  },
  {
    id: 8,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
  {
    id: 11,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Waiting for Approval",
    target: 1000,
    archived: 0,
  },
  {
    id: 12,
    name: "GIF ad-copy-2",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Completed",
    target: 1000,
    archived: 40,
  },
  {
    id: 31,
    name: "GIF ad-copy-3",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Draft",
    target: 1000,
    archived: 0,
  },
  {
    id: 41,
    name: "GIF ad-copy-4",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
  {
    id: 15,
    name: "GIF ad-copy-5",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Waiting for Approval",
    target: 1000,
    archived: 0,
  },
  {
    id: 61,
    name: "GIF ad-copy-6",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Completed",
    target: 1000,
    archived: 40,
  },
  {
    id: 217,
    name: "GIF ad-copy-7",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Draft",
    target: 1000,
    archived: 0,
  },
  {
    id: 128,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
  {
    id: 28,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
  {
    id: 211,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Waiting for Approval",
    target: 1000,
    archived: 0,
  },
  {
    id: 122,
    name: "GIF ad-copy-2",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Completed",
    target: 1000,
    archived: 40,
  },
  {
    id: 231,
    name: "GIF ad-copy-3",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Draft",
    target: 1000,
    archived: 0,
  },
  {
    id: 421,
    name: "GIF ad-copy-4",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
  {
    id: 125,
    name: "GIF ad-copy-5",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Waiting for Approval",
    target: 1000,
    archived: 0,
  },
  {
    id: 621,
    name: "GIF ad-copy-6",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Completed",
    target: 1000,
    archived: 40,
  },
  {
    id: 127,
    name: "GIF ad-copy-7",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Draft",
    target: 1000,
    archived: 0,
  },
  {
    id: 1238,
    name: "GIF ad-copy-1",
    creator: "Super Admin",
    startAt: "May 14, 2021",
    endAt: "May 15, 2021",
    status: "Active",
    target: 1000,
    archived: 20,
  },
];

const tabs = [
  { value: "all", label: "All Campaigns" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "waiting", label: "Waiting for Approval" },
  { value: "draft", label: "Draft" },
];
export default function PageDataRewards() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [data, setData] = useState<IDataRewardsList[]>(dataRewardsContents);
  const [openGlobalSettings, setOpenGlobalSettings] = useState(false);

  const handleModalSettingOpen = () => {
    setOpenGlobalSettings(true);
  };
  const handleModalSettingClose = (
    apply?: DataRewardsModalSettingsValues | null,
    reason?: string
  ) => {
    if (!!apply && !reason) {
      // api request
    }
    if (!reason || reason !== "backdropClick") {
      setOpenGlobalSettings(false);
    }
  };
  function handlePageChange(_e, newPage: number) {
    setPage(newPage);
  }
  function handleTabsChange(_e: any, value: string) {
    setCurrentTab(value);
    if (value === "all") {
      setData(dataRewardsContents);
    } else {
      setData(
        dataRewardsContents.filter(({ status }) =>
          status.toLowerCase().includes(value)
        )
      );
    }
  }
  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setPage(1);
    setSearch(value);
    if (!value) {
      setData(dataRewardsContents);
    } else {
      setData(
        dataRewardsContents.filter(({ name, id }) =>
          name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }
  return (
    <S.Container className="data-rewards-list">
      <Title
        title="Data Rewards"
        breadcrumbs={[{ label: "Data Reward" }, { label: "List" }]}
        extra={
          <Link to="/data-rewards/create">
            <Button
              className="title-button"
              style={{ backgroundColor: Colors.DEFAULT, color: Colors.WHITE }}
            >
              <AddIcon /> Create Campaign
            </Button>
          </Link>
        }
      />
      <S.TabFlex>
        <Tabs
          value={currentTab}
          className="dr-tab-status"
          onChange={handleTabsChange}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
        <>
          <SettingsTwoToneIcon
            onClick={handleModalSettingOpen}
            className="dr-setting-icon"
          />
        </>
      </S.TabFlex>
      <Card>
        <S.SearchInput>
          <TextField
            type="search"
            variant="outlined"
            placeholder="Search Campaign Name"
            onChange={handleSearch}
            value={search}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </S.SearchInput>
        <DataRewardsTable
          data={data}
          pagination={{ page, setPage: handlePageChange }}
        />
      </Card>
      <DataRewardsModalSettings
        handleModalSettingClose={handleModalSettingClose}
        openGlobalSettings={openGlobalSettings}
      />
    </S.Container>
  );
}
