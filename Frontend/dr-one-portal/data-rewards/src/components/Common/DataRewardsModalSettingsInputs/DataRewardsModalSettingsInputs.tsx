import { Input, Button } from "@material-ui/core";

import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";

import * as S from "./DataRewardsModalSettingsInputs.styles";
export type DataRewardsModalSettingsInputsKeys = "clicks" | "slots";

export type DataRewardsModalSettingsValues = {
  clicks: number;
  slots: number;
};
export type DataRewardsModalSettingsInputsProps = {
  title: string;
  descriptions: string;
  sectionNumber: string;
  keyType: DataRewardsModalSettingsInputsKeys;
  values: DataRewardsModalSettingsValues;
  handleInputChange: (keyType: string, type: string) => void;
};

function DataRewardsModalSettingsInputs(
  props: DataRewardsModalSettingsInputsProps
) {
  const inputValue = props.values[props.keyType];
  return (
    <S.Container>
      <S.Content>
        <p className="number-section">{props.sectionNumber}</p>
        <div>
          <p className="data-rewards-modal-settings-title">{props.title}</p>
          <small className="data-rewards-modal-settings-descriptions">
            {props.descriptions}
          </small>
          <div className="data-rewards-modal-settings-inputs">
            <Button
              onClick={() => props.handleInputChange(props.keyType, "less")}
            >
              <RemoveCircleOutlineOutlinedIcon />
            </Button>
            <Input
              type="number"
              disableUnderline
              value={inputValue}
              onChange={console.log}
            />
            <Button
              onClick={() => props.handleInputChange(props.keyType, "more")}
            >
              <AddCircleOutlineOutlinedIcon />
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Container>
  );
}

export default DataRewardsModalSettingsInputs;
