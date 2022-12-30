import mixpanel from 'mixpanel-browser';

if (process.env.NODE_ENV === 'prod') {
  if (!!process.env.REACT_APP_MIXPANEL_TOKEN)
    mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);
} else {
  if (!!process.env.REACT_APP_MIXPANEL_TOKEN)
    mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, { debug: true });
}

const canTrackEvent = (!!process.env.REACT_APP_MIXPANEL_TOKEN && ["portal.digitalreef.com", "beta.digitalreef.com"].includes(window.location.hostname));

const Mixpanel = {
  register: (props, days) => {

    /* Sample
     *
     * mixpanel.register({'Gender': 'Male'}, 2);
     */

    if (canTrackEvent) mixpanel.register(props, days);
  },
  register_once: (props) => {

    /* Sample
     *
     * mixpanel.register_once({'Time': new Date().toISOString()});
     */

    if (canTrackEvent) mixpanel.register_once(props);
  },
  unregister: (props) => {

    /* Sample
     *
     * mixpanel.unregister({'Gender': 'Male'});
     */

    if (canTrackEvent) mixpanel.unregister(props);
  },
  identify: (id) => {
    if (canTrackEvent) mixpanel.identify(id);
  },
  alias: (id) => {

    /* Sample
     *
     * mixpanel.alias('new_id', 'existing_id');
     */

    if (canTrackEvent) mixpanel.alias(id);
  },
  track: (eventName, props) => {

    /* Sample
     *
     * mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
     */

    if (canTrackEvent) mixpanel.track(eventName, props);
  },
  track_with_groups: (eventName, props, groups) => {

    /* Sample
     *
     *  mixpanel.track_with_groups('Registered', {'Gender': 'Male', 'Age': 21}, {'organization': ['DR-One', 'IU']})
     */

    if (canTrackEvent) mixpanel.track_with_groups(eventName, props, groups);
  },
  set_group: (key, ids) => {

    /* Sample
     *
     * mixpanel.set_group('organization', ['DR-One', 'IU']);
     * mixpanel.set_group('organization', 'DR-One');
     * mixpanel.set_group('organization', 128746312);
     */

    if (canTrackEvent) mixpanel.set_group(key, ids);
  },
  time_event: (eventName) => {

    /* Sample
     *
     * mixpanel.time_event('Registered');
     * mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
     */

    if (canTrackEvent) mixpanel.time_event(eventName);
  },
  people: {
    set: (props) => {

    /* Sample
     *
     * mixpanel.people.set({'organization': 'DR-One', 'plan': 'Premium'});
     */

      if (canTrackEvent) mixpanel.people.set(props);
    }
  }
};

export default Mixpanel;