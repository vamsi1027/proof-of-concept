import timezoneDetails from './timezoneDetails';
import userHasPermission from './userHasPermission';
const orgDetails = JSON.parse(localStorage.getItem('dr-user'));
const orgIndex = orgDetails?.organizations.findIndex(org => org.id === orgDetails?.organizationActive);

const manipulateQueryString = (statusList: string[], page: number = 0, pageSize: number = 10,
  sort: string = 'updatedAt', sortOrder: string = 'desc', filter: string = ''): string => {
  let queryString = '?';
  for (const status of statusList) {
    queryString += 'status=' + status + '&';
  }
  queryString += 'page=' + page + '&';
  queryString += 'page-size=' + pageSize + '&';
  queryString += 'sort=' + sort + '&';
  queryString += 'sort-order=' + sortOrder + '&';

  if (filter !== '') {
    queryString += 'filter=' + filter
  } else {
    queryString = queryString.slice(0, -1);
  }
  return queryString;
}

const stringCapitalize = (wordString: string): string => {
  if (wordString) {
    let modifiedWordString = wordString.toLowerCase().split(" ");
    for (let i = 0; i < modifiedWordString.length; i++) {
      modifiedWordString[i] = modifiedWordString[i].charAt(0).toUpperCase() + modifiedWordString[i].substr(1);
    }
    return modifiedWordString.join(" ");
  } else {
    return '';
  }
}

const getErrorMessage = (error: any): string => {
  if (error.response) {
    if (error.response.status !== 500) {
      return error.response.data.error ? error.response.data.error : error.response.data.detail;
    } else {
      return 'Whoops something went wrong! Try again.'
    }
  } else {
    return 'Whoops something went wrong! Try again.'
  }
}

const debounce = (func: any, wait: number): any => {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const isIncludeFilterAdded = (clusters: any): boolean => {
  let includeFlag = false;
  if (clusters.list.length > 0) {
    for (let i = 0; i < clusters.list.length; i++) {
      if (clusters.list[i]['operation'] === 'INCLUDE') {
        includeFlag = true;
        break;
      }
    }
  }
  return includeFlag;

}

const getAudienceReachCountForCampaign = (collection: any, force: boolean = false, feature: any = [], minSdk?: string | null,
  isInterstitialAd: boolean = false, enableVas: boolean = false): string => {
  let endpoint = 'campaign-mgmt-api/audienceclusters/reachcount?'
    + 'filters=' + JSON.stringify(collection)
    + '&forcecalculation=' + force + '&feature=' + JSON.stringify(feature);
  if (minSdk) {
    endpoint += '&minSdk=' + minSdk;
  }
  endpoint += '&isInterstitialAd=' + isInterstitialAd + '&enableVas=' + enableVas
  return endpoint;
}

const formatDate = (date: Date): any => {
  let modifiedDate = new Date(date),
    month = '' + (modifiedDate.getMonth() + 1),
    day = '' + modifiedDate.getDate(),
    year = modifiedDate.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const formatDateWithSlash = (date: Date): any => {
  let modifiedDate = new Date(date),
    month = '' + (modifiedDate.getMonth() + 1),
    day = '' + modifiedDate.getDate(),
    year = modifiedDate.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('/');
}

const hoursAndMinutes = (data: Date): any => {
  const time = [data.getHours(), data.getMinutes()];
  return (time[0] * 60) + time[1];
}

const convertDayOfWeek = (day: string): number => {
  let dayValue;
  switch (day) {
    case 'Sunday':
      dayValue = 0;
      break;
    case 'Monday':
      dayValue = 1;
      break;
    case 'Tuesday':
      dayValue = 2;
      break;
    case 'Wednesday':
      dayValue = 3;
      break;
    case 'Thursday':
      dayValue = 4;
      break;
    case 'Friday':
      dayValue = 5;
      break;
    case 'Saturday':
      dayValue = 6;
      break;
    default:
      dayValue = 0;
      break;
  }
  return dayValue;
}

const sort = (records: Array<any>, args?: any): any => {
  return records.sort(function (a, b) {
    let valueA, valueB;
    if (typeof a[args.property] === 'string') {
      valueA = a[args.property].toLowerCase();
      valueB = b[args.property].toLowerCase();
    } else {
      valueA = a[args.property];
      valueB = b[args.property];
    }
    if (valueA < valueB) {
      return -1 * args.direction;
    } else if (valueA > valueB) {
      return 1 * args.direction;
    } else {
      return 0;
    }
  });
}

const convertDateByTimeZone = (timezone: string): any => {
  // create Date object for current location
  const dateObj = new Date();

  // convert to UTC-0
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());

  // convert to desire timezone using offset
  dateObj.setMinutes(dateObj.getMinutes() + (getTimezoneOffset(timezone) * 60));

  return dateObj;
}

const radix = 10;

const getTimezoneOffset = (timezone: string): any => {
  let offest = null;
  for (const country of timezoneDetails) {
    for (const zone of country.zones) {
      if (zone.java_code === timezone) {
        offest = zone.utc_diff.substr(4);
        // convert minutes to decimal, if minute exists
        if (offest.indexOf('.') !== -1) {
          const minute = offest.substr(offest.indexOf('.') + 1);
          const hour = parseInt(offest.substr(0, offest.indexOf('.')), radix);
          const decimal = minute / 60;
          if (hour >= 0) {
            offest = hour + decimal;
          } else {
            offest = hour - decimal;
          }
        }
        break;
      }
    }
    if (offest !== null) {
      break;
    }
  }

  return offest;
}

const convertDateToObject = (date: any): any => {
  const modifiedDate = date.split('-');
  return new Date(modifiedDate[0], modifiedDate[1] - 1, modifiedDate[2], new Date().getHours(), new Date().getMinutes(),
    new Date().getSeconds(), new Date().getMilliseconds());
}

const convertWeekNumberToDay = (dayValue: number): string => {
  let day;
  switch (dayValue) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;
    default:
      day = 'Sunday';
      break;
  }
  return day;
}

const secondsToDate = (sec: number, flag: string = 'start_time'): any => {
  if (flag === 'end_time' && sec === 0) {
    sec = 1440;
  }
  if (flag === 'end_time' && sec === 1439) {
    sec = 1440;
  }
  const hh: number = Math.trunc(sec / 60);
  const mm: number = sec - (hh * 60);
  const result: Date = new Date(0, 0, 0, hh, mm, 0);
  return result;
}

const isMobile = (): boolean => {
  return /Android|iPhone|iPad/i.test(window.navigator.userAgent);
}

const trimString = (str: string): string => {
  if (typeof str === 'string') {
    return str.trim();
  }
  return str;
}

const formatClusterCriteria = (criteria: any): any => {
  const criteriaData = {
    condition: criteria?.condition,
    list: []
  };

  if (criteria?.list?.length > 0) {
    for (const filters of criteria.list) {
      const itemList = [];
      for (const item of filters.list) {
        if (!!item.id) {
          itemList.push({
            id: item.id,
            name: item.name
          });
        }
        else if (!!item.key) {
          itemList.push({
            key: item.key,
            value: item.value
          });
        }
      }
      if (itemList.length > 0) {
        criteriaData.list.push({
          operation: filters.operation,
          condition: filters.condition,
          list: itemList
        });
      }
    }
  }

  return criteriaData;
}

const convertMonthOfYear = (monthValue: number): number => {
  let month;
  switch (monthValue) {
    case 0:
      month = 'January';
      break;
    case 1:
      month = 'February';
      break;
    case 2:
      month = 'March';
      break;
    case 3:
      month = 'April';
      break;
    case 4:
      month = 'May';
      break;
    case 5:
      month = 'June';
      break;
    case 6:
      month = 'July';
    case 7:
      month = 'August';
      break;
    case 8:
      month = 'September';
      break;
    case 9:
      month = 'October';
    case 10:
      month = 'November';
      break;
    case 11:
      month = 'December';
      break;
    default:
      month = 'January';
      break;
  }
  return month;
}

const convertTimestampToDate = (timestamp: number): any => {
  return `${convertMonthOfYear(new Date(timestamp).getMonth())} ${new Date(timestamp).getDate()}, ${new Date(timestamp).getFullYear()}, 
  ${new Date(timestamp).getHours()} :  ${new Date(timestamp).getMinutes()} : ${new Date(timestamp).getSeconds()} ${getMeridiem(new Date(timestamp))}`
}
const timestampToDateString = (timestamp: number): any => {
  return `${new Date(timestamp).getDate()}/${new Date(timestamp).getMonth() + 1}/${new Date(timestamp).getFullYear()}`
}
const convertTimestampInTimezone = (timestamp: number, timeZone: string): any => {
  return new Date(timestamp).toLocaleString(
    'en-US',
    {
      timeZone: timeZone, timeZoneName: 'short',
      month: 'short', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }
  )
}

const getMeridiem = (date: Date) => {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

const redirectPath = () => {
  if (userHasPermission(["R_CAMPAIGN", "R_CAMPAIGN_OWN_ORG", "R_CAMPAIGN_OWN"])) {
    return '/campaign/manage';
  } else {
    if (userHasPermission(["R_DRP_CAMPAIGN", "R_DRP_CAMPAIGN_OWN", "R_DRP_CAMPAIGN_OWN_ORG"])) {
      return '/data-rewards';
    } else if (userHasPermission(["R_DRP_CAMPAIGN_ANALYTICS", "R_DRP_CAMPAIGN_ANALYTICS_OWN", "R_DRP_CAMPAIGN_ANALYTICS_OWN_ORG"])) {
      return '/data-rewards/global-analytics';
    } else if (userHasPermission(["R_AC", "R_AC_OWN_ORG"])) {
      return '/audience/manage';
    } else {
      const userHasPermissionProfile = userHasPermission(['C_PRELOAD_PROFILE', 'C_PRELOAD_PROFILE_OWN_ORG', 'R_PRELOAD_PROFILE',
        'R_PRELOAD_PROFILE_OWN', 'R_PRELOAD_PROFILE_OWN_ORG']);
      const userHasPermissionChannel = userHasPermission(['R_PRELOAD_CHANNEL', 'R_PRELOAD_CHANNEL_OWN', 'R_PRELOAD_CHANNEL_OWN_ORG']);
      const userHasPermissionApp = userHasPermission(['R_PRELOAD_SUPPORTED_APP', 'R_PRELOAD_SUPPORTED_APP_OWN', 'R_PRELOAD_SUPPORTED_APP_OWN_ORG']);
      const userHasPermissionDevice = userHasPermission(['R_PRELOAD_SUPPORTED_DEVICE', 'R_PRELOAD_SUPPORTED_DEVICE_OWN', 'R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG']);
      if (userHasPermissionProfile && userHasPermissionChannel && userHasPermissionApp && userHasPermissionDevice) {
        return '/virtual-preload';
      } else {
        const userHasPermissionSurvey = userHasPermission(['R_SURVEY', 'R_SURVEY_OWN', 'R_SURVEY_OWN_ORG']);
        const userHasPermissionQuestion = userHasPermission(['R_QUESTION', 'R_QUESTION_OWN', 'R_QUESTION_OWN_ORG']);
        let enableSurvey;
        if (orgIndex > -1) {
          enableSurvey = orgDetails?.organizations[orgIndex].enableSurvey;
          if (enableSurvey && userHasPermissionSurvey && userHasPermissionQuestion) {
            return '/survey/manage';
          } else {
            return '/';
          }
        } else {
          return '/';
        }
      }
    }
  }
}
//mongoObjectId 
const generateMongoObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

const numberFormatter = (num: number): string => {

  const conversionArray = ["", "K", "M", "B", "T"];

  // dividing the value by 3.
  const stringNum = Math.floor(("" + num).length / 3);

  // calculating the precised value.
  const convertedValue = parseFloat((stringNum != 0 ? (num / Math.pow(1000, stringNum)) : num).toPrecision(2));

  let finalValue;
  if (convertedValue % 1 !== 0) {
    finalValue = convertedValue.toFixed(1);
  } else {
    finalValue = convertedValue;
  }

  // appending the letter to precised val.
  return `${finalValue} ${conversionArray[stringNum]}`;
}


export const helper = {
  manipulateQueryString,
  stringCapitalize,
  getErrorMessage,
  debounce,
  isIncludeFilterAdded,
  getAudienceReachCountForCampaign,
  formatDate,
  hoursAndMinutes,
  convertDayOfWeek,
  sort,
  convertDateByTimeZone,
  getTimezoneOffset,
  radix,
  convertDateToObject,
  convertWeekNumberToDay,
  secondsToDate,
  isMobile,
  trimString,
  formatClusterCriteria,
  convertTimestampToDate,
  convertMonthOfYear,
  convertTimestampInTimezone,
  formatDateWithSlash,
  redirectPath,
  timestampToDateString,
  generateMongoObjectId,
  numberFormatter
}
