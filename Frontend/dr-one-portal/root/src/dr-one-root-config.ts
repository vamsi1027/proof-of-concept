import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@dr-one/core",
  app: () => System.import("@dr-one/core"),
  activeWhen: ['/'],
  // activeWhen: location => location.pathname === '/',
});


start({ urlRerouteOnly: true });
