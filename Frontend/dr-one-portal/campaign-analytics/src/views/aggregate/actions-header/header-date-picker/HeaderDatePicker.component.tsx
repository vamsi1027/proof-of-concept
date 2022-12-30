import React, { useState, useRef, useContext, useEffect } from "react";
import { TextField, InputAdornment } from "@material-ui/core";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import DateRangeTwoToneIcon from '@material-ui/icons/DateRangeTwoTone';
import { helper } from "@dr-one/utils";
import * as S from "./HeaderDatePicker.styles";
import { GlobalContext } from "../../../../context/globalState";
import { CAMPAIGN_ANALYTICS_ACTIONS } from "../../../../context/CampaignAnalyticsReducer";

const HeaderDatePickerComponent: React.FunctionComponent = ({ }) => {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);

  const [open, setOpen] = useState(false);

  const inputRef = useRef(null);

  const setDates = (range: any): any => {
    dispatch({
      type: CAMPAIGN_ANALYTICS_ACTIONS.SET_DATE_RANGE,
      payload: {
        startDate: range.range1.startDate,
        endDate: range.range1.endDate
      }
    })
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    }
  }, [])

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setOpen(false);
    }
  }

  return (
    <S.Container>
      <div className="header-main-btn calandar-btn">
        <TextField
          onChange={setDates}
          onClick={() => setOpen(!open)}
          value={`${Object.values(state.dateRange).length !== 0 ? helper.formatDateWithSlash(state?.dateRange?.startDate) : ''} - ${Object.values(state.dateRange).length !== 0 ? helper.formatDateWithSlash(state?.dateRange?.endDate) : ''}`}
          type="text"
          variant="outlined"
          autoFocus={true}
          aria-describedby="desc-search-text"
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="start" className="calandar-icon">
                <DateRangeTwoToneIcon />
              </InputAdornment>
            )
          }}
        />
        {open && <div className="calandar-popup" ref={inputRef}>
          <DateRangePicker
            ranges={[state.dateRange]}
            onChange={(item) => setDates(item)}
            months={2}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            showMonthAndYearPickers={false}
            direction="horizontal"
            maxDate={new Date()}
            retainEndDateOnFirstSelection={true}
            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
          />
        </div>}
      </div>
    </S.Container>
  );
};

export default React.memo(HeaderDatePickerComponent);
