import { memo } from "react";
import "date-fns";
import usLocale from "date-fns/locale/en-US";
import DateFnsUtils from "@date-io/date-fns";
import { v1 } from "uuid";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import * as S from "./select-time.styles";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
export type SelectTimeProps = {
  label: string;
  value: Date | null;
  disabled?: boolean;
  disablePast?: boolean;
  onChange: (date: Date | null) => any;
};
import { TextField, Grid } from "@material-ui/core";

function SelectTime(props: SelectTimeProps) {
  return (

    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={usLocale}>
      <Grid item sm={5} lg={3}>
        <S.Container className="select-time-container">
          <KeyboardTimePicker
            id={v1()}
            ampm={false}
            disabled={props.disabled}
            keyboardIcon={<AccessAlarmIcon />}
            variant="inline"
            inputVariant="outlined"
            label={props.label}
            value={props.value}
            onChange={props.onChange}
          />
        </S.Container>
      </Grid>

    </MuiPickersUtilsProvider>

  );
}
SelectTime.defaultProps = {
  value: "",
  disablePast: true,
  onChange: console.log,
  format: "yyyy-MM-dd HH:mm",
  label: "Start Date (YYYY-MM-DD)",
};

export default memo(SelectTime);
