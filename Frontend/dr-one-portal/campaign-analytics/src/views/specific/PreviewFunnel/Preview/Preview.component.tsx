// import { GraphCardLayout } from "../../../../layouts";
import { FC, memo, useEffect, useState } from "react";
import { image_preview_phone } from "../../../../assets";
import { useParams } from "react-router-dom";
import { MobilePreview } from "@dr-one/shared-component";
import { MobilePreviewProps } from "../funnel-types";
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Grid } from '@material-ui/core';


const TYPES = {
  PUSH: image_preview_phone,
  INAPP: image_preview_phone,
  PUSH_INAPP: image_preview_phone,
};

enum TEMPLATYPES {
  STANDARD = 'STANDARD',
  RICHTEXT = 'RICH-TEXT',
  RICHIMAGE = 'RICH-IMAGE',
  FULLPAGE = 'FULL',
  FULLPAGEWITHVIDEO = 'FULL-VIDEO',
  RATING = 'RATING',
  SLIDER = 'SLIDER',
  BOTTOMBANNER = 'BOTTOM-BANNER',
  TOPBANNER = 'TOP-BANNER',
  POPUPWITHVIDEO = 'BANNER-VIDEO',
  POPUP = 'BANNER'
}

const PreviewComponent: FC<MobilePreviewProps> = ({
  template,
  registration,
  creative,
}) => {
  let { type } = useParams();
  const [gifDuration, setGifDuration] = useState<any>(0);
  const [showSurveyPreviewPush, toggleSurveyPreviewPush] = useState(false);
  const [showSurveyPreviewInApp, toggleSurveyPreviewInApp] = useState(false);
  const props = {
    content: { title: "Preview", raised: true, isExportable: false },
  };

  useEffect(() => {
    if (template?.primaryTemplateType?.includes('POPUPWITHVIDEO') || template?.primaryTemplateType?.includes('FULLPAGEWITHVIDEO')) {
      if (creative.videoContent?.videoFileUrl.split('.').pop() === 'gif') {
        getFileFromUrl(creative.videoContent?.videoFileUrl, String(new Date().getTime()) + '.gif').then(res => {
          setGifDuration(res);
        })
      }
    }
  }, [])

  async function getFileFromUrl(url: string, name: string, defaultType = 'image/jpeg') {
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], name, {
      type: response.headers.get('content-type') || defaultType,
    });
    const duration = await isGifAnimated(file);
    return duration;
  }

  const isGifAnimated = (file) => {
    return new Promise((resolve, reject) => {
      try {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (event) => {
          const data: string | ArrayBuffer = fileReader.result;
          if (typeof data !== 'string') {
            let arr = new Uint8Array(data);
            let duration = 0;
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == 0x21
                && arr[i + 1] == 0xF9
                && arr[i + 2] == 0x04
                && arr[i + 7] == 0x00) {
                const delay = (arr[i + 5] << 8) | (arr[i + 4] & 0xFF)
                duration += delay < 2 ? 10 : delay;
              }
            }
            resolve(duration / 100);
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  const getFirstTemplate = (template: string) => {
    const [firstTemplate,] = template.split('_');
    return TEMPLATYPES[firstTemplate] || template;
  }

  const getSecondTemplate = (template: string) => {
    const [, secondTemplate] = template.split('_');
    return secondTemplate
      ? TEMPLATYPES[secondTemplate]
      : TEMPLATYPES[template];
  }

  const modifyFirstCampaignType = (campaignType: string) => {
    if (campaignType === 'PUSH_INAPP') {
      return 'PUSH';
    }
  }

  const modifySecondCampaignType = (campaignType: string): string => {
    if (campaignType === 'PUSH') {
      return 'PUSH';
    } else if (campaignType === 'INAPP' || campaignType === 'PUSH_INAPP') {
      return 'IN-APP';
    }
  }

  const modifyButtonListPush = (buttonList: Array<any>): Array<any> => {
    const buttonArray = [];
    if (buttonList && buttonList.length !== 0) {
      buttonList.forEach((buttonEle) => {
        buttonArray.push(buttonEle.label);
      })
    }
    return buttonArray;
  }

  const modifyButtonListInApp = (buttonList: Array<any>): Array<any> => {
    const buttonArray = [];
    if (buttonList && buttonList.length !== 0) {
      buttonList.forEach((buttonEle) => {
        buttonArray.push(buttonEle.text);
      })
    }
    return buttonArray;
  }

  const validateButtons = (
    cpType,
    campaignObjectiveName,
    // buttonPersonalizationOptions,
    buttons,
    campaignType,
    template
  ) => {
    if (cpType === 'MONETIZATION') {
      return [];
    } else {
      if (campaignObjectiveName !== 'showMessage') {
        return [];
      } else {
        if (template === 'INAPP') {
          return modifyButtonListInApp(buttons);
        } else {
          return modifyButtonListPush(buttons);
        }

      }
    }
  }

  const getVideoOrGif = (gifImageContent, videoContentUrl, gifImageContentUrl) => {
    return Object.keys(gifImageContent).length === 0
      ? videoContentUrl
      : gifImageContentUrl;
  }

  // const onTogglePreviewPush = (isShowSurvey: boolean): void => {
  //   toggleSurveyPreviewPush(isShowSurvey);
  // }

  // const onTogglePreviewInApp = (isShowSurvey: boolean): void => {
  //   toggleSurveyPreviewInApp(isShowSurvey);
  // }

  const toggleSurveyComponent = (isShow: boolean = false): void => {
    if (registration?.campaignType === 'PUSH') {
      toggleSurveyPreviewPush(isShow);
    } else if (registration?.campaignType === 'PUSH_INAPP') {
      toggleSurveyPreviewInApp(isShow);
    }
  }

  const getPush = (_template, _registration, _creative) => {
    const firstTemplate = _registration?.campaignType?.split('_')?.[0];
    return _registration?.campaignType === 'PUSH' || firstTemplate === 'PUSH' ?
      <Grid item xs={12} md={6} className="mt-15">
        {/* {(registration.campaignObjectiveName === 'surveyAd' && showSurveyPreviewPush && _registration?.campaignType === 'PUSH') && <ArrowBackIosIcon onClick={() => onTogglePreviewPush(false)} />} */}
        {!showSurveyPreviewPush && <MobilePreview
          height="710px"
          template={getFirstTemplate(_template.primaryTemplateType)}
          format={modifyFirstCampaignType(_registration.campaignType)}
          objectiveType={_registration.campaignObjectiveName}
          ctaText={_creative.ctaText}
          cpType={_registration.cpType}
          toggleSurveyComponent={toggleSurveyComponent}
          campaignType={_registration.campaignType}
          message={{
            title: _creative.subject,
            body: getFirstTemplate(_template.primaryTemplateType) === 'RICH-TEXT'
              ? _creative?.richNotificationMessageBody?.substring(0, 35) : _creative.message,
            text: _creative.richNotificationMessageBody,
            button: validateButtons(
              _registration.cpType,
              _registration.campaignObjectiveName,
              // false,
              _creative.buttons,
              _registration.campaignType,
              firstTemplate
            ),
            icon: _creative.notificationImageContent?.imageUrl,
            banner: _creative.richNotificationImageContent?.imageUrl
          }} />}
        {(registration.campaignObjectiveName === 'surveyAd' && showSurveyPreviewPush && _registration?.campaignType === 'PUSH') && <MobilePreview template={'SURVEY'}
          format={modifyFirstCampaignType(_registration.campaignType)}
          objectiveType={_registration.campaignObjectiveName}
          surveyData={_creative.selectedSurvey}
          questionDetails={_creative.surveyQuestionDetails}
          toggleSurveyComponent={toggleSurveyComponent}
          campaignType={_registration.campaignType}
          message={{
            title: '',
            body: '',
            text: '',
            button: [],
            icon: _creative.notificationImageContent?.imageUrl,
            banner: ''
          }} />}
        {/* {(registration.campaignObjectiveName === 'surveyAd' && !showSurveyPreviewPush && _registration?.campaignType === 'PUSH') && <ArrowForwardIosIcon onClick={() => onTogglePreviewPush(true)} />} */}
      </Grid>

      : <></>
  }

  const getInApp = (_template, _registration, _creative) => {
    const secondTemplate = _registration?.campaignType?.split('_')?.[1];
    return secondTemplate === 'INAPP' || _registration.campaignType === 'INAPP' ?

      <Grid item xs={12} md={6} className="mt-15">
        {/* {(registration.campaignObjectiveName === 'surveyAd') && <ArrowBackIosIcon onClick={() => onTogglePreviewInApp(false)} />} */}
        {!showSurveyPreviewInApp && <MobilePreview
          height="710px"
          template={getSecondTemplate((_template.primaryTemplateType))}
          format={modifySecondCampaignType(_registration.campaignType)}
          objectiveType={_registration.campaignObjectiveName}
          ctaText={_creative.ctaText}
          cpType={_registration.cpType}
          gifDuration={gifDuration}
          toggleSurveyComponent={toggleSurveyComponent}
          campaignType={_registration.campaignType}
          message={{
            title: _creative.subjectInApp,
            body: _creative.messageInApp,
            text: _creative.richNotificationMessageBody,
            button: validateButtons(
              _registration.cpType,
              _registration.campaignObjectiveName,
              // false,
              _creative.buttonsInApp,
              _registration.campaignType,
              secondTemplate
            ),
            icon: _creative.notificationImageContent?.imageUrl,
            video: _creative.videoContent?.videoFileUrl,
            banner: _registration.adTemplateType?.includes('FULL') ? _creative.fullImageContent?.imageUrl : _creative?.mainImageContent?.imageUrl
          }} />}
        {(registration.campaignObjectiveName === 'surveyAd' && showSurveyPreviewInApp) && <MobilePreview template={'SURVEY'}
          format={modifyFirstCampaignType(_registration.campaignType)}
          objectiveType={_registration.campaignObjectiveName}
          surveyData={_creative.selectedSurvey}
          questionDetails={_creative.surveyQuestionDetails}
          toggleSurveyComponent={toggleSurveyComponent}
          campaignType={_registration.campaignType}
          message={{
            title: '',
            body: '',
            text: '',
            button: [],
            icon: _creative.notificationImageContent?.imageUrl,
            banner: ''
          }} />}
        {/* {(registration.campaignObjectiveName === 'surveyAd' && !showSurveyPreviewInApp) && <ArrowForwardIosIcon onClick={() => onTogglePreviewInApp(true)} />} */}
      </Grid>

      : <></>
  }

  return (
    <>
      {
        getPush(template, registration, creative)
      }
      {
        getInApp(template, registration, creative)
      }
    </>
  );
};

export default memo(PreviewComponent);
