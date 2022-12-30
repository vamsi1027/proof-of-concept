import { timezones, timezoneDetails } from "@dr-one/utils";
import { TextField, Grid, FormControl, Select, MenuItem, ListSubheader, InputLabel } from "@material-ui/core";
import { v1 } from "uuid";
import * as S from "./select-timezone.styles";

export type SelectTimeZoneProps = {
  value: string;
  label?: any;
  onChange: (event: string) => any;
};

function SelectTimeZone(props) {
  const renderSelectGroup = zone => {
    const items = zone.zones.map(time => {
      return (
        <MenuItem value={time.java_code} id={v1()}>
          {time.utc_diff} - {time.abbr_full}
        </MenuItem>
      );
    });
    return [<ListSubheader>{zone.country}</ListSubheader>, items];
  };

  return (
    <Grid item sm={12} lg={6} className="form-row">
      <S.Container className="select-timezone-container">
        {/* <TextField
          select
          id={v1()}
          variant="outlined"
          value={props.value}
          label={props.label}
          InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
          SelectProps={{ native: true }}
          onChange={(event) => props.onChange(event.target.value)}
        >
          <option value={""} hidden></option>
          {timezones.map((time, key) => (
            <option value={time} key={key}>
              {time}
            </option>
          ))}
        </TextField> */}
        <FormControl className="form-select-box">
          <InputLabel variant="filled" style={{ pointerEvents: "auto" }}>{props.label}</InputLabel>
          <Select
            value={props.value}
            onChange={(event: any) => props.onChange(event.target.value)}
            name="timezone"
            label="timezone">
            {
              timezoneDetails.map((zone: any) => (
                renderSelectGroup(zone)
              ))}
          </Select>
        </FormControl>
      </S.Container>
    </Grid>

  );
}
SelectTimeZone.defaultProps = {
  value: "",
  label: "Time Zone",
  onChange: console.log,
};
export default SelectTimeZone;
