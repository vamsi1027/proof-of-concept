import { useContext, useState, useEffect } from "react";
import { formatDistanceStrict, getDate } from "date-fns";
import {
  addDay,
  GlobalContext,
  inAppAddDay,
} from "../../../context/globalState";
import { v1 } from "uuid";
import {
  SelectDate,
  SelectDateTime,
  SelectTime,
  SelectTimeZone, LightTooltip
} from "@dr-one/shared-component";
import {
  Grid,
  Card,
  Switch,
  FormControlLabel,
  TextField,
  Slider,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { helper } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';
import * as S from "./Schedule.styles";
import { days } from "@dr-one/utils";
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";

export default function Schedule() {
  const [dateDiff, setDateDiff] = useState(0);
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { settings, registration } = state.formValues;
  const { t } = useTranslation();
  const { schedule } = settings;
  const [dayOfWeek, setDayOfWeek] = useState([]);

  useEffect(() => {
    const { startAt, endAt } = schedule;
    if (!!startAt && !!endAt) {
      const checkDiff = !isNaN(new Date(startAt).getTime()) && !isNaN(new Date(endAt).getTime()) && formatDistanceStrict(startAt, endAt, { unit: "day" });
      const diffNumber = parseInt(checkDiff && checkDiff.split(" ")[0]);

      if (diffNumber !== dateDiff) {
        setDateDiff(diffNumber);
      }
    }
  }, [dateDiff, schedule.startAt, schedule.endAt]);

  const checkDistanceBetweenDates = (dayKey: number): boolean => {
    const { startAt, endAt } = schedule;
    if (!!startAt && !!endAt) {
      const startDate = startAt.getDay();
      const endDate = endAt.getDay();
      if (startDate <= endDate) {
        return startDate <= dayKey && endDate >= dayKey;
      } else {
        return startDate <= dayKey || endDate >= dayKey;
      }
    }
    return false;
  };

  const checkDistanceBetweenDatesWithDates = (dayKey: number, startDate: Date, endDate: Date): boolean => {
    if (!!startDate && !!endDate) {
      const startDateValue = startDate.getDay();
      const endDateValue = endDate.getDay();
      if (startDateValue <= endDateValue) {
        return startDateValue <= dayKey && endDateValue >= dayKey;
      } else {
        return startDateValue <= dayKey || endDateValue >= dayKey;
      }
    }
    return false;
  };

  function handleRemoveWeekDay(dayId: string) {
    const weekDays = schedule.weekDays.filter(({ id }) => id !== dayId);

    let duplicateItems = {};
    weekDays.forEach((item, index) => {
      duplicateItems[item.day] = duplicateItems[item.day] || [];
      duplicateItems[item.day].push(index);
    });
    const valueArrTime = [];
    Object.keys(duplicateItems).forEach(item => {
      if (duplicateItems[item].length > 1) {
        duplicateItems[item].forEach(indexValue => {
          valueArrTime.push(Number(`${weekDays[indexValue].time.getHours()}.${weekDays[indexValue].time.getMinutes()}`));
          const isDuplicateStartTime = valueArrTime.some((item, idx) => {
            return valueArrTime.indexOf(item) !== idx;
          });
          if (isDuplicateStartTime) {
            weekDays[indexValue]['dayError'] = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
          } else {
            weekDays[indexValue]['dayError'] = '';
          }
        })
      } else {
        weekDays[duplicateItems[item]]['dayError'] = ''
      }
    })
    if (weekDays && weekDays.length === 1) {
      weekDays[weekDays.length - 1]['dayError'] = '';
    }
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, weekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange([...weekDays]),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      },
    });
  }

  function handleAddWeekDay() {
    const startAtDay = days[schedule.startAt.getDay()];
    const weekDays = [...schedule.weekDays, addDay(startAtDay)];
    const isDayOfWeekExist = schedule.weekDays.findIndex(dayOfWeek => (dayOfWeek.day === addDay(startAtDay).day) &&
      (dayOfWeek.time.getHours() === addDay(startAtDay).time.getHours()) && (dayOfWeek.time.getMinutes() === addDay(startAtDay).time.getMinutes()));
    if (isDayOfWeekExist > -1) {
      weekDays[weekDays.length - 1]['dayError'] = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
    } else {
      weekDays[weekDays.length - 1]['dayError'] = '';
    }
    if (weekDays && weekDays.length === 1) {
      weekDays[weekDays.length - 1]['dayError'] = '';
    }
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, weekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange([...weekDays]),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      },
    });
  }

  function handleScheduleInAppWeekChange(key: string, id: string, value: any) {
    const dayExistsInArray = schedule.inAppWeekDays.filter(day => day['day'] === value);
    const itemIndex = schedule.inAppWeekDays.findIndex(day => day.id === id);
    const inAppWeekDays = schedule.inAppWeekDays.map((weekDay, index) => {
      if (key === 'time') {
        if (weekDay.day === schedule.inAppWeekDays[itemIndex].day) {
          if ((value[0] >= weekDay.time[1]) || (weekDay.time[0] >= value[1])) {
            weekDay.dayError = '';
          } else {
            weekDay.dayError = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
          }
        }
      }
      if (weekDay.id === id) {
        weekDay[key] = value;
        if (key === 'day') {
          if (dayExistsInArray.length === 0) {
            schedule.inAppWeekDays.forEach(day => {
              day.dayError = '';
            })
          } else {
            dayExistsInArray.forEach(day => {
              if ((schedule.inAppWeekDays[index].time[0] >= day.time[1]) || (day.time[0] >= schedule.inAppWeekDays[index].time[1])) {
                weekDay.dayError = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
              } else if ((schedule.inAppWeekDays[index].time[0] = day.time[0]) || (schedule.inAppWeekDays[index].time[1] = day.time[1])) {
                weekDay.dayError = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
              } else {
                weekDay.dayError = '';
              }
            })
          }
        }
        if (key === 'time') {
          weekDay.dayError = '';
        }
      }
      return weekDay;
    });

    if (inAppWeekDays && inAppWeekDays.length === 1) {
      inAppWeekDays[inAppWeekDays.length - 1]['dayError'] = '';
    }
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, inAppWeekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange([...inAppWeekDays]),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      }
    });
  }

  function handleAddInAppWeekDay() {
    const filtertedDays = days
      .filter((_, key) => {
        if (dateDiff >= 6 || !schedule.endAt) {
          return true;
        }
        if (!!schedule.endAt) {
          return checkDistanceBetweenDates(key);
        }

      })
    const inAppWeekDays = [...schedule.inAppWeekDays, inAppAddDay(filtertedDays[filtertedDays.length - 1])];

    let duplicateItems = {};
    inAppWeekDays.forEach((item, index) => {
      duplicateItems[item.day] = duplicateItems[item.day] || [];
      duplicateItems[item.day].push(index);
    });
    const valueArrStartTime = [];
    const valueArrEndTime = [];

    Object.keys(duplicateItems).forEach(item => {
      if (duplicateItems[item].length > 1) {
        duplicateItems[item].forEach(indexValue => {
          valueArrStartTime.push(inAppWeekDays[indexValue].time[0]);
          valueArrEndTime.push(inAppWeekDays[indexValue].time[1]);
          const isDuplicateStartTime = valueArrStartTime.some((item, idx) => {
            return valueArrStartTime.indexOf(item) !== idx;
          });
          const isDuplicateEndTime = valueArrEndTime.some((item, idx) => {
            return valueArrEndTime.indexOf(item) !== idx;
          });
          if (isDuplicateStartTime || isDuplicateEndTime) {
            inAppWeekDays[indexValue]['dayError'] = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
          } else {
            inAppWeekDays[indexValue]['dayError'] = '';
          }
        })
      } else {
        inAppWeekDays[duplicateItems[item]]['dayError'] = ''
      }
    })

    if (inAppWeekDays && inAppWeekDays.length === 1) {
      inAppWeekDays[inAppWeekDays.length - 1]['dayError'] = '';
    }
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, inAppWeekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange([...inAppWeekDays]),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      },
    });
  }

  function handleRemoveInAppWeekDay(dayId: string) {
    const inAppWeekDays = schedule.inAppWeekDays.filter(
      ({ id }) => id !== dayId
    );
    let duplicateItems = {};
    inAppWeekDays.forEach((item, index) => {
      duplicateItems[item.day] = duplicateItems[item.day] || [];
      duplicateItems[item.day].push(index);
    });
    const valueArrStartTime = [];
    const valueArrEndTime = [];

    Object.keys(duplicateItems).forEach(item => {
      if (duplicateItems[item].length > 1) {
        duplicateItems[item].forEach(indexValue => {
          valueArrStartTime.push(inAppWeekDays[indexValue].time[0]);
          valueArrEndTime.push(inAppWeekDays[indexValue].time[1]);
          const isDuplicateStartTime = valueArrStartTime.some((item, idx) => {
            return valueArrStartTime.indexOf(item) !== idx;
          });
          const isDuplicateEndTime = valueArrEndTime.some((item, idx) => {
            return valueArrEndTime.indexOf(item) !== idx;
          });
          if (isDuplicateStartTime || isDuplicateEndTime) {
            inAppWeekDays[indexValue]['dayError'] = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
          } else {
            inAppWeekDays[indexValue]['dayError'] = '';
          }
        })
      } else {
        inAppWeekDays[duplicateItems[item]]['dayError'] = ''
      }
    })
    if (inAppWeekDays && inAppWeekDays.length === 1) {
      inAppWeekDays[inAppWeekDays.length - 1]['dayError'] = '';
    }

    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, inAppWeekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange([...inAppWeekDays]),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      },
    });
  }

  function handleScheduleWeekChange(key: string, id: string, value: any) {
    const slotIndex = schedule.weekDays.findIndex(dayOfWeek => dayOfWeek.id === id);

    if (slotIndex > -1) {
      if (key === 'day') {
        if (schedule.weekDays[slotIndex].day !== value.day) {
          const slotIndex1 = schedule.weekDays.findIndex(dayOfWeek => (dayOfWeek.day === value && (dayOfWeek.time.getHours() === schedule.weekDays[slotIndex].time.getHours() && dayOfWeek.time.getMinutes() === schedule.weekDays[slotIndex].time.getMinutes())));
          if (slotIndex1 > -1) {
            schedule.weekDays[slotIndex].dayError = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
          } else {
            schedule.weekDays[slotIndex].dayError = '';
          }
        } else {
          schedule.weekDays[slotIndex].dayError = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
        }
      }
      if (key === 'time') {
        const slotIndex2 = schedule.weekDays.findIndex(dayOfWeek => (dayOfWeek.day === schedule.weekDays[slotIndex].day && (value?.getHours() === dayOfWeek?.time?.getHours() && value?.getMinutes() === dayOfWeek?.time?.getMinutes())));
        if (slotIndex2 > -1 && slotIndex2 !== slotIndex) {
          schedule.weekDays[slotIndex].dayError = t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR');
        } else {
          schedule.weekDays[slotIndex].dayError = '';
        }
      }
    }

    const weekDays = schedule.weekDays.map((weekDay) => {
      if (weekDay.id === id) weekDay[key] = value;
      return weekDay;
    });
    setDayOfWeek([...weekDays]);

    if (weekDays && weekDays.length === 1) {
      weekDays[weekDays.length - 1]['dayError'] = '';
    }

    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, weekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange([...weekDays]),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      }
    });
  }

  function handleScheduleChange(content: { [key: string]: any }) {
    let weekDays = [...schedule.weekDays];

    if ((content.hasOwnProperty('endAt') || content.hasOwnProperty('startAt')) && registration.campaignType !== 'inApp') {
      if (schedule.repeat || schedule.distributeInTime) {
        if (schedule.endAt || content.endAt) {
          const filteredWeekDays = days.filter(day => {

            const startDate = content.hasOwnProperty('startAt') && !isNaN(new Date(content.startAt).getTime()) ? content.startAt : schedule.startAt;
            const endDate = content.hasOwnProperty('endAt') && !isNaN(new Date(content.endAt).getTime()) ? content.endAt : schedule.endAt;
            
            if (!isNaN(new Date(startDate).getTime()) && !isNaN(new Date(endDate).getTime()) && startDate && endDate) {
              const checkDiff = formatDistanceStrict(content.hasOwnProperty('startAt') && !isNaN(new Date(content.startAt).getTime()) ? content.startAt : schedule.startAt, content.hasOwnProperty('endAt') && !isNaN(new Date(content.endAt).getTime()) ? content.endAt : schedule.endAt, { unit: "day" });
              const diffNumber = parseInt(checkDiff.split(" ")[0]);
              if (diffNumber >= 6) {
                return true;
              }
            }
            return checkDistanceBetweenDatesWithDates(helper.convertDayOfWeek(day), content.hasOwnProperty('startAt') && !isNaN(new Date(content.startAt).getTime()) ? content.startAt : schedule.startAt,
              content.hasOwnProperty('endAt') && !isNaN(new Date(content.endAt).getTime()) ? content.endAt : schedule.endAt)
          });

          filteredWeekDays.forEach((day, index) => {
            const dayIndex = schedule.weekDays.findIndex(weekDay => weekDay.day === day);
            if (dayIndex < 0) {
              weekDays.push({ id: v1(), day: day, dayError: '', time: new Date(new Date().setHours(new Date().getHours())) })
            }
            weekDays = weekDays.filter(value => filteredWeekDays.includes(value.day));
          })

          weekDays = modifyWeekDays(weekDays, content.hasOwnProperty('startAt') ? content.startAt : schedule.startAt);
        }
      }
    }
    let inAppWeekDays = [...schedule.inAppWeekDays];
    const filteredDays = days.filter(day => {
      if (dateDiff >= 6) {
        return true;
      }
      if (content.hasOwnProperty('endAt') || (!content.hasOwnProperty('endAt') && !!schedule.endAt)) {
        return checkDistanceBetweenDatesWithDates(helper.convertDayOfWeek(day), content.hasOwnProperty('startAt') ? content.startAt : schedule.startAt
          , content.hasOwnProperty('endAt') ? content.endAt : schedule.endAt);
      }
    });

    if (filteredDays.length !== 0) {
      const nonCommonDaysInAppArray = inAppWeekDays.filter(function (n) {
        return filteredDays.indexOf(n.day) === -1;
      });
      const commonDaysInAppArray = inAppWeekDays.filter(function (n) {
        return filteredDays.indexOf(n.day) !== -1;
      });
      if (nonCommonDaysInAppArray.length !== 0) {
        nonCommonDaysInAppArray.forEach((day, index) => {
          day.day = filteredDays[0];
          const ele = 24 - index;
          day.time = [index === 0 ? 23 : ele - 1, index === 0 ? 24 : ele];
        })
      }
      inAppWeekDays = commonDaysInAppArray.concat(nonCommonDaysInAppArray);
    }

    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_SETTINGS,
      payload: {
        ...settings, schedule: { ...schedule, ...content, weekDays: weekDays, inAppWeekDays: inAppWeekDays }, isSettingSectionValid: {
          isMetricsSectionValid: state.formValues.settings.isSettingSectionValid.isMetricsSectionValid,
          isClusterSectionValid: state.formValues.settings.isSettingSectionValid.isClusterSectionValid,
          isCustomTrackerLinkSectionValid: state.formValues.settings.isSettingSectionValid.isCustomTrackerLinkSectionValid,
          isScheduleSectionValid: scheduleSectionValidityChange(content),
          isCampaignOptionSectionValid: state.formValues.settings.isSettingSectionValid.isCampaignOptionSectionValid
        }
      }
    });
  }

  const scheduleSectionValidityChange = (content: any) => {
    let isScheduleSectionValid;
    if (registration.campaignType === 'inApp') {
      if (content.hasOwnProperty('endAt')) {
        if (!isNaN(new Date(content.endAt).getTime())) {
          if (schedule.startAt && schedule.timezone && schedule.timezone?.length !== 0) {
            if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
              (today(schedule.timezone) > helper.formatDate(content.endAt))) {
              isScheduleSectionValid = false;
            } else {
              if (helper.formatDate(content.endAt) < helper.formatDate(schedule.startAt)) {
                isScheduleSectionValid = false;
              } else {
                if (schedule.repeatMonth) {
                  if (schedule.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                    isScheduleSectionValid = true;
                  } else {
                    isScheduleSectionValid = false;
                  }
                } else {
                  if (schedule.specificDays) {
                    isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                  } else {
                    isScheduleSectionValid = true;
                  }
                }
              }
            }
          } else {
            isScheduleSectionValid = false;
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('startAt')) {
        if (!isNaN(new Date(content.startAt).getTime())) {
          if (schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
            if ((today(schedule.timezone) > helper.formatDate(content.startAt)) ||
              (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
              isScheduleSectionValid = false;
            } else {
              if (helper.formatDate(schedule.endAt) < helper.formatDate(content.startAt)) {
                isScheduleSectionValid = false;
              } else {
                if (schedule.repeatMonth) {
                  if (schedule.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                    isScheduleSectionValid = true;
                  } else {
                    isScheduleSectionValid = false;
                  }
                } else {
                  if (schedule.specificDays) {
                    isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                  } else {
                    isScheduleSectionValid = true;
                  }
                }
              }
            }
          } else {
            isScheduleSectionValid = false;
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('multiShow')) {
        if (schedule.startAt && schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
          if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
            (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
            isScheduleSectionValid = false;
          } else {
            if (helper.formatDate(schedule.endAt) < helper.formatDate(schedule.startAt)) {
              isScheduleSectionValid = false;
            } else {
              if (schedule.repeatMonth) {
                if (schedule.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                  isScheduleSectionValid = true;
                } else {
                  isScheduleSectionValid = false;
                }
              } else {
                if (schedule.specificDays) {
                  isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                } else {
                  isScheduleSectionValid = true;
                }
              }
            }
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('repeatMonth') && content.hasOwnProperty('monthlyDayTime')) {
        if (schedule.startAt && schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
          if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
            (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
            isScheduleSectionValid = false;
          } else {
            if (helper.formatDate(schedule.endAt) < helper.formatDate(schedule.startAt)) {
              isScheduleSectionValid = false;
            } else {
              if (content.repeatMonth) {
                if (content.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                  isScheduleSectionValid = true;
                } else {
                  isScheduleSectionValid = false;
                }
              } else {
                if (schedule.specificDays) {
                  isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                } else {
                  isScheduleSectionValid = true;
                }
              }
            }
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('monthlyDayTime')) {
        if (schedule.startAt && schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
          if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
            (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
            isScheduleSectionValid = false;
          } else {
            if (helper.formatDate(schedule.endAt) < helper.formatDate(schedule.startAt)) {
              isScheduleSectionValid = false;
            } else {
              if (schedule.repeatMonth) {
                if (content.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                  isScheduleSectionValid = true;
                } else {
                  isScheduleSectionValid = false;
                }
              } else {
                if (schedule.specificDays) {
                  isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                } else {
                  isScheduleSectionValid = true;
                }
              }
            }
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('sendDayTime')) {
        if (schedule.startAt && schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
          if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
            (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
            isScheduleSectionValid = false;
          } else {
            if (helper.formatDate(schedule.endAt) < helper.formatDate(schedule.startAt)) {
              isScheduleSectionValid = false;
            } else {
              if (schedule.repeatMonth) {
                if (schedule.monthlyDayTime && content.sendDayTime && content.sendDayTime.length !== 0) {
                  isScheduleSectionValid = true;
                } else {
                  isScheduleSectionValid = false;
                }
              } else {
                if (schedule.specificDays) {
                  isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                } else {
                  isScheduleSectionValid = true;
                }
              }
            }
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('specificDays')) {
        if (schedule.startAt && schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
          if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
            (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
            isScheduleSectionValid = false;
          } else {
            if (helper.formatDate(schedule.endAt) < helper.formatDate(schedule.startAt)) {
              isScheduleSectionValid = false;
            } else {
              if (schedule.repeatMonth) {
                if (schedule.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                  isScheduleSectionValid = true;
                } else {
                  isScheduleSectionValid = false;
                }
              } else {
                if (content.specificDays) {
                  isScheduleSectionValid = schedule.inAppWeekDays.every(day => day.dayError === '');
                } else {
                  isScheduleSectionValid = true;
                }
              }
            }
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (Array.isArray(content)) {
        if (content.length === 0) {
          isScheduleSectionValid = false;
        } else {
          if (content.every(day => day.dayError === '')) {
            if (schedule.startAt && schedule.endAt && schedule.timezone && schedule.timezone?.length !== 0) {
              if ((today(schedule.timezone) > helper.formatDate(schedule.startAt)) ||
                (today(schedule.timezone) > helper.formatDate(schedule.endAt))) {
                isScheduleSectionValid = false;
              } else {
                if (helper.formatDate(schedule.endAt) < helper.formatDate(schedule.startAt)) {
                  isScheduleSectionValid = false;
                } else {
                  if (schedule.repeatMonth) {
                    if (schedule.monthlyDayTime && schedule.sendDayTime && schedule.sendDayTime.length !== 0) {
                      isScheduleSectionValid = true;
                    } else {
                      isScheduleSectionValid = false;
                    }
                  } else {
                    isScheduleSectionValid = true;
                  }
                }
              }
            } else {
              isScheduleSectionValid = false;
            }
          } else {
            isScheduleSectionValid = false;
          }
        }
      }
    } else {
      if (Array.isArray(content)) {
        if (content.length === 0) {
          isScheduleSectionValid = false;
        } else {
          if (content.every(day => day.dayError === '') && !content.some(time => isNaN(time?.time?.getTime()))) {
            if (schedule.expAt && schedule.endAt) {
              if ((today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ||
                (today(state.orgDetails?.timeZone) > helper.formatDate(schedule.endAt)) || (helper.formatDate(schedule.startAt) > helper.formatDate(schedule.endAt))) {
                isScheduleSectionValid = false;
              } else {
                if (helper.formatDate(schedule.endAt) > helper.formatDate(schedule.expAt)) {
                  isScheduleSectionValid = false;
                } else {
                  isScheduleSectionValid = true;
                }
              }
            } else {
              isScheduleSectionValid = false;
            }
          } else {
            isScheduleSectionValid = false;
          }
        }
      } else if (content.hasOwnProperty('repeat')) {
        if (content.repeat || content.distributeInTime) {
          if (schedule.expAt && schedule.endAt) {
            if ((today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ||
              (today(state.orgDetails?.timeZone) > helper.formatDate(schedule.endAt)) || (helper.formatDate(schedule.startAt) > helper.formatDate(schedule.endAt))) {
              isScheduleSectionValid = false;
            } else {
              if (helper.formatDate(schedule.endAt) > helper.formatDate(schedule.expAt)) {
                isScheduleSectionValid = false;
              } else {
                if (schedule.weekDays.some(time => isNaN(time.time.getTime()))) {
                  isScheduleSectionValid = false;
                } else {
                  isScheduleSectionValid = schedule.weekDays.every(day => day.dayError === '');
                }
              }
            }
          } else {
            isScheduleSectionValid = false;
          }
        } else {
          isScheduleSectionValid = (today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ? false : true;
        }
      } else if (content.hasOwnProperty('endAt')) {
        if (!isNaN(new Date(content.endAt).getTime())) {
          if (schedule.repeat || schedule.distributeInTime) {
            if (content.hasOwnProperty('expAt') ? content.expAt : !isNaN(new Date(schedule.expAt).getTime()) && schedule.expAt) {
              if ((today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ||
                (today(state.orgDetails?.timeZone) > helper.formatDate(content.endAt)) || (helper.formatDate(schedule.startAt) > helper.formatDate(content.endAt))) {
                isScheduleSectionValid = false;
              } else {
                if (helper.formatDate(content.endAt) > helper.formatDate(content.hasOwnProperty('expAt') ? content.expAt : schedule.expAt)) {
                  isScheduleSectionValid = false;
                } else {
                  if (schedule.weekDays.some(time => isNaN(time.time.getTime()))) {
                    isScheduleSectionValid = false;
                  } else {
                    isScheduleSectionValid = schedule.weekDays.every(day => day.dayError === '');
                  }
                }
              }
            } else {
              isScheduleSectionValid = false;
            }
          } else {
            isScheduleSectionValid = (state.orgDetails?.timeZone && today(state.orgDetails.timeZone) <= helper.formatDate(content.startAt)) ? true : false;
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('expAt')) {
        if (!isNaN(new Date(content.expAt).getTime())) {
          if (schedule.repeat || schedule.distributeInTime) {
            if (schedule.endAt) {
              if ((today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ||
                (today(state.orgDetails?.timeZone) > helper.formatDate(schedule.endAt)) || (helper.formatDate(schedule.startAt) > helper.formatDate(schedule.endAt))) {
                isScheduleSectionValid = false;
              } else {
                if (helper.formatDate(schedule.endAt) > helper.formatDate(content.expAt)) {
                  isScheduleSectionValid = false;
                } else {
                  if (schedule.weekDays.some(time => isNaN(time.time.getTime()))) {
                    isScheduleSectionValid = false;
                  } else {
                    isScheduleSectionValid = schedule.weekDays.every(day => day.dayError === '');
                  }
                }
              }
            } else {
              isScheduleSectionValid = false;
            }
          } else {
            isScheduleSectionValid = (state.orgDetails?.timeZone && today(state.orgDetails.timeZone) <= helper.formatDate(content.startAt)) ? true : false;
          }
        } else {
          isScheduleSectionValid = false;
        }
      } else if (content.hasOwnProperty('startAt')) {
        if (!isNaN(new Date(content.startAt).getTime())) {
          if (schedule.repeat || schedule.distributeInTime) {
            if (schedule.endAt && schedule.expAt) {
              if ((today(state.orgDetails?.timeZone) > helper.formatDate(content.startAt)) ||
                (today(state.orgDetails?.timeZone) > helper.formatDate(schedule.endAt)) ||
                (helper.formatDate(content.startAt) > helper.formatDate(schedule.endAt))) {
                isScheduleSectionValid = false;
              } else {
                if (helper.formatDate(schedule.endAt) > helper.formatDate(schedule.expAt)) {
                  isScheduleSectionValid = false;
                } else {
                  if (schedule.weekDays.some(time => isNaN(time.time.getTime()))) {
                    isScheduleSectionValid = false;
                  } else {
                    isScheduleSectionValid = schedule.weekDays.every(day => day.dayError === '');
                  }
                }
              }
            } else {
              isScheduleSectionValid = false;
            }
          } else {
            isScheduleSectionValid = (state.orgDetails?.timeZone && today(state.orgDetails.timeZone) <= helper.formatDate(content.startAt)) ? true : false;
          }
        } else {
          isScheduleSectionValid = false;
        }
      }
    }
    return isScheduleSectionValid;
  }

  const today = (timeZone: string): any => {
    return helper.formatDate(
      helper.convertDateByTimeZone(
        timeZone ? timeZone : 'America/Sao_Paulo'
      )
    );
  }

  const modifyWeekDays = (days: any, startAt: any): any => {
    const dayOfWeek = startAt?.getDay();
    const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const sortedList = dayList.slice(dayOfWeek).concat(dayList.slice(0, dayOfWeek));
    return days.sort((a, b) => {
      if (sortedList.indexOf(a.day) > sortedList.indexOf(b.day)) {
        return 1;
      }
      if (sortedList.indexOf(a.day) < sortedList.indexOf(b.day)) {
        return -1;
      }
      return 0;
    });
  }

  const isInapp = registration.campaignType === "inApp";

  return (
    <S.Container>
      <S.Card>
        <S.ScheduleHeader>
          <img src="/img/schedule.svg" alt="schedule-icon" />
          <div>
            <p className="label-tooltip cc-label-text">{t('SETTINGS_SCHEDULE_SECTION_HEADER')}
              <LightTooltip
                title={<div>
                  <label>
                    <a target="_blank" href="https://docs.digitalreef.com/docs/scheduling-options-know-more"> {t('KNOW_MORE')}</a>.
                  </label>
                </div>}
              />
            </p>
            <small>{t('SETTINGS_SCHEDULE_SECTION_SUBHEADER')}</small>
          </div>
        </S.ScheduleHeader>
        <Grid container className="mt" spacing={3}>
          {!isInapp && (
            <Grid item lg={12}>
              <S.Row className="mb">
                <Grid className="switch-label-wrap switch-2-options" component="label" container alignItems="center" >
                  <Grid
                    item className="switch-label"
                  > <div className="label-tooltip cc-label-text">{t('SETTINGS_SCHEDULE_RETARGET_SWITCH_LABEL')}
                      <LightTooltip
                        title={<div>
                          <label>{t('TOOLTIP_FOR_RETARGET_CAMPAIGN')}
                            <a target="_blank" href="https://docs.digitalreef.com/docs/scheduling-options-know-more"> {t('KNOW_MORE')}</a>.
                          </label>
                        </div>}
                      />
                      {t('SWITCH_OFF')}
                    </div>
                  </Grid>
                  <Grid item className="no-padding">
                    <div className="switchery">
                      <FormControlLabel
                        control={
                          <Switch
                            id={v1()}
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            checked={schedule.repeat}
                            onChange={({ target }) => {
                              const startAtDay = days[schedule.startAt.getDay()];
                              handleScheduleChange({
                                repeat: target.checked,
                                distributeInTime: false,
                                weekDays: [addDay(startAtDay)],
                              });
                            }}
                          />
                        }
                        label={""}
                      />
                    </div>
                  </Grid>
                  <Grid
                    item className="switch-label"
                  > {t('SWITCH_ON')}
                  </Grid>

                </Grid>
              </S.Row>
            </Grid>
          )
          }
          <Grid item sm={12} lg={6}>
            <Grid container spacing={3}>
              {schedule.repeat || schedule.distributeInTime ? (
                <SelectDate
                  value={schedule.startAt}
                  required={true}
                  onChange={(date) => handleScheduleChange({ startAt: date })}
                  label={t('SETTINGS_SCHEDULE_START_DATE_LABEL')}
                  disablePast={(today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ? true : false}
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                />
              ) : (
                <SelectDateTime
                  value={schedule.startAt}
                  required={true}
                  onChange={(date) => handleScheduleChange({ startAt: date })}
                  label={t('SETTINGS_SCHEDULE_START_DATE_LABEL')}
                  disablePast={(today(state.orgDetails?.timeZone) > helper.formatDate(schedule.startAt)) ? true : false}
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                />
              )}
              {/* {!isInapp && (!schedule.repeat && !schedule.distributeInTime) ? (
                <SelectDate
                  value={schedule.endAt}
                  // minDate={schedule.startAt}
                  required={false}
                  disablePast={false}
                  onChange={(date) => {
                  }}
                  label={t('SETTINGS_SCHEDULE_END_DATE_LABEL')}
                  disabled={true}
                />
              ) : null} */}
              {isInapp && (
                <SelectDate
                  value={schedule.endAt}
                  minDate={schedule.startAt}
                  required={true}
                  onChange={(date) => handleScheduleChange({ endAt: date })}
                  label={t('SETTINGS_SCHEDULE_END_DATE_LABEL')}
                  disablePast={(today(state.orgDetails?.timeZone) > helper.formatDate(schedule.endAt)) ? true : false}
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                />
              )
                // (
                //   <SelectTimeZone
                //     value={schedule.timezone}
                //     onChange={(value) =>
                //       handleScheduleChange({ timezone: value })
                //     }
                //   />
                // )
              }
            </Grid>

            {/* <S.Row className="row">
              {isInapp && (
                <SelectTimeZone
                  value={schedule.timezone}
                  onChange={(value) =>
                    handleScheduleChange({ timezone: value })
                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                  }
                />
              )}
            </S.Row> */}
            {isInapp && (
              <S.Row>

                <div className="switchery">
                  <FormControlLabel
                    control={
                      <Switch
                        id={v1()}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        checked={schedule.multiShow}
                        onChange={({ target }) =>
                          handleScheduleChange({ multiShow: target.checked })
                        }
                      />
                    }
                    label={t('SETTINGS_SCHEDULE_SHOW_MESSAGE_MORE_THAN_ONCE_PER_USER_SWITCH_LABEL')}
                  />
                </div>

              </S.Row>
            )}
            {!schedule.repeat && !isInapp ? (
              <S.Row className="mb">
                <Grid className="switch-label-wrap switch-2-options" component="label" container alignItems="center">
                  <Grid
                    item className="switch-label"
                  ><div className="label-tooltip cc-label-text">{t('SETTINGS_SCHEDULE_DISTRIBUTE_IN_TIME_SWITCH_LABEL')}
                      <LightTooltip
                        title={<div>
                          <label>{t('TOOLTIP_FOR_DISTRIBUTE_IN_TIME')}
                            <a target="_blank" href="https://docs.digitalreef.com/docs/scheduling-options-know-more"> {t('KNOW_MORE')}</a>.
                          </label>
                        </div>}
                      />
                      {t('SWITCH_OFF')}
                    </div>
                  </Grid>
                  <Grid item className="no-padding">
                    <div className="switchery">
                      <FormControlLabel
                        control={
                          <Switch
                            id={v1()}
                            checked={schedule.distributeInTime}
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            onChange={({ target }) => {
                              const startAtDay = days[schedule.startAt.getDay()];
                              handleScheduleChange({
                                repeat: false,
                                distributeInTime: target.checked,
                                weekDays: [addDay(startAtDay)],
                              });
                            }}
                          />
                        }
                        label={''}
                      />
                    </div>
                  </Grid>
                  <Grid
                    item className="switch-label"
                  > {t('SWITCH_ON')}
                  </Grid>

                </Grid>
              </S.Row >
            ) : null}
            {!isInapp && (schedule.repeat || schedule.distributeInTime) ? (
              <>
                <S.Row>
                  <Grid container spacing={3}>
                    <Grid item sm={12} lg={6} className="form-row">
                      {/* <TextField
                        select
                        label={
                          !!schedule.distributeInTime
                            ? t('SETTINGS_SCHEDULE_REPEAT_EVERY_LABEL')
                            : t('SETTINGS_SCHEDULE_RETARGET_EVERY_LABEL')
                        }
                        value={schedule.repeatEvery}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        onChange={({ target }) => {
                          const monthlyDayTime = getDate(schedule.startAt);
                          handleScheduleChange({
                            repeatEvery: target.value,
                            monthlyDayTime,
                          });
                        }}
                        variant="outlined"
                      >
                        <option value={""} hidden></option>
                        <option value={"day"}>{t('SETTING_SCHEDULE_TIME_TYPE_DAYS')}</option>
                        <option value={"month"}>Month(s)</option>
                      </TextField> */}
                      <FormControl className="form-select-box">
                        <InputLabel variant="filled">{!!schedule.distributeInTime
                          ? t('SETTINGS_SCHEDULE_REPEAT_EVERY_LABEL')
                          : t('SETTINGS_SCHEDULE_RETARGET_EVERY_LABEL')}</InputLabel>
                        <Select
                          value={schedule.repeatEvery}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          onChange={({ target }) => {
                            const monthlyDayTime = getDate(schedule.startAt);
                            handleScheduleChange({
                              repeatEvery: target.value,
                              monthlyDayTime
                            });
                          }}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left"
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left"
                            },
                            getContentAnchorEl: null
                          }}
                        >
                          <MenuItem value={"day"}>{t('SETTING_SCHEDULE_TIME_TYPE_DAYS')}</MenuItem>
                          {/* <MenuItem value={"month"}>Month(s)</MenuItem> */}
                        </Select>

                      </FormControl>
                    </Grid>

                    <SelectDate
                      value={schedule.endAt}
                      minDate={schedule.startAt}
                      required={true}
                      onChange={(date) => {
                        if (!schedule.expAt) {
                          handleScheduleChange({ endAt: date, expAt: date })
                        } else {
                          handleScheduleChange({ endAt: date })
                        }
                      }}
                      label={t('SETTINGS_SCHEDULE_END_DATE_LABEL')}
                      disablePast={(today(state.orgDetails?.timeZone) > helper.formatDate(schedule.endAt)) ? true : false}
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    />
                    {!isInapp && (
                      <SelectDate
                        value={schedule.expAt}
                        minDate={schedule.endAt}
                        required={true}
                        onChange={(date) => handleScheduleChange({ expAt: date })}
                        label={t('SETTINGS_SCHEDULE_EXP_DATE_LABEL')}
                        disablePast={(today(state.orgDetails?.timeZone) > helper.formatDate(schedule.expAt)) ? true : false}
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      />
                    )}
                  </Grid>
                </S.Row>

              </>
            ) : null
            }

            {schedule.multiShow && isInapp ? (
              <>
                <S.Row className="inapp-show-more mt-15">
                  <Grid container spacing={3}>
                    <Grid item sm={12} lg={6}>
                      {/* <TextField
                        select
                        label={t('SETTING_SCHEDULE_SHOW_MESSAGE_MAXIMUM_OF_LABEL')}
                        value={schedule.repeatMany}
                        onChange={({ target }) =>
                          handleScheduleChange({ repeatMany: target.value })
                        }
                        variant="outlined"
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      >
                        <option value={""} hidden></option>
                        <option value={"1"}>1</option>
                        <option value={"2"}>2</option>
                        <option value={"3"}>3</option>
                        <option value={"4"}>4</option>
                        <option value={"5"}>5</option>
                        <option value={"6"}>6</option>
                      </TextField> */}
                      <FormControl className="form-select-box label-width-265">
                        <InputLabel variant="filled">{t('SETTING_SCHEDULE_SHOW_MESSAGE_MAXIMUM_OF_LABEL')}</InputLabel>
                        <Select
                          value={schedule.repeatMany}
                          onChange={({ target }) =>
                            handleScheduleChange({ repeatMany: target.value })
                          }
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left"
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left"
                            },
                            getContentAnchorEl: null
                          }}
                        >
                          <MenuItem value={"1"}>1</MenuItem>
                          <MenuItem value={"2"}>2</MenuItem>
                          <MenuItem value={"3"}>3</MenuItem>
                          <MenuItem value={"4"}>4</MenuItem>
                          <MenuItem value={"5"}>5</MenuItem>
                          <MenuItem value={"6"}>6</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item sm={12} lg={6}>
                      {/* <TextField
                        select
                        value={schedule.multiShowRangeType}
                        onChange={({ target }) =>
                          handleScheduleChange({ multiShowRangeType: target.value })
                        }
                        variant="outlined"
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      >
                        <option value={""} hidden></option>
                        <option value={"MINUTES"}>{t('SETTING_SCHEDULE_TIME_TYPE_MINUTES')}</option>
                        <option value={"HOUR"}>{t('SETTING_SCHEDULE_TIME_TYPE_HOURS')}</option>
                        <option value={"DAY"}>{t('SETTING_SCHEDULE_TIME_TYPE_DAYS')}</option>
                        <option value={"WEEK"}>{t('SETTING_SCHEDULE_TIME_TYPE_WEEKS')}</option>
                        <option value={"MONTH"}>{t('SETTING_SCHEDULE_TIME_TYPE_MONTHS')}</option>
                      </TextField> */}
                      <FormControl className="form-select-box">
                        <Select
                          value={schedule.multiShowRangeType}
                          onChange={({ target }) =>
                            handleScheduleChange({ multiShowRangeType: target.value })
                          }
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left"
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left"
                            },
                            getContentAnchorEl: null
                          }}>
                          <MenuItem value={"MINUTES"}>{t('SETTING_SCHEDULE_TIME_TYPE_MINUTES')}</MenuItem>
                          <MenuItem value={"HOUR"}>{t('SETTING_SCHEDULE_TIME_TYPE_HOURS')}</MenuItem>
                          <MenuItem value={"DAY"}>{t('SETTING_SCHEDULE_TIME_TYPE_DAYS')}</MenuItem>
                          <MenuItem value={"WEEK"}>{t('SETTING_SCHEDULE_TIME_TYPE_WEEKS')}</MenuItem>
                          <MenuItem value={"MONTH"}>{t('SETTING_SCHEDULE_TIME_TYPE_MONTHS')}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </S.Row>
              </>
            ) : null}
          </Grid >
          <Grid item sm={12} lg={6}>
            <div className="row">
              <Grid item sm={12} lg={12} className="form-row">
                {/* <TextField
                  id={v1()}
                  select
                  label={t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_LABEL')}
                  placeholder={t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_PLACEHOLDER')}
                  value={schedule.network}
                  onChange={(e) =>
                    handleScheduleChange({ network: e.target.value })
                  }
                  variant="outlined"
                  disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                >
                  <option value={""} hidden></option>
                  <option value={"WIFI"}>{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_OPTION_WIFI')}</option>
                  <option value={"CELLULAR"}>{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_OPTION_CELLULAR')}</option>
                  <option value={"ALL"}>{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_OPTION_ALL')}</option>
                </TextField> */}
                <FormControl className="form-select-box label-width-480">
                  <InputLabel variant="filled">{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_LABEL')}</InputLabel>
                  <Select
                    value={schedule.network}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                      },
                      getContentAnchorEl: null
                    }}
                    disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    onChange={(e) =>
                      handleScheduleChange({ network: e.target.value })
                    }
                  >
                    <MenuItem value={"WIFI"}>{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_OPTION_WIFI')}</MenuItem>
                    <MenuItem value={"CELLULAR"}>{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_OPTION_CELLULAR')}</MenuItem>
                    <MenuItem value={"ALL"}>{t('SETTINGS_SCHEDULE_DISTRIBUTION_NETWORK_OPTION_ALL')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {schedule.repeat && !isInapp ? (
                <>
                  <Grid item sm={12} lg={12} className="form-row">
                    {/* <TextField
                      id={v1()}
                      select
                      InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                      label={
                        <div className="label-tooltip">{t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_LABEL')}
                          <LightTooltip
                            title={<label><a target="_blank" href=""> {t('KNOW_MORE')}</a>.{' '}{t('TOOLTIP_FOR_ABOUT_IT')}</label>}
                          />
                        </div>}
                      placeholder={t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_PLACEHOLDER')}
                      value={schedule.targetBehavior}
                      onChange={(e) =>
                        handleScheduleChange({ targetBehavior: e.target.value })
                      }
                      variant="outlined"
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    >
                      <option value={""} hidden></option>
                      <option value={"ALL_AUDIENCE"}>
                        {t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_OPTION_SAME_AUDIENCE')}
                      </option>
                      <option value={"DROPPED_OFF_AUDIENCE"}>
                        {t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_OPTION_NOT_INTERACTED_AUDIENCE')}
                      </option>
                    </TextField> */}
                    <FormControl className="form-select-box">
                      <InputLabel variant="filled" style={{ pointerEvents: "auto" }} > <div className="label-tooltip">{t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_LABEL')}
                        <LightTooltip
                          title={<div>
                            <label><a target="_blank" rel="noopener noreferrer" href="https://docs.digitalreef.com/docs/scheduling-options-know-more"> {t('KNOW_MORE')}</a>.{' '}{t('TOOLTIP_FOR_ABOUT_IT')}</label>
                          </div>} />
                      </div></InputLabel>
                      <Select
                        value={schedule.targetBehavior}
                        onChange={(e) =>
                          handleScheduleChange({ targetBehavior: e.target.value })
                        }
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                          },
                          getContentAnchorEl: null
                        }}
                      >
                        <MenuItem value={"ALL_AUDIENCE"}>
                          {t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_OPTION_SAME_AUDIENCE')}
                        </MenuItem>
                        <MenuItem value={"DROPPED_OFF_AUDIENCE"}>
                          {t('SETTINGS_SCHEDULE_AUDIENCE_TARGET_OPTION_NOT_INTERACTED_AUDIENCE')}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item sm={12} lg={12} className="form-row">
                    {/* <TextField
                      id={v1()}
                      select
                      // label={t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_LABEL')}
                      InputLabelProps={{ style: { pointerEvents: "auto" }, shrink: true }}
                      label={<div className="label-tooltip">{t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_LABEL')}
                        <LightTooltip
                          title={<div>
                            <label><a target="_blank" href="https://docs.digitalreef.com/docs/scheduling-options-know-more"> {t('KNOW_MORE')}</a>.{' '}{t('TOOLTIP_FOR_ABOUT_IT')}</label>
                          </div>} />
                      </div>}
                      placeholder={t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_PLACEHOLDER')}
                      value={schedule.scheduleBehavior}
                      onChange={(e) =>
                        handleScheduleChange({ scheduleBehavior: e.target.value })
                      }
                      variant="outlined"
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    >
                      <option value={""} hidden></option>
                      <option value={"EVERY_SLOT"}>
                        {t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_OPTION_EVERY_SLOT')}
                      </option>
                      <option value={"DAILY"}>{t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_OPTION_RETARGET_DAILY')}</option>
                    </TextField> */}
                    <FormControl className="form-select-box">
                      <InputLabel variant="filled" style={{ pointerEvents: "auto" }} ><div className="label-tooltip">{t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_LABEL')}
                        <LightTooltip
                          title={<div>
                            <label><a target="_blank" rel="noopener noreferrer" href="https://docs.digitalreef.com/docs/scheduling-options-know-more"> {t('KNOW_MORE')}</a>.{' '}{t('TOOLTIP_FOR_ABOUT_IT')}</label>
                          </div>} />
                      </div></InputLabel>
                      <Select
                        value={schedule.scheduleBehavior}
                        onChange={(e) =>
                          handleScheduleChange({ scheduleBehavior: e.target.value })
                        }
                        disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                          },
                          getContentAnchorEl: null
                        }}
                      >
                        <MenuItem value={"EVERY_SLOT"}>
                          {t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_OPTION_EVERY_SLOT')}
                        </MenuItem>
                        <MenuItem value={"DAILY"}>{t('SETTINGS_SCHEDULE_SCHEDULE_BEHAVIOR_OPTION_RETARGET_DAILY')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : null}
            </div >
            {isInapp && (
              <>
                <div>
                  {/* <S.Row>
                    <div className="switchery">
                      <FormControlLabel
                        control={
                          <Switch
                            id={v1()}
                            checked={schedule.repeatMonth}
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            onChange={({ target }) => {
                              const monthlyDayTime = !schedule.monthlyDayTime ? getDate(schedule.startAt) :
                                schedule.monthlyDayTime;
                              handleScheduleChange({
                                monthlyDayTime,
                                repeatMonth: target.checked,
                                specificDays: false,
                              });
                            }}
                          />
                        }
                        label={t('SETTING_SCHEDULE_SHOW_MESSAGE_ON_SPECIFIC_DAY_OF_MONTH_SWITCH_LABEL')}
                      />
                    </div>
                  </S.Row> */}
                  {schedule.repeatMonth && (
                    <S.WeekRow className="inapp-week">
                      <div className="inapp-week-row">
                        <TextField
                          variant="outlined"
                          className="day-field"
                          label={t('SETTINGS_SCHEDULE_MONTHLY_ON_DAY_LABEL')}
                          value={schedule.monthlyDayTime}
                          InputProps={{ inputProps: { type: "number", min: 0, max: 31 } }}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          onChange={(e) => {
                            handleScheduleChange({
                              monthlyDayTime: (Number(e.target.value) > 31 || Number(e.target.value) <= 0)
                                ? 1 : e.target.value,
                            });
                          }}
                        />
                        <Slider
                          min={0}
                          max={24}
                          value={schedule.sendDayTime}
                          onChange={(e, time) =>
                            handleScheduleChange({
                              sendDayTime: time,
                            })
                          }
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          valueLabelDisplay="auto"
                          aria-labelledby="inapp.time-slider"
                        />
                        <p>
                          {schedule.sendDayTime[0]}:00h -{" "}
                          {schedule.sendDayTime[1]}:00h
                        </p>
                      </div>

                    </S.WeekRow>
                  )}
                </div>
                <S.Row>

                  <div className="switchery">
                    <FormControlLabel
                      control={
                        <Switch
                          id={v1()}
                          checked={schedule.specificDays}
                          onChange={({ target }) => {
                            handleScheduleChange({
                              specificDays: target.checked,
                              repeatMonth: false,
                            });
                          }}
                          disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                        />
                      }
                      label={t('SETTINGS_SCHEDULE_TIME_SLOTS_HEADER')}
                    />
                  </div>

                </S.Row>
                {schedule.specificDays && (
                  <div>
                    {schedule.inAppWeekDays.map((daySelected) => (
                      <S.WeekRow className="inapp-week" key={daySelected.id}>
                        <div className="inapp-week-row">
                          {schedule.inAppWeekDays.length > 1 ? (
                            <DeleteOutlineIcon
                              className={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'disabled-function' : ''}
                              onClick={() =>
                                handleRemoveInAppWeekDay(daySelected.id)
                              }
                            />
                          ) : null}
                          {/* <TextField
                            select
                            value={daySelected.day}
                            onChange={({ target }) =>
                              handleScheduleInAppWeekChange(
                                "day",
                                daySelected.id,
                                target.value
                              )
                            }
                            disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            variant="outlined"
                          >
                            {days
                              .filter((_, key) => {
                                if (dateDiff >= 6 || !schedule.endAt) {
                                  return true;
                                }
                                if (!!schedule.endAt) {
                                  return checkDistanceBetweenDates(key);
                                }
                              })
                              .map((day, key) => (
                                <option key={key} value={day}>
                                  {day}
                                </option>
                              ))}
                          </TextField> */}
                          <FormControl className="form-select-box">
                            <Select
                              value={daySelected.day}
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left"
                                },
                                transformOrigin: {
                                  vertical: "top",
                                  horizontal: "left"
                                },
                                getContentAnchorEl: null
                              }}
                              onChange={({ target }) =>
                                handleScheduleInAppWeekChange(
                                  "day",
                                  daySelected.id,
                                  target.value
                                )
                              }
                              disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}>
                              {days
                                .filter((_, key) => {
                                  if (dateDiff >= 6 || !schedule.endAt) {
                                    return true;
                                  }
                                  if (!!schedule.endAt) {
                                    return checkDistanceBetweenDates(key);
                                  }
                                })
                                .map((day, key) => (
                                  <MenuItem key={key} value={day}>
                                    {day}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <Slider
                            min={0}
                            max={24}
                            value={daySelected.time}
                            onChange={(e, time) => {
                              handleScheduleInAppWeekChange(
                                "time",
                                daySelected.id,
                                time
                              )
                            }
                            }
                            disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            valueLabelDisplay="auto"
                            aria-labelledby="inapp.time-slider"
                          />
                          <p>
                            {daySelected.time[0]}:00h - {daySelected.time[1]}:00h
                          </p>
                        </div>
                        <p className="error-wrap error">{daySelected.dayError}</p>
                      </S.WeekRow>
                    ))}
                    <div className="add_btn-wrapper">
                      <Button
                        variant="text" color="primary" type="button" className="button-xs"
                        onClick={handleAddInAppWeekDay}
                        disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      >
                        <AddIcon /> {t('ADD_MORE_BUTTON')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Grid >
          {!isInapp && (schedule.repeat || schedule.distributeInTime) && <Grid item sm={12} lg={12}>
            {schedule.repeatEvery === "day" && (
              <div>
                <>
                  <p className="mb-20">
                    {t('SETTINGS_SCHEDULE_TIME_SLOTS_HEADER')}
                  </p>
                  {schedule.weekDays.map((daySelected, index) => (
                    <S.Row className="push-wrap" key={daySelected.id}>
                      <Grid container spacing={3} className="push-week">
                        <Grid item sm={5} lg={3}>
                          {/* <TextField
                            select
                            variant="outlined"
                            value={daySelected.day}
                            disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                            label={`${t('SETTINGS_SCHEDULE_TIME_SLOT_DAY_LABEL')} ${index + 1}`}
                            onChange={({ target }) =>
                              handleScheduleWeekChange(
                                "day",
                                daySelected.id,
                                target.value
                              )
                            }
                          >
                            {days
                              .filter((_, key) => {
                                if (dateDiff >= 6 || !schedule.endAt) {
                                  return true;
                                }
                                if (!!schedule.endAt) {
                                  return checkDistanceBetweenDates(key);
                                }
                              })
                              .map((day, key) => {
                                const isDisabled = ((!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus));
                                const cursor = isDisabled
                                  ? "not-allowed"
                                  : "pointer";
                                return (
                                  <option
                                    key={key}
                                    value={day}
                                    style={{ cursor }}
                                    disabled={!!isDisabled}
                                  >
                                    {day}
                                  </option>
                                );
                              })}
                          </TextField> */}
                          <FormControl className="form-select-box">
                            <InputLabel variant="filled">{`${t('SETTINGS_SCHEDULE_TIME_SLOT_DAY_LABEL')} ${index + 1}`}</InputLabel>
                            <Select
                              value={daySelected.day}
                              disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                              onChange={({ target }) =>
                                handleScheduleWeekChange(
                                  "day",
                                  daySelected.id,
                                  target.value
                                )
                              }
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left"
                                },
                                transformOrigin: {
                                  vertical: "top",
                                  horizontal: "left"
                                },
                                getContentAnchorEl: null
                              }}
                            >
                              {days
                                .filter((_, key) => {
                                  if (dateDiff >= 6 || !schedule.endAt) {
                                    return true;
                                  }
                                  if (!!schedule.endAt) {
                                    return checkDistanceBetweenDates(key);
                                  }

                                })
                                .map((day, key) => {
                                  const isDisabled = ((!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus));
                                  const cursor = isDisabled
                                    ? "not-allowed"
                                    : "pointer";
                                  return (
                                    <MenuItem
                                      key={key}
                                      value={day}
                                      style={{ cursor }}
                                      disabled={!!isDisabled}
                                    >
                                      {day}
                                    </MenuItem>
                                  );
                                })}

                            </Select>
                          </FormControl>
                        </Grid>

                        <SelectTime
                          label={t('SETTINGS_SCHEDULE_TIME_SET_LABEL')}
                          disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                          value={daySelected.time}
                          onChange={(date) =>
                            handleScheduleWeekChange(
                              "time",
                              daySelected.id,
                              date
                            )
                          }
                        />
                        <Grid item sm={2} lg={2} className="delete-icon-section">
                          {schedule.weekDays.length > 1 ? (
                            <DeleteOutlineIcon
                              className={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'disabled-function' : ''}
                              onClick={() =>
                                handleRemoveWeekDay(daySelected.id)
                              }
                            />
                          ) : null}
                        </Grid>
                      </Grid>
                      <p className="error">{daySelected.dayError}</p>
                    </S.Row>
                  ))}

                  <div className="kANHuF">
                    <Button
                      onClick={handleAddWeekDay}
                      disabled={(!schedule.endAt) || (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                    >
                      <AddIcon className="mr" /> {t('ADD_MORE_BUTTON')}
                    </Button>
                  </div>

                </>
              </div>
            )}
            {schedule.repeatEvery === "month" && (
              <S.Row>
                {dateDiff < 30 && (
                  <p>
                    Select the <strong> End Date </strong> with more than 30
                    days*
                  </p>
                )}
                {dateDiff >= 30 && (
                  <>
                    <TextField
                      variant="outlined"
                      label={t('SETTINGS_SCHEDULE_MONTHLY_ON_DAY_LABEL')}
                      value={schedule.monthlyDayTime}
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      onChange={({ target }) =>
                        handleScheduleChange({
                          monthlyDayTime: target.value,
                        })
                      }
                    />
                    <SelectTime
                      value={schedule.sendDayTime}
                      label={t('SETTINGS_SCHEDULE_TIME_SET_LABEL')}
                      disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
                      onChange={(date) =>
                        handleScheduleChange({ sendDayTime: date })
                      }
                    />
                  </>
                )}
              </S.Row>
            )}
          </Grid>}
        </Grid >
      </S.Card >
    </S.Container >
  );
}