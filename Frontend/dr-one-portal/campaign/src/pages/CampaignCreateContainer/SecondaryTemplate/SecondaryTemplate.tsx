import { useContext, useState, useEffect } from "react";
import * as S from "./SecondaryTemplate.styles";
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import {
  Button
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { useTranslation } from 'react-i18next';
import { LightTooltip } from "@dr-one/shared-component";
import HelpIcon from '@material-ui/icons/Help';
import { Mixpanel } from "@dr-one/utils";

function SecondaryTemplate() {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { t } = useTranslation();
  const userData = JSON.parse(localStorage.getItem('dr-user'));
  const iuUserIndex = userData.organizations.findIndex(orgDetail => orgDetail.id === userData.organizationActive);
  const isIUUser = iuUserIndex > -1 ? userData.organizations[iuUserIndex].legacy : false;
  const [selectedTemplateType, setTemplateType] = useState(state.formValues.template.secondaryTemplateType);

  const templateTypeList = [
    { name: t('TEMPLATE_TYPE_FULL_PAGE'), id: 'fullPage', filePath: '/img/dr-template-type-full-page.svg', filePathAfterSelection: '/img/dr-template-type-full-page-selected.svg' },
    { name: t('TEMPLATE_TYPE_FULL_PAGE_WITH_VIDEO'), id: 'fullPageWithVideo', filePath: '/img/dr-template-type-full-page-video.svg', filePathAfterSelection: '/img/dr-template-type-full-page-video-selected.svg' },
    { name: t('TEMPLATE_TYPE_POPUP_BANNER'), id: 'popup', filePath: '/img/dr-template-type-popup-banner.svg', filePathAfterSelection: '/img/dr-template-type-popup-banner-selected.svg' },
    { name: t('TEMPLATE_TYPE_POPUP_VIDEO'), id: 'popupWithVideo', filePath: '/img/dr-template-type-popup-video.svg', filePathAfterSelection: '/img/dr-template-type-popup-video-selected.svg' },
    { name: t('TEMPLATE_TYPE_RATING'), id: 'rating', filePath: '/img/dr-template-type-rating.svg', filePathAfterSelection: '/img/dr-template-type-rating-selected.svg' },
    { name: t('TEMPLATE_TYPE_SLIDER'), id: 'slider', filePath: '/img/dr-template-type-slider.svg', filePathAfterSelection: '/img/dr-template-type-slider-selected.svg' },
    { name: t('TEMPLATE_TYPE_BOTTOM_BANNER'), id: 'bottomBanner', filePath: '/img/dr-template-type-bottom-banner.svg', filePathAfterSelection: '/img/dr-template-type-bottom-banner-selected.svg' },
    { name: t('TEMPLATE_TYPE_TOP_BANNER'), id: 'topBanner', filePath: '/img/dr-template-type-top-banner.svg', filePathAfterSelection: '/img/dr-template-type-top-banner-selected.svg' }
  ]

  let modifiedTemplateTypeList;
  if (isIUUser) {
    modifiedTemplateTypeList = [
      { name: t('TEMPLATE_TYPE_FULL_PAGE'), id: 'fullPage', filePath: '/img/dr-template-type-full-page.svg', filePathAfterSelection: '/img/dr-template-type-full-page-selected.svg' },
      { name: t('TEMPLATE_TYPE_FULL_PAGE_WITH_VIDEO'), id: 'fullPageWithVideo', filePath: '/img/dr-template-type-full-page-video.svg', filePathAfterSelection: '/img/dr-template-type-full-page-video-selected.svg' },
      { name: t('TEMPLATE_TYPE_POPUP_BANNER'), id: 'popup', filePath: '/img/dr-template-type-popup-banner.svg', filePathAfterSelection: '/img/dr-template-type-popup-banner-selected.svg' },
      { name: t('TEMPLATE_TYPE_POPUP_VIDEO'), id: 'popupWithVideo', filePath: '/img/dr-template-type-popup-video.svg', filePathAfterSelection: '/img/dr-template-type-popup-video-selected.svg' }
    ]
  } else {
    if (state.formValues.registration.cpType === 'MONETIZATION') {
      modifiedTemplateTypeList = [
        { name: t('TEMPLATE_TYPE_FULL_PAGE'), id: 'fullPage', filePath: '/img/dr-template-type-full-page.svg', filePathAfterSelection: '/img/dr-template-type-full-page-selected.svg' },
        { name: t('TEMPLATE_TYPE_FULL_PAGE_WITH_VIDEO'), id: 'fullPageWithVideo', filePath: '/img/dr-template-type-full-page-video.svg', filePathAfterSelection: '/img/dr-template-type-full-page-video-selected.svg' },
        { name: t('TEMPLATE_TYPE_POPUP_BANNER'), id: 'popup', filePath: '/img/dr-template-type-popup-banner.svg', filePathAfterSelection: '/img/dr-template-type-popup-banner-selected.svg' },
        { name: t('TEMPLATE_TYPE_POPUP_VIDEO'), id: 'popupWithVideo', filePath: '/img/dr-template-type-popup-video.svg', filePathAfterSelection: '/img/dr-template-type-popup-video-selected.svg' }
      ]
    } else {
      modifiedTemplateTypeList = templateTypeList;
    }
  }

  const campaignObjectiveName = state.formValues.registration.campaignObjectiveName;
  let filterTemplateTypeArrayForCampaignObjective;

  switch (campaignObjectiveName) {
    case 'surveyAd':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList;
      break;
    case 'displayOnlyAd':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      break;
    case 'showMessage':
      // filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
      //   return temp.id !== 'fullPageWithVideo';
      // })
      // filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
      //   return temp.id !== 'popupWithVideo';
      // })
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      break;
    case 'packageNameToOpenApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      if (state.formValues.template.primaryTemplateType !== 'standard') {
        filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
          return temp.id !== 'bottomBanner';
        })
        filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
          return temp.id !== 'topBanner';
        })
      }
      break;
    case 'goToWeb':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      break;
    case 'fileIdToInstallApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      break;
    case 'packageNameToInstallApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      break;
    case 'phoneToCall':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
    case 'actionInTheApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeList.filter((temp) => {
        return temp.id !== 'slider';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      break;
  }

  useEffect(() => {
    const isSecondaryemplateSelected = filterTemplateTypeArrayForCampaignObjective.findIndex(campaignObjective =>
      campaignObjective.id === selectedTemplateType);
    if (isSecondaryemplateSelected < 0) {
      setTemplateType('');
    }
  }, [])

  const selectTemplateType = (templateType: string): void => {
    setTemplateType(templateType);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['template'] = {
      primaryTemplateType: state.formValues.template.primaryTemplateType,
      secondaryTemplateType: templateType,
      targetSDKVersion: state.formValues.template.targetSDKVersion
    };
    modifiedPayload['creative']['adDisplayTimeBehaviour'] = 'NONE';
    modifiedPayload['creative']['minimumAdDisplayTime'] = 0;
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: modifiedPayload, currentPageName: 'secondaryTemplate',
        campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'],
        campaignStepsArray: state.campaignStepsArray
      }
    })
  }

  const changePage = (section: string): void => {
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: state.formValues, currentPageName: section,
        campaignBreadCrumbList: section === 'template' ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'] :
          ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'],
        campaignStepsArray: state.campaignStepsArray
      }
    })
    
    switch (section) {
      case 'creative':
        Mixpanel.track("Create Campaign Page View", { "page": "Creative - Push" });
        break;
      case 'template':
        Mixpanel.track("Create Campaign Page View", { "page": "Template - Push" });
        break;
    }
  }

  const modifyTemplateType = (campaignType: string): string => {
    if (campaignType === 'push') {
      return t('CAMPAIGN_TYPE_PUSH');
    } else if (campaignType === 'inApp' || campaignType === 'pushInApp') {
      return t('CAMPAIGN_TYPE_IN_APP');
    }
  }

  const appendClassNames = (template: any): string => {
    if (selectedTemplateType === template.id) {
      return (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'template-type-active disabled-function' : 'template-type-active';
    } else {
      return (window.location.pathname.indexOf('edit') > 0 && state.formValues.lockCampaignStatus) ? 'disabled-function' : ''
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <div className="cc-form-wrapper">
          <div className="cr-top-main">
            <S.Container>
              <div className="cc-global-wrapper">
                <p className="label-tooltip cc-label-text">{t('TEMPLATE_TYPE_HEADER')}<br />{t('TEMPLATE_TYPE_SUBHEADER')} {modifyTemplateType(state.formValues.registration.campaignType)} {t('CAMPAIGN_LABEL')}
                  <LightTooltip
                    title={<label>{t('TOOLTIP_FOR_TEMPLATE_HEADER')} <a target="_blank" rel="noopener noreferrer" href="https://docs.digitalreef.com/docs/campaign-templates"> {t('KNOW_MORE')}</a>.</label>}
                  /></p>
                <ul className="campaign-type">
                  {
                    filterTemplateTypeArrayForCampaignObjective.map((template, index) => (
                      <li className={appendClassNames(template)} key={template.id} onClick={(e) => selectTemplateType(template.id)}>
                        <img src={selectedTemplateType === template.id ? template.filePathAfterSelection : template.filePath} />
                        <span>{template.name}</span>
                        <span className="checkmark-wrapper"><img src="/img/Vector.svg" alt="checkmark icon" /></span>
                      </li>)
                    )
                  }
                </ul>
              </div>
              <div className="cc-global-buttons">
                <Button
                  onClick={(e) => changePage('template')}
                  variant="outlined"
                  color="primary"
                  type="button"
                >
                  {t('BACK_BUTTON')}
                </Button>
                <Button
                  onClick={(e) => changePage('creative')}
                  variant="contained"
                  color="primary"
                  type="button"
                  disabled={selectedTemplateType?.length === 0}
                  startIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                >
                  {t('CONTINUE_BUTTON')}
                </Button>
              </div>
            </S.Container>
          </div>
        </div>


      </Grid>
      {/* <Grid item md={4} xs={12}>
      </Grid> */}
    </Grid>
  );
}

export default SecondaryTemplate;