import { useState } from "react";
import { Colors } from "@dr-one/utils";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";

import * as S from "./DataRewardsModalSettings.styles";
import DataRewardsModalSettingsInputs, {
  DataRewardsModalSettingsInputsKeys,
  DataRewardsModalSettingsValues,
} from "../DataRewardsModalSettingsInputs/DataRewardsModalSettingsInputs";

export type DataRewardsModalSettingsProps = {
  openGlobalSettings: boolean;
  handleModalSettingClose: (
    settingsValues?: DataRewardsModalSettingsValues,
    reason?: any
  ) => void;
};

function DataRewardsModalSettings(props: DataRewardsModalSettingsProps) {
  const [settingsValues, setSettingsValues] =
    useState<DataRewardsModalSettingsValues>({ clicks: 2, slots: 10 });
  function handleSettingsChange(
    key: DataRewardsModalSettingsInputsKeys,
    type: string
  ) {
    const keyValue = settingsValues[key];
    const newValue = type === "less" ? keyValue - 1 : keyValue + 1;
    setSettingsValues((prev) => ({ ...prev, [key]: newValue }));
  }
  return (
    <Dialog
      open={props.openGlobalSettings}
      onClose={props.handleModalSettingClose}
      aria-labelledby="alert-dialog-title"
    >
      <S.Container className="data-rewards-modal-settings">
        <DialogTitle id="alert-dialog-title">
          <p>Data Rewards Global Configurations</p>
          <p
            className="pointer"
            onClick={() => props.handleModalSettingClose(null, "close")}
          >
            <CloseIcon />
          </p>
        </DialogTitle>
        <DialogContent>
          <DataRewardsModalSettingsInputs
            title="How many times a user can click on install the app?"
            descriptions="Clicks Per Ad / Per Day"
            sectionNumber="1"
            keyType="clicks"
            values={settingsValues}
            handleInputChange={handleSettingsChange}
          />
          <hr />
          <br />
          <DataRewardsModalSettingsInputs
            title="Max number of slots in the portal"
            descriptions="Slots in the home page"
            sectionNumber="2"
            keyType="slots"
            values={settingsValues}
            handleInputChange={handleSettingsChange}
          />
        </DialogContent>
        <DialogActions style={{ margin: 0, padding: 0 }}>
          <Button
            onClick={() => props.handleModalSettingClose(settingsValues)}
            className="data-rewards-modal-settings-actions"
          >
            <p>
              Apply <ArrowForwardIcon />
            </p>
          </Button>
        </DialogActions>
      </S.Container>
    </Dialog>
  );
}

export default DataRewardsModalSettings;
