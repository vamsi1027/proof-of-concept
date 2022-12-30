import days from './days'
import timezones from './timezones';
import timezoneDetails from './timezoneDetails';
import apiDashboard, { API_URL } from "./api";
import punctuateNumber from './punctuateNumber';
import userHasPermission from "./userHasPermission";
import { Colors } from "./styles/colors";
import { helper } from './helper';
import internationalization from "./i18n";
import checkPassword from './checkPassword';
import Mixpanel from './mixpanel';
import isoIsdCodes from './isdCodes';
import GoogleMapsObject from './geofence';

export function emitEvent(name: string, data: CustomEventInit<any>) {
  dispatchEvent(new CustomEvent(name, { detail: data }))
}
export function listenEvent(name: string, cb: (event: any) => void) {
  window.addEventListener(name, cb)
}

export {
  days,
  API_URL,
  Colors,
  timezones,
  apiDashboard,
  punctuateNumber,
  helper,
  timezoneDetails,
  userHasPermission,
  checkPassword,
  internationalization,
  Mixpanel,
  isoIsdCodes,
  GoogleMapsObject
};
