import { TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@material-ui/core";
import { useContext } from "react";
import { GlobalContext } from "../../../context/globalState";
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import * as S from "./IOSAndroidFlag.styles";
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const IOSAndroidFlag = () => {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { t } = useTranslation();

  const buildCampaignOptionObject = (options: string) => {
    const optionObject = {};
    if (options && options.trim() !== '') {
      const optionArray = options.split(',');
      for (const value of Object.keys(optionArray)) {
        const optionKeyArray = optionArray[value].split('=');
        optionObject[optionKeyArray[0]] = optionKeyArray[1];
      }
    }
    return optionObject;
  }

  return (
    <S.Container>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography>
            <S.Logo>
              <img src="/img/custom-tracker-icon.svg" alt="audience icon" />
              <article>
                <p className="label-tooltip cc-label-text">{t('SETTINGS_CAMPAIGN_OPTIONS_SECTION_HEADER')} </p>
                <small>{t('OPTIONAL')}</small>
              </article>
            </S.Logo>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: '100%' }}>
            <TextField
              id="outlined-required"
              label={t('CAMPAIGN_OPTIONS_LABEL')}
              value={state.formValues.settings.campaignOptions}
              onChange={(e) => {
                const modifiedPayload = Object.assign({}, state.formValues);
                modifiedPayload['settings']['campaignOptions'] = e.target.value;
                if (e.target.value.length !== 0) {
                  const isCampaignOptionObjectValuesInvalid = Object.values(buildCampaignOptionObject(e.target.value)).some((option: any) => !option || option === undefined || option === '' || option?.length === 0);
                  modifiedPayload['settings']['isSettingSectionValid']['isCampaignOptionSectionValid'] = !isCampaignOptionObjectValuesInvalid;
                  modifiedPayload['settings']['campaignOptionsError'] = isCampaignOptionObjectValuesInvalid ? t('CAMPAIGN_OPTIONS_ERROR') : '';
                } else {
                  modifiedPayload['settings']['isSettingSectionValid']['isCampaignOptionSectionValid'] = true;
                  modifiedPayload['settings']['campaignOptionsError'] = '';
                }
            
                dispatch({
                  type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
                  payload: {
                    campaignPayload: modifiedPayload, currentPageName: 'settings',
                    campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE',
                      "SETTINGS"], campaignStepsArray: state.campaignStepsArray
                  }
                })
              }}
              placeholder={t('CAMPAIGN_OPTIONS_PLACEHOLDER')}
              variant="outlined"
              name="campaignOptions"
              InputLabelProps={{
                shrink: true,
              }}
              disabled={(window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus)}
              type="text"
            />
            {/* <p className="optional-msg">{`${t('OPTIONAL')}`}</p> */}
            <p className="error-wrap error">{state.formValues.settings.campaignOptionsError}</p>
          </div>
        </AccordionDetails>
      </Accordion>
    </S.Container>
  );
};

export default IOSAndroidFlag;
