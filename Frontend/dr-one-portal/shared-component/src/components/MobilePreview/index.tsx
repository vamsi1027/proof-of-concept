import React, { useState, useEffect } from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import AppleIcon from "@material-ui/icons/Apple";
import AndroidOutlinedIcon from "@material-ui/icons/AndroidOutlined";
import * as S from "./mobilepreview.style";
import { PushStandardTemplate } from "./Templates/PushStandardTemplete";
import { PushRichTextTemplate } from "./Templates/PushRichTextTemplate";
import { PushRichImageTemplate } from "./Templates/PushRichImageTemplate";
import { PushCustomRichImageTemplate } from "./Templates/PushCustomRichImageTemplate";
import { InAppFullTemplate } from "./Templates/InAppFullTemplate";
import { InAppFullVideoTemplate } from "./Templates/InAppFullVideoTemplate";
import { InAppBannerTemplate } from "./Templates/InAppBannerTemplate";
import { InAppBannerVideoTemplate } from "./Templates/InAppBannerVideoTemplate";
import { InAppRatingTemplate } from "./Templates/InAppRatingTemplate";
import { InAppSliderTemplate } from "./Templates/InAppSliderTemplate";
import { InAppBottomTopBannerTemplate } from "./Templates/InAppBottomTopBannerTemplate";
import { SurveyTemplate } from "./Templates/SurveyTemplate";
import { MobilePreviewProps } from './MobilePreview.model'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const icons = { Android: <AndroidOutlinedIcon />, Iphone: <AppleIcon /> };

const MobilePreview = ({
  height,
  screen,
  format,
  template,
  message,
  objectiveType,
  ctaText,
  cpType,
  gifDuration,
  surveyData,
  questionDetails,
  questionNumber,
  width,
  toggleSurveyComponent,
  campaignType
}: MobilePreviewProps) => {
  const [mobileModel, setMobileModel] = useState(screen);
  const [questionIndex, setQuestionNumber] = useState(0);
  const [questionArray, setQuestionArray] = useState([]);

  function __Button({ icon, ...otherProps }) {
    return (
      <Button variant="outlined" startIcon={icons[icon]} {...otherProps} />
    );
  }

  useEffect(() => {
    if (questionDetails?.length !== 0) {
      const isSurveySubmittedPresent = questionDetails.findIndex(question => question.answerType === 'surveySubmitted');
      const isSurveyWelcomePresent = questionDetails.findIndex(question => question.answerType === 'surveyWelcome');
      if (isSurveySubmittedPresent < 0 && window.location.pathname.indexOf('survey') < 0) {
        questionDetails.push({
          id: '123',
          organizationId: '',
          createdAt: 0,
          updatedAt: 0,
          userId: '',
          units: '',
          question: '',
          answerType: 'surveySubmitted',
          answerSubType: '',
          answerOptions: []
        })
        if (isSurveyWelcomePresent < 0 && window.location.pathname.indexOf('survey') < 0 ) {
          questionDetails.unshift({
            id: '123',
            organizationId: '',
            createdAt: 0,
            updatedAt: 0,
            userId: '',
            units: '',
            question: '',
            answerType: 'surveyWelcome',
            answerSubType: '',
            answerOptions: []
          })
        }
        setQuestionArray(questionDetails);
      } else {
        setQuestionArray(questionDetails);
      }
    } else {
      setQuestionArray([]);
    }
  }, [questionDetails])

  const modifyQuestionNumber = (action: string): void => {
    if (action === 'showSurvey') {
      toggleSurveyComponent(true);
    } else if (action === 'hideSurvey') {
      toggleSurveyComponent(false);
    } else if (action === 'back') {
      setQuestionNumber(questionIndex => questionIndex - 1);
    } else {
      setQuestionNumber(questionIndex => questionIndex + 1);
    }
  }

  return (
    <S.Container
      className="mobile-preview"
      color="white"
      theme={
        mobileModel === "android"
          ? "url('/img/Android-Phone.svg')"
          : "url('/img/iOS-Phone.svg')"
      }
    // style={{ height: height }}
    >
      <div
        className={`${mobileModel === "android" ? "active-android" : "active-ios"
          } toggle-buttons`}
      >
        <ButtonGroup size="small" variant="outlined">
          <__Button
            icon={"Android"}
            onClick={() => setMobileModel("android")}
          />

          <__Button icon={"Iphone"} onClick={() => setMobileModel("iphone")} />
        </ButtonGroup>
      </div>
      <div className={template === 'SURVEY' ? "mobile-screen survey-mode" : (window.location.pathname.indexOf('campaign/manage') >= 0 && ((campaignType === 'PUSH' && format === 'PUSH') || (campaignType === 'PUSH_INAPP' && format === 'IN-APP')) &&
        objectiveType === 'surveyAd') ? 'campaign-analytics-survey mobile-screen' : 'mobile-screen'}>
        <div className="arrow-wrap">{template === 'SURVEY' && <div className={((questionDetails.length > 1 && questionIndex !== 0 && window.location.pathname.indexOf('campaign/manage') < 0) || (window.location.pathname.indexOf('campaign/manage') >= 0 && objectiveType === 'surveyAd')) ? 'arrow-mob' : 'arrow-mob hidden'}><ArrowBackIosIcon onClick={() => modifyQuestionNumber((window.location.pathname.indexOf('campaign/manage') >= 0 && questionIndex === 0 && objectiveType === 'surveyAd') ? 'hideSurvey' : 'back')} /></div>}</div>
        {
          {
            "PUSH_STANDARD": (
              <PushStandardTemplate message={message} format={format} objectiveType={objectiveType} ctaText={ctaText} />
            ),
            "PUSH_RICH-TEXT": (
              <PushRichTextTemplate message={message} template={template} objectiveType={objectiveType} ctaText={ctaText} />
            ),
            "PUSH_RICH-IMAGE": <PushRichImageTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} />,
            "PUSH_CUSTOM-RICH-IMAGE": (
              <PushCustomRichImageTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} />
            ),
            "IN-APP_FULL": <InAppFullTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} cpType={cpType} />,
            "IN-APP_FULL-VIDEO": <InAppFullVideoTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} gifDuration={gifDuration} cpType={cpType} />,
            "IN-APP_BANNER": <InAppBannerTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} cpType={cpType} />,
            "IN-APP_BANNER-VIDEO": (
              <InAppBannerVideoTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} gifDuration={gifDuration} cpType={cpType} />
            ),
            "IN-APP_RATING": <InAppRatingTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} cpType={cpType} />,
            "IN-APP_SLIDE": <InAppSliderTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} cpType={cpType} />,
            "IN-APP_BOTTOM-BANNER": (
              <InAppBottomTopBannerTemplate message={message} objectiveType={objectiveType} ctaText={ctaText} cpType={cpType} />
            ),
            "IN-APP_TOP-BANNER": (
              <InAppBottomTopBannerTemplate
                message={message}
                template={template}
                objectiveType={objectiveType}
                ctaText={ctaText}
                cpType={cpType}
              />
            ),
            "PUSH_SURVEY": (
              <SurveyTemplate surveyData={surveyData} questionDetails={questionArray} questionNumber={questionIndex} modifyQuestionNumber={modifyQuestionNumber}
                message={message} />
            )
          }[format + "_" + template]
        }
        <div className="arrow-wrap right">{(template === 'SURVEY' || (window.location.pathname.indexOf('campaign/manage') >= 0 && objectiveType === 'surveyAd' && ((campaignType === 'PUSH' && format === 'PUSH') || (campaignType === 'PUSH_INAPP' && format === 'IN-APP')))) && <div className={(questionDetails.length > 1 && (questionIndex !== (questionDetails.length - 1)) || (window.location.pathname.indexOf('campaign/manage') >= 0 && objectiveType === 'surveyAd' && template !== 'SURVEY')) ? 'arrow-mob' : 'hidden arrow-mob'}><ArrowForwardIosIcon onClick={() => modifyQuestionNumber((window.location.pathname.indexOf('campaign/manage') >= 0 && template !== 'SURVEY' && objectiveType === 'surveyAd') ? 'showSurvey' : 'forward')} /></div>}</div>
      </div>
      {(template === 'FULL-VIDEO' || template === 'BANNER-VIDEO') ? <p className="info-text"><img src="/img/info-icon.svg" alt="Information Icon" /> <span><strong className="boldText">Illustrative Image.</strong> May vary between different devices' screens.<br />Click play button for preview</span></p>
        : <p className="info-text"><img src="/img/info-icon.svg" alt="Information Icon" /> <span><strong className="boldText">Illustrative Image.</strong> May vary between different devices' screens.</span></p>}

    </S.Container>
  );
};

MobilePreview.defaultProps = {
  height: "70vh",
  screen: "android",
  format: "PUSH",
  template: "STANDARD",
  objectiveType: '',
  gifDuration: 0,
  cpType: '',
  message: {
    title: "title",
    body: "body",
    text: "text",
    icon: "https://s3-sa-east-1.amazonaws.com/iu-prod-claro/5a294f81993c8f1570c2550d/21052018/1526886904182/notification-3.jpg",
    banner: "https://s3-us-west-2.amazonaws.com/com.imaginationunwired.acadia/5a294f81993c8f1570c2550d/21122017/1513864557789/main-2.jpg",
    button: ["Ok", "Cancel"],
    video: "https://s3-us-west-2.amazonaws.com/com.imaginationunwired.acadia/5a294f81993c8f1570c2550d/12042018/1523536292628/movbbb.mp4"
  },
  surveyData: {},
  questionDetails: [],
  questionNumber: 0,
  width: 0
}
export default MobilePreview;
