import { memo } from "react";
import "date-fns";
import usLocale from "date-fns/locale/en-US";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, Grid } from "@material-ui/core";
import { v1 } from "uuid";
import { InputAdornment, IconButton, GridListClassKey } from "@material-ui/core";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import TodayIcon from "@material-ui/icons/Today";
import * as S from "./select-date-time.styles";

export type SelectDateTimeProps = {
  label: string;
  format?: string;
  value: Date | null;
  disabled?: boolean;
  required?: boolean;
  disablePast?: boolean;
  onChange: (date: Date | null) => any;
};

function SelectDateTime(props: SelectDateTimeProps) {
  return (
    <Grid item sm={12} lg={6} className="form-row">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={usLocale}>
        <S.Container className="select-date-container">
          <DateTimePicker
            id={v1()}
            autoOk
            ampm={false}
            disabled={props.disabled}
            required={props.required}
            variant="inline"
            inputVariant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <TodayIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disablePast={props.disablePast}
            label={props.label}
            value={props.value}
            format={props.format}
            onChange={props.onChange}
          />
        </S.Container>
      </MuiPickersUtilsProvider>
    </Grid>

  );
}
SelectDateTime.defaultProps = {
  value: "",
  disablePast: true,
  onChange: console.log,
  format: "yyyy-MM-dd HH:mm",
  label: "Start Date (YYYY-MM-DD)",
};

export default memo(SelectDateTime);
