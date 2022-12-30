import type { ReactNode } from 'react';
import ActionsHeader from "./actions-header/ActionsHeader.component";
import Audience from "./audience/Audience.component";
import CampaignsPerformance from "./campaigns-performance/CampaignsPerformance.component";
import ClicksFunnel from "./clicks-funnel/ClicksFunnel.component";
import ConversionFunnel from "./ConversionFunnel/ConversionFunnel.component";
import Geography from "./geography/Geography.component";
import SummaryHeader from "./summary-header/SummaryHeader.component";
import PushInAppConversionFunnel from "./ConversionFunnel/PushInAppConversionFunnel/PushInAppConversionFunnel.component";
import FunnelPerMonth from './FunnelPerMonth/FunnelPerMonth';

export type ComponentListType = {
    name: string,
    render: boolean,
    component: ReactNode
}

const RenderListAggregate: ComponentListType[] = [
    {
        name: "",
        render: true,
        component: <ActionsHeader className="Header" />
    },
    {
        name: "",
        render: true,
        component: <SummaryHeader className="summaryHeader" />
    },
    {
        name: "",
        render: true,
        component: <ConversionFunnel className="conversionFunnel" />
    },
    {
        name: "",
        render: true,
        component: <PushInAppConversionFunnel className="PushInAppConversionFunnel" />
    },
    {
        name: "",
        render: false,
        component: <ClicksFunnel className="clicksFunnel" />
    },
    {
        name: "",
        render: false,
        component: <CampaignsPerformance className="campaignsPerformance" />
    },
    {
        name: "",
        render: false,
        component: <Audience className="audience" />
    },
    {
        name: "",
        render: false,
        component: <Geography className="geography" />
    },
    {
        name: "",
        render: true,
        component: <FunnelPerMonth />
    }
];

export default RenderListAggregate;
