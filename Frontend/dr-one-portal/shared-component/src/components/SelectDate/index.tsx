import { memo } from "react";
import "date-fns";
import usLocale from "date-fns/locale/en-US";
import DateFnsUtils from "@date-io/date-fns";
import { v1 } from "uuid";
import { InputAdornment, IconButton, Grid } from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TodayIcon from "@material-ui/icons/Today";
import * as S from "./select-date.styles";

export type SelectDateProps = {
  label: string;
  format?: string;
  minDate?: undefined | Date;
  maxDate?: undefined | Date;
  value: Date | null;
  disabled?: boolean;
  required?: boolean;
  disablePast?: boolean;
  onChange: (date: Date | null) => any;
};

function SelectDate(props: SelectDateProps) {
  return (
    <Grid item sm={12} lg={6} className="form-row">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={usLocale}>
        <S.Container className="select-date-container">
          <KeyboardDatePicker
            id={v1()}
            autoOk
            minDate={props.minDate}
            maxDate={props.maxDate}
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
SelectDate.defaultProps = {
  value: "",
  disablePast: true,
  onChange: console.log,
  minDate: undefined,
  format: "yyyy-MM-dd",
  label: "Start Date (YYYY-MM-DD)",
  maxDate: undefined
};

export default memo(SelectDate);
