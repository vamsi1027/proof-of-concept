// import { useContext } from 'react'
// import { Card, Grid, Button, Switch, FormControlLabel, FormControl, Slider } from "@material-ui/core"
// import { GlobalContext, blackoutSlot } from '../../../context/globalState';
// import { useTranslation } from 'react-i18next';
// import { LightTooltip } from "@dr-one/shared-component";
// import AddIcon from "@material-ui/icons/Add";

// function CampaignBlackout() {
//     const { t } = useTranslation();
//     const { state, dispatch } = useContext(GlobalContext);

//     const handleChangeCampaignBlackout = (e: any): void => {
//         const modifiedPayload = Object.assign({}, state.orgSetting);
//         modifiedPayload['campaignBlackout']['isCamapignBlackout'] = e.target.checked;
//         const modifiedSlotArray = [...modifiedPayload['campaignBlackout']['slots']];
//         modifiedSlotArray.map(slot => {
//             slot.isSlotOverlap = isSlotOverlap(slot);
//         })
//         modifiedPayload['campaignBlackout']['isValidCampaignBlackout'] = state.orgSetting.campaignBlackout.isValidCampaignBlackout ? modifiedSlotArray.every(slot => slot.isSlotOverlap === false) : true;
//         dispatch({
//             type: "UPDATE_ORGANIZATION_PAYLOAD",
//             payload: {
//                 orgSetting: modifiedPayload
//             }
//         });
//     }

//     const handleChangeSlots = (id: string, value: any): void => {
//         const itemIndex = state.orgSetting.campaignBlackout.slots.findIndex(slot => slot.id === id);
//         if (itemIndex > -1) {
//             const modifiedPayload = Object.assign({}, state.orgSetting);
//             const modifiedSlotArray = [...modifiedPayload['campaignBlackout']['slots']];
//             modifiedSlotArray[itemIndex]['time'] = value;
//             modifiedSlotArray.map(slot => {
//                 slot.isSlotOverlap = isSlotOverlap(slot);
//             })
//             modifiedPayload['campaignBlackout']['isValidCampaignBlackout'] = state.orgSetting.campaignBlackout.isValidCampaignBlackout ? modifiedSlotArray.every(slot => slot.isSlotOverlap === false) : true;
//             dispatch({
//                 type: "UPDATE_ORGANIZATION_PAYLOAD",
//                 payload: {
//                     orgSetting: modifiedPayload
//                 }
//             });
//         }
//     }

//     const handleAddSlot = (): void => {
//         const modifiedPayload = Object.assign({}, state.orgSetting);
//         const modifiedSlotArray = [...modifiedPayload['campaignBlackout']['slots']];
//         modifiedSlotArray.push(blackoutSlot());
//         modifiedPayload['campaignBlackout']['slots'] = modifiedSlotArray;
//         modifiedSlotArray.map(slot => {
//             slot.isSlotOverlap = isSlotOverlap(slot);
//         })
//         modifiedPayload['campaignBlackout']['isValidCampaignBlackout'] = state.orgSetting.campaignBlackout.isValidCampaignBlackout ? modifiedSlotArray.every(slot => slot.isSlotOverlap === false) : true;

//         dispatch({
//             type: "UPDATE_ORGANIZATION_PAYLOAD",
//             payload: {
//                 orgSetting: modifiedPayload
//             }
//         });
//     }

//     const isSlotOverlap = (slot: any): boolean => {
//         let isOverlap = false;
//         for (const slotState of state.orgSetting.campaignBlackout.slots) {
//             if (slot.id !== slotState.id) {
//                 if (slot.time[0] > slotState.time[0] && slot.time[0] < slotState.time[1]) {
//                     isOverlap = true;
//                     break;
//                 } else if (slotState.time[0] > slot.time[1] && slotState.time[0] < slot.time[1]) {
//                     isOverlap = true;
//                     break;
//                 } else if (slotState.time[1] > slot.time[0] && slotState.time[1] < slot.time[1]) {
//                     isOverlap = true;
//                     break;
//                 } else if (slotState.time[0] === slot.time[0]) {
//                     isOverlap = true;
//                     break;
//                 } else if (slotState.time[1] === slot.time[1]) {
//                     isOverlap = true;
//                     break;
//                 } else {
//                     isOverlap = false;
//                 }
//             }
//         }
//         return isOverlap;
//     }

//     return (
//         <Grid container>
//             <div className="row">
//                 <Grid item md={12} xs={12}>
//                     <div className="cc-form-wrapper">
//                         <div className="cr-top-main">
//                             <div className="cr-top-wrapper">
//                                 <h5 className="title-padding">
//                                     {t('ADMIN_MANAGE_CAMPAIGN_BLACKOUT_HEADER')}
//                                 </h5>
//                                 <hr></hr>
//                                 <div className="cr-body-content">
//                                     <Grid container>
//                                         <div className="row last-row">
//                                             <Grid item xs={6} lg={4} className="form-row">
//                                                 <FormControl component="fieldset">
//                                                     <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
//                                                         <div className="label-tooltip small-tooltip">{`${t('ADMIN_MANAGE_CAMPAIGN_BLACKOUT_LABEL')}`}
//                                                             <LightTooltip title={<label>{t('TOOLTIP_ENABLE_EXTERNAL_ORG')}</label>}
//                                                             /> </div>
//                                                     </label>
//                                                     <div className="switchery org-switchery">
//                                                         <FormControlLabel
//                                                             control={<Switch
//                                                                 checked={state.orgSetting.campaignBlackout.isCamapignBlackout}
//                                                                 onChange={handleChangeCampaignBlackout}
//                                                                 name="campaignBlackout"
//                                                             />}
//                                                             label={t('ENABLE')}
//                                                         />
//                                                     </div>
//                                                 </FormControl>
//                                             </Grid>
//                                             {state.orgSetting.campaignBlackout.isCamapignBlackout && <Grid item xs={6} lg={8} >
//                                                 <label className="MuiFormLabel-root" style={{ fontSize: 12 }}>
//                                                     <div className="label-tooltip small-tooltip">{`${t('ADMIN_MANAGE_CAMPAIGN_SLOTS_LABEL')}`}
//                                                         <LightTooltip title={<label>{t('TOOLTIP_ENABLE_EXTERNAL_ORG')}</label>}
//                                                         /> </div>
//                                                 </label>
//                                                 {
//                                                     state.orgSetting.campaignBlackout.slots.map((slot, index) => (
//                                                         <div key={index}>
//                                                             <Slider
//                                                                 min={0}
//                                                                 max={24}
//                                                                 value={slot.time}
//                                                                 step={0.25}
//                                                                 onChange={(e, time) => {
//                                                                     handleChangeSlots(
//                                                                         slot.id,
//                                                                         time
//                                                                     )
//                                                                 }}
//                                                                 valueLabelDisplay="auto"
//                                                                 aria-labelledby="slot-slider"
//                                                             />
//                                                             <p>
//                                                                 {slot.time[0]}:00h - {slot.time[1]}:00h
//                                                             </p>
//                                                             {slot.isSlotOverlap && <p className="error">{t('SETTINGS_SCHEDULE_TIME_SLOT_OVERLAP_ERROR')}</p>}
//                                                         </div>
//                                                     ))
//                                                 }
//                                                 <div className="add_btn-wrapper">
//                                                     <Button
//                                                         variant="text" color="primary" type="button" className="button-xs"
//                                                         onClick={handleAddSlot} >
//                                                         <AddIcon /> {t('ADD_MORE_BUTTON')}
//                                                     </Button>
//                                                 </div>
//                                             </Grid>}
//                                         </div>
//                                     </Grid>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
                    
//                 </Grid >

//             </div >
//         </Grid >
//     )
// }

// export default CampaignBlackout;