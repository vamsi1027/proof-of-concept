import { useContext } from 'react'
import { Grid, Switch, FormControlLabel, FormControl, Slider } from "@material-ui/core"
import { GlobalContext } from '../../../context/globalState';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";

function valueLabelFormat(value) {
    const numberType = (value - Math.floor(value)) !== 0;
    if (numberType) {
        const wholePart = String(value > 12 ? (value - 12) : value).split('.')[0];
        const decimalPart = String(value).split('.')[1];
        const decimalUnit = Math.floor(Number(`0.${decimalPart}`) * 60);
        return wholePart === String(0) ? `12:${decimalUnit} ${value >= 12 ? 'PM' : 'AM'}` : `${wholePart}:${decimalUnit} ${value >= 12 ? 'PM' : 'AM'}`;
    } else {
        return `${value > 12 ? ((value - 12) === 0) ? `12:00` : value === 24 ? '11:59' : (value - 12) : value === 0 ? String(12) : value}${value !== 24 ? ':00' : ''} ${value >= 12 ? 'PM' : 'AM'}`;
    }
}

function CampaignDeliveryFormat() {
    const { t } = useTranslation();
    const { state, dispatch } = useContext(GlobalContext);

    const handleChangeCampaignDeliveryWindow = (e: any): void => {
        const modifiedPayload = Object.assign({}, state.orgSetting);
        modifiedPayload['campaignDeliveryWindow']['isOnCustomDeliveryWindow'] = e.target.checked;
        const modifiedSlotArray = [...modifiedPayload['campaignDeliveryWindow']['slots']];
        modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = e.target.checked ? state.orgSetting.campaignDeliveryWindow.slots[0]?.time[0] >= state.orgSetting.campaignDeliveryWindow.slots[0]?.time[1] ? false : true : true;
        dispatch({
            type: "UPDATE_ORGANIZATION_PAYLOAD",
            payload: {
                orgSetting: modifiedPayload
            }
        });
    }

    const handleChangeSlots = (id: string, value: any): void => {
        const itemIndex = state.orgSetting.campaignDeliveryWindow.slots.findIndex(slot => slot.id === id);

        if (itemIndex > -1) {
            const modifiedPayload = Object.assign({}, state.orgSetting);
            const modifiedSlotArray = [...modifiedPayload['campaignDeliveryWindow']['slots']];
            modifiedSlotArray[itemIndex]['time'] = value;
            modifiedPayload['campaignDeliveryWindow']['isValidCampaignDeliveryWindow'] = state.orgSetting.campaignDeliveryWindow.isOnCustomDeliveryWindow ? value[0] >= value[1] ? false : true : true;
            dispatch({
                type: "UPDATE_ORGANIZATION_PAYLOAD",
                payload: {
                    orgSetting: modifiedPayload
                }
            });
        }
    }

    return (
        <Grid container>
            <div className="row">
                <Grid item md={12} xs={12}>
                    <div className="cc-form-wrapper">
                        <div className="cr-top-main">
                            <div className="cr-top-wrapper">
                                <h5 className="title-padding">
                                    {t('ADMIN_SETTINGS_CAMPAIGN_DELIVERY_WINDOW_HEADER')}
                                </h5>
                                <hr></hr>
                                <div className="cr-body-content">
                                    <Grid container>
                                        <div className="row last-row">
                                            <Grid item xs={6} lg={4} className="form-row">
                                                <FormControl component="fieldset">
                                                    <div className="switchery org-switchery">
                                                        <FormControlLabel
                                                            control={<Switch
                                                                checked={state.orgSetting.campaignDeliveryWindow.isOnCustomDeliveryWindow}
                                                                onChange={handleChangeCampaignDeliveryWindow}
                                                                name="isOnCustomDeliveryWindow"
                                                            />}
                                                            label={t('ADMIN_SETTINGS_CAMPAIGN_DELIVERY_WINDOW_SWITCH_LABEL')}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </Grid>
                                            {state.orgSetting.campaignDeliveryWindow.isOnCustomDeliveryWindow && <Grid item xs={6} lg={8} >
                                                <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
                                                    <div className="label-tooltip small-tooltip">{`${t('ADMIN_SETTINGS_CAMPAIGN_CUSTOM_DELIVERY_SLOTS_LABEL')}`}
                                                        <LightTooltip title={<label>{t('ADMIN_SETTING_CAMPAIGN_DELIVERY_WINDOW_TOOLTIP')}</label>}
                                                        /> </div>
                                                </label>
                                                {
                                                    state.orgSetting.campaignDeliveryWindow.slots.map((slot, index) => (
                                                        <div key={index}>
                                                            <Slider
                                                                min={0}
                                                                max={24}
                                                                value={slot.time}
                                                                step={0.25}
                                                                onChange={(e, time) => {
                                                                    handleChangeSlots(
                                                                        slot.id,
                                                                        time
                                                                    )
                                                                }}
                                                                valueLabelDisplay="auto"
                                                                aria-labelledby="slot-slider"
                                                                valueLabelFormat={valueLabelFormat}
                                                            />
                                                            <p>
                                                                {valueLabelFormat(slot.time[0])} - {valueLabelFormat(slot.time[1])}
                                                            </p>
                                                            {(state.orgSetting.campaignDeliveryWindow && !state.orgSetting.campaignDeliveryWindow.isValidCampaignDeliveryWindow &&
                                                                state.orgSetting.campaignDeliveryWindow.slots[0]?.time[0] >=
                                                                state.orgSetting.campaignDeliveryWindow.slots[0]?.time[1]) && <p className="error">{t('ADMIN_SETTINGS_STARTTIME_EQUAL_ENDTIME__ERROR')}</p>}
                                                        </div>
                                                    ))
                                                }
                                            </Grid>}
                                        </div>
                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid >
            </div >
        </Grid >
    )
}

export default CampaignDeliveryFormat;