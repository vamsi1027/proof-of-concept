import type { ReactNode } from 'react';
import Geography from "./geography/Geography.component";
import CampaignAbout from "./CampaignAbout/CampaignAbout.component";
import ClicksAudience from "./clicks-audience/ClicksAudience.component";
import EventsTrigger from "./events-trigger/EventsTrigger.component";
import HeaderLinks from "./header-links/HeaderLinks.component";
import PreviewFunnel from "./PreviewFunnel/PreviewFunnel.component";
import HorizontalColumnsSpecific from "./PreviewFunnel/HorizontalColumnsSpecific/HorizontalColumnsSpecific";

export type ComponentListType = {
    name: string,
    render: boolean,
    component: ReactNode
}

const RenderListSpecific: ComponentListType[] = [
    {
        name: "",
        render: true,
        component: <HeaderLinks />
    },
    {
        name: "",
        render: true,
        component:  <CampaignAbout />
    },
    {
      name: "",
      render: false,
      component: <HorizontalColumnsSpecific />
    },
    {
        name: "",
        render: true,
        component: <PreviewFunnel />
    },
    {
        name: "",
        render: false,
        component: <ClicksAudience />
    },
    {
        name: "",
        render: false,
        component: <EventsTrigger />
    },
    {
        name: "",
        render: false,
        component:  <Geography />
    }
];

export default RenderListSpecific;
