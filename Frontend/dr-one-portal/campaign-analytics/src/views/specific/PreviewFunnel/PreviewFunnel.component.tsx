import Funnel from "./Funnel/Funnel.component";
import Preview from "./Preview/Preview.component";
import React, { useContext } from "react";
import { ContextSpecific } from '../context/context-specific';
import { Grid } from '@material-ui/core';
import { v1 } from "uuid";
import { useTranslation } from 'react-i18next';

import {
  MobilePreviewCreative,
  MobilePreviewFullImageContent,
  MobilePreviewMainImageContent,
  MobilePreviewNotificationImageContent,
  MobilePreviewProps,
  MobilePreviewRegistration,
  MobilePreviewRichNotificationImageContent,
  MobilePreviewTemplate,
  MobilePreviewVideoContent,
  MobilePreviewSurvey,
  MobilePreviewQuestions,
  SurveyFinalButtonProps
} from './funnel-types'
import HorizontalColumnsSpecific from "./HorizontalColumnsSpecific/HorizontalColumnsSpecific";

const PreviewFunnelComponent: React.FunctionComponent = () => {
  const { data } = useContext(ContextSpecific);
  const { t } = useTranslation();

  const template: MobilePreviewTemplate = {
    primaryTemplateType: ''
  }

  const registration: MobilePreviewRegistration = {
    campaignObjectiveName: '',
    campaignType: '',
    cpType: '',
    adTemplateType: ''
  }

  const notificationImageContent: MobilePreviewNotificationImageContent = {
    imageUrl: ''
  }

  const richNotificationImageContent: MobilePreviewRichNotificationImageContent = {
    imageUrl: ''
  }

  const videoContent: MobilePreviewVideoContent = {
    videoFileUrl: '',
    externalVideoUrl: ''
  }

  const fullImageContent: MobilePreviewFullImageContent = {
    imageUrl: ''
  }

  const mainImageContent: MobilePreviewMainImageContent = {
    imageUrl: ''
  }

  const finalButton: SurveyFinalButtonProps = {
    label: '',
    link: ''
  }

  const selectedSurvey: MobilePreviewSurvey = {
    id: '',
    bgImageUrl: '',
    createdAt: 0,
    description: '',
    organizationId: '',
    questions: [],
    status: '',
    termsAndConditions: '',
    title: '',
    updatedAt: 0,
    userId: '',
    welcomeTitle: '',
    startButton: '',
    welcomeBannerUrl: '',
    finalTitle: '',
    finalDescription: '',
    section: '',
    finalBannerUrl: '',
    finalButton: finalButton
  }

  const surveyQuestion: MobilePreviewQuestions = {
    id: '',
    organizationId: '',
    createdAt: 0,
    updatedAt: 0,
    userId: '',
    units: '',
    question: '',
    answerType: '',
    answerSubType: '',
    answerOptions: []
  }

  const surveyQuestionDetails: Array<MobilePreviewQuestions> = [];

  const creative: MobilePreviewCreative = {
    ctaText: '',
    subject: '',
    message: '',
    subjectInApp: '',
    messageInApp: '',
    richNotificationMessageBody: '',
    notificationImageContent: notificationImageContent,
    richNotificationImageContent: richNotificationImageContent,
    buttons: [],
    buttonsInApp: [],
    videoContent: videoContent,
    fullImageContent: fullImageContent,
    mainImageContent: mainImageContent,
    selectedSurvey: selectedSurvey,
    surveyQuestionDetails: surveyQuestionDetails
  }

  const mobilePreview: MobilePreviewProps = {
    template: template,
    registration: registration,
    creative: creative
  };

  mobilePreview.template.primaryTemplateType = data.adTemplateType;
  mobilePreview.registration.cpType = data.purposeType;
  mobilePreview.registration.campaignType = data.campaignType;
  mobilePreview.registration.adTemplateType = data.adTemplateType;
  mobilePreview.registration.campaignObjectiveName = data.campaignObjective?.fields[0] === 'displayOnlyAd' ? 'showMessage' : data.campaignObjective?.fields[0];
  if (data.campaignObjective?.fields[0] !== 'displayOnlyAd') {
    mobilePreview.creative.ctaText = data.notification?.adActionText || '';
  }
  mobilePreview.creative.subject = data.notification?.subject;
  mobilePreview.creative.message = data.notification?.message;
  mobilePreview.creative.richNotificationMessageBody = data.notification?.richNotificationMessageBody;
  mobilePreview.creative.notificationImageContent.imageUrl = data.notificationImageContent?.imageUrl;
  mobilePreview.creative.richNotificationImageContent.imageUrl = data.notification?.richNotificationLargeImageContent?.imageUrl;
  mobilePreview.creative.buttons = data.notification?.buttons;
  mobilePreview.creative.videoContent.videoFileUrl = data.videoContent?.videoFileUrl ? data.videoContent?.videoFileUrl : data.videoContent?.externalVideoUrl;
  mobilePreview.creative.fullImageContent.imageUrl = data.fullImageContent?.imageUrl;
  mobilePreview.creative.mainImageContent.imageUrl = data.mainImageContent?.imageUrl;

  mobilePreview.creative.selectedSurvey = data.survey ? data.survey : {};

  mobilePreview.creative.selectedSurvey['finalBannerUrl'] = (data?.survey && data?.survey?.finalBannerImageContent) ? data?.survey?.finalBannerImageContent?.imageUrl : '';
  mobilePreview.creative.selectedSurvey['welcomeBannerUrl'] = (data?.survey && data?.survey?.welcomeBannerImageContent) ? data?.survey?.welcomeBannerImageContent?.imageUrl : '';

  if (data.survey && data.survey?.questions) {
    data.survey.questions.forEach((question, index) => {
      if (question.answerType === 'DROPDOWN' || question.answerType === 'CHECKBOX' || question.answerType === 'RADIOBUTTON') {
        if (question.other?.enabled) {
          const otherOptionPresent = data.survey.questions[index].answerOptions.findIndex(option => option === data.survey?.questions[index].other?.label);
          if (otherOptionPresent < 0) {
            data.survey.questions[index].answerOptions.push(data.survey?.questions[index].other?.label);
          }
        }
        if (question.noneOfTheAbove?.enabled) {
          const noneOfTheAboveOptionPresent = data.survey.questions[index].answerOptions.findIndex(option => option === data.survey?.questions[index].noneOfTheAbove?.label);
          if (noneOfTheAboveOptionPresent < 0) {
            data.survey.questions[index].answerOptions.push(data.survey?.questions[index].noneOfTheAbove?.label);
          }
        }
        if (question.answerType === 'DROPDOWN') {
          const dropDownDefualtOptionPresent = data.survey.questions[index].answerOptions.findIndex(option => option === t('SURVEY_QUESTION_TYPE_DROPDOWN_DEFAULT_OPTION'));
          if (dropDownDefualtOptionPresent < 0) {
            data.survey.questions[index].answerOptions.unshift(t('SURVEY_QUESTION_TYPE_DROPDOWN_DEFAULT_OPTION'));
          }
        }
      }
    })
    mobilePreview.creative.surveyQuestionDetails = data.survey.questions;
  } else {
    mobilePreview.creative.surveyQuestionDetails = [];
  }

  if (data.purposeType === 'ENGAGEMENT' && data.campaignType !== 'PUSH') {
    let texts = data.engagement.in_app_content.filter(el => el.type === 'text');
    let button = data.engagement.in_app_content.filter(el => el.type === 'button');
    mobilePreview.creative.buttonsInApp = button;
    mobilePreview.creative.subjectInApp = texts.length > 0 ? texts[0].text : '';
    mobilePreview.creative.messageInApp = texts.length > 1 ? texts[1].text : '';
    mobilePreview.creative.ctaText = button.length !== 0 ? button[0].text : '';
  }

  return (
    <>
      <Grid container className={(data.enableSurvey && data.campaignmeterics) ? 'survey-wrapper' : ''}>
        <div className="row">
          {
            data.campaignType === 'PUSH_INAPP' && <HorizontalColumnsSpecific type={data.campaignType} />
          }
        </div>
      </Grid>
      <Grid container>
        <div className="row">
          <Preview {...mobilePreview} />
          {
            data.campaignType !== 'PUSH_INAPP' ? <Funnel /> : <></>
          }
        </div>
      </Grid>
    </>
  );
};

export default React.memo(PreviewFunnelComponent);
