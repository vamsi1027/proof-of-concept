import React, { createContext, useReducer } from "react";
import { days, timezones } from "@dr-one/utils";
import { v1 } from "uuid";

export const campaignDeliverySlot = () => ({
    id: v1(),
    time: [10, 17],
    isSlotOverlap: false
});

import AdminFormReducer from './AdminFormReducer';
const initialState: any = {
    loading: false,
    orgSetting: {
        general: {
            name: '',
            timezone: timezones.includes(Intl.DateTimeFormat().resolvedOptions().timeZone) ?
                Intl.DateTimeFormat().resolvedOptions().timeZone : '',
            locationHistoryCleanUp: '',
            language: "",
            dormantDeviceFilterDays: '',
            countryISOCode: '',
            imageLogo: '',
            imageId: '',
            isValid: false,
            dataExpirySetting: '',
            limit: '',
            preloadCallbackInterval: '',
            orgPromptLoader: false,
            editPromptLoader: false
        },
        campaign: {
            s3AdUrl: '',
            mainImageSize: '',
            videoImageSize: '',
            clientIdForReachCount: false,
            gifImageSize: '',
            notificationImageSize: '',
            fsImageSize: '',
            isValidCampaign: false,
            startTime: '',
            endTime: ''
        },
        virtualPayload: {
            agencyId: '',
            advertiserId: '',
            clusterId: '',
            campaignCategoryid: '',
            campaignObjectiveId: '',
            sourcePackage: [],
            preloadDeliveryStrategyid: '',
            maxAcceleratedTimeDuration: '',
            apkFileMaxSize: '',
            chanel: '',
            maxSlot: 6,
            isValidVirtualPayload: false
        },
        vasDefault: {
            preSubscriptionTitle: '',
            preSubscriptionText: '',
            preSubscriptionActionText: '',
            preSubscriptionPositiveText: '',
            preSubscriptionNegativeText: '',
            processingText: '',
            defaultActionText: '',
            defaultFailureText: '',
            isValidVasDefault: false
        },
        adLimit: {
            campaignSchedulerAdLimit: '',
            max: '',
            rollingDays: '',
            isValidAdlimit: false,
            apiDrivenAdLimit: '',
            autoSchedulerAdLimit: '',
            maxInterstitial: '',
            rollingDaysInterstitial: '',
            adsTargetingInterstitialStrategy: '',
            interstitialInterval: ''
        },
        survey: {
            enableSurvey: false,
            numberOfQuestion: '',
            isValidSurvey: false
        },
        externalOrgSupport: {
            externalIdRequired: false,
            orgId: '',
            isValidExternalOrgSupport: false
        },
        report: {
            automaticallyEmailReport: '',
            emailDistribution: [],
            roles: [],
            validEmail: false
        },
        fcm: {
            fcmDataList: [],
            srcPkg: '',
            fcmDatabaseUrl: '',
            fcmApiKey: ''
        },
        campaignDeliveryWindow: {
            isOnCustomDeliveryWindow: false,
            slots: [campaignDeliverySlot()],
            isValidCampaignDeliveryWindow: true
        }
    }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AdminFormReducer, initialState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};
