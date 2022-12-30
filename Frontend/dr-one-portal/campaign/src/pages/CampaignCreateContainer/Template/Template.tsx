import { useContext, useEffect, useState } from "react";
import * as S from "./Template.styles";
import { GlobalContext } from '../../../context/globalState';
import { CAMPAIGN_ACTIONS } from "../../../context/CampaignFormReducer";
import {
  Button
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { useTranslation } from 'react-i18next';
import { Mixpanel } from "@dr-one/utils";
import HelpIcon from '@material-ui/icons/Help';
import { LightTooltip } from "@dr-one/shared-component";

function Template() {
  const { dispatch } = useContext(GlobalContext);
  const { state } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [selectedTemplateType, setTemplateType] = useState(state.formValues.template.primaryTemplateType);

  const templateType = [
    { name: t('TEMPLATE_TYPE_STANDARD'), id: 'standard', filePath: '/img/dr-template-type-standard.svg', filePathAfterSelection: '/img/dr-template-type-standard-selected.svg', isShow: state.formValues.registration.campaignType === 'push' || (state.formValues.registration.campaignType === 'pushInApp' && !state.isShowSecondaryTemplateSection) },
    { name: t('TEMPLATE_TYPE_RICH_TEXT'), id: 'richText', filePath: '/img/dr-template-type-rich-text.svg', filePathAfterSelection: '/img/dr-template-type-rich-text-selected.svg', isShow: state.formValues.registration.campaignType === 'push' || (state.formValues.registration.campaignType === 'pushInApp' && !state.isShowSecondaryTemplateSection) },
    { name: t('TEMPLATE_TYPE_RICH_IMAGE'), id: 'richImage', filePath: '/img/dr-template-type-rich-image.svg', filePathAfterSelection: '/img/dr-template-type-rich-image-selected.svg', isShow: state.formValues.registration.campaignType === 'push' || (state.formValues.registration.campaignType === 'pushInApp' && !state.isShowSecondaryTemplateSection) },
    // { name: 'Custom Rich Image', id: 'customRichImage', filePath: '/img/dr-template-type-custom-rich-image.svg', filePathAfterSelection: '/img/dr-template-type-custom-rich-image-selected.svg', isShow: state.formValues.registration.campaignType === 'push' },
    { name: t('TEMPLATE_TYPE_FULL_PAGE'), id: 'fullPage', filePath: '/img/dr-template-type-full-page.svg', filePathAfterSelection: '/img/dr-template-type-full-page-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_FULL_PAGE_WITH_VIDEO'), id: 'fullPageWithVideo', filePath: '/img/dr-template-type-full-page-video.svg', filePathAfterSelection: '/img/dr-template-type-full-page-video-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_POPUP_BANNER'), id: 'popup', filePath: '/img/dr-template-type-popup-banner.svg', filePathAfterSelection: '/img/dr-template-type-popup-banner-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_POPUP_VIDEO'), id: 'popupWithVideo', filePath: '/img/dr-template-type-popup-video.svg', filePathAfterSelection: '/img/dr-template-type-popup-video-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_RATING'), id: 'rating', filePath: '/img/dr-template-type-rating.svg', filePathAfterSelection: '/img/dr-template-type-rating-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_SLIDER'), id: 'slider', filePath: '/img/dr-template-type-slider.svg', filePathAfterSelection: '/img/dr-template-type-slider-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_BOTTOM_BANNER'), id: 'bottomBanner', filePath: '/img/dr-template-type-bottom-banner.svg', filePathAfterSelection: '/img/dr-template-type-bottom-banner-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' },
    { name: t('TEMPLATE_TYPE_TOP_BANNER'), id: 'topBanner', filePath: '/img/dr-template-type-top-banner.svg', filePathAfterSelection: '/img/dr-template-type-top-banner-selected.svg', isShow: state.formValues.registration.campaignType === 'inApp' }
  ]

  const modifiedTemplateTypeArray = templateType.filter((template) => {
    return template.isShow !== false;
  });

  const campaignObjectiveName = state.formValues.registration.campaignObjectiveName;
  let filterTemplateTypeArrayForCampaignObjective;

  switch (campaignObjectiveName) {
    case 'surveyAd':
      // if (state.formValues.registration.campaignType !== 'pushInApp') {
      //   filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
      //     return temp.id !== 'standard';
      //   })
      // } else {
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray;
      // }
      break;
    case 'displayOnlyAd':
      if (state.formValues.registration.campaignType !== 'pushInApp') {
        filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
          return temp.id !== 'richText';
        })
      } else {
        filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray;
      }
      if (state.formValues.registration.campaignType !== 'inApp') {
        filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
          return temp.id !== 'fullPage';
        })
      }
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      if (state.formValues.registration.campaignType !== 'pushInApp') {
        filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
          return temp.id !== 'standard';
        })
      }
      break;
    case 'showMessage':
      // filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
      //   return temp.id !== 'fullPageWithVideo';
      // })
      // filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
      //   return temp.id !== 'popupWithVideo';
      // })
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      break;
    case 'packageNameToOpenApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      break;
    case 'goToWeb':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      break;
    case 'fileIdToInstallApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      break;
    case 'packageNameToInstallApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      break;
    case 'phoneToCall':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
    case 'actionInTheApp':
      filterTemplateTypeArrayForCampaignObjective = modifiedTemplateTypeArray.filter((temp) => {
        return temp.id !== 'rating';
      })
      filterTemplateTypeArrayForCampaignObjective = filterTemplateTypeArrayForCampaignObjective.filter((temp) => {
        return temp.id !== 'slider';
      })
      break;
  }

  useEffect(() => {
    const isPrimaryemplateSelected = filterTemplateTypeArrayForCampaignObjective.findIndex(campaignObjective =>
      campaignObjective.id === selectedTemplateType);
    if (isPrimaryemplateSelected < 0) {
      setTemplateType('');
    }
  }, [])

  const selectTemplateType = (templateType: string): void => {
    setTemplateType(templateType);
    const modifiedPayload = Object.assign({}, state.formValues);
    modifiedPayload['template'] = {
      primaryTemplateType: templateType,
      secondaryTemplateType: state.formValues.registration.campaignType === 'inApp' ? '' : state.formValues.template.secondaryTemplateType,
      targetSDKVersion: state.formValues.template.targetSDKVersion
    };
    ;
    modifiedPayload['creative']['adDisplayTimeBehaviour'] = 'NONE';
    modifiedPayload['creative']['minimumAdDisplayTime'] = 0;
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: modifiedPayload, currentPageName: 'template',
        campaignBreadCrumbList: ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE'],
        campaignStepsArray: state.campaignStepsArray
      }
    })
  }

  const changePage = (section: string): void => {
    const modifiedPayload = Object.assign({}, state.formValues);
    if (state.formValues.registration.cpType === 'ENGAGEMENT') {
      modifiedPayload['template']['targetSDKVersion'] = '4.0.0';
    } else {
      if (state.formValues.registration.campaignObjectiveName === 'surveyAd') {
        if (Object.keys(state.formValues.creative.selectedSurvey).length === 0) {
          modifiedPayload['template']['targetSDKVersion'] = '3.2.0';
        } else {
          modifiedPayload['template']['targetSDKVersion'] = state.formValues.template.targetSDKVersion;
        }
      } else {
        if (state.formValues.registration.campaignObjectiveName === 'showMessage') {
          modifiedPayload['template']['targetSDKVersion'] = '2.16.0';
        } else {
          if (state.formValues.template.primaryTemplateType === 'richText' || state.formValues.template.primaryTemplateType === 'richImage') {
            modifiedPayload['template']['targetSDKVersion'] = '2.9.0';
          } else {
            modifiedPayload['template']['targetSDKVersion'] = '2.7.0';
          }
        }
      }
    }
    dispatch({
      type: CAMPAIGN_ACTIONS.MODIFY_CAMPAIGN_PAYLOAD,
      payload: {
        campaignPayload: modifiedPayload, currentPageName: section,
        campaignBreadCrumbList: section === 'registration' ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION'] :
          section === 'secondaryTemplate' ? ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE']
            : ['CAMPAIGN_MANAGEMENT', 'CREATE_CAMPAIGN', 'REGISTRATION', 'TEMPLATE', 'CREATIVE'],
        campaignStepsArray: state.campaignStepsArray
      }
    });

    switch (section) {
      case 'creative':
        Mixpanel.track("Create Campaign Page View", { "page": state.formValues.registration.campaignType === 'inApp' ? "Creative - In App" : "Creative - Push" });
        break;
      case 'secondaryTemplate':
        Mixpanel.track("Create Campaign Page View", { "page": "Template - In App" });
        break;
      case 'registration':
        Mixpanel.track("Create Campaign Page View", { "page": "Registration" });
        break;
    }
  }

  const modifyTemplateType = (campaignType: string): string => {
    if (campaignType === 'push' || campaignType === 'pushInApp') {
      return t('CAMPAIGN_TYPE_PUSH');
    } else if (campaignType === 'inApp') {
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
                  />
                </p>
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
              <div className="cc-global-buttons ">
                <Button
                  onClick={(e) => changePage('registration')}
                  variant="outlined"
                  color="primary"
                  type="button"
                >
                  {t('BACK_BUTTON')}
                </Button>
                <Button
                  onClick={(e) => changePage(state.formValues.registration.campaignType === 'pushInApp' ? 'secondaryTemplate' : 'creative')}
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

export default Template;