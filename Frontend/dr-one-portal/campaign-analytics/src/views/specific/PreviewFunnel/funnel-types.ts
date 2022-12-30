export type MobilePreviewTemplate = {
  primaryTemplateType: string
}

export type MobilePreviewRegistration = {
  campaignType: string;
  cpType: string;
  campaignObjectiveName: string;
  adTemplateType: string;
}

export type MobilePreviewNotificationImageContent = {
  imageUrl?: string;
}
export type MobilePreviewRichNotificationImageContent = {
  imageUrl?: string;
}

export type MobilePreviewVideoContent = {
  videoFileUrl?: string;
  externalVideoUrl?: string;
}

export type MobilePreviewFullImageContent = {
  imageUrl?: string;
}

export type MobilePreviewMainImageContent = {
  imageUrl?: string
}

export type MobilePreviewSurvey = {
  id?: string;
  bgImageUrl?: string;
  createdAt?: number;
  description: string;
  organizationId: string;
  questions?: Array<string>;
  status: string;
  termsAndConditions?: string;
  title: string;
  updatedAt?: number;
  userId?: string;
  welcomeTitle?: string;
  startButton?: string;
  welcomeBannerUrl?: string;
  finalTitle?: string;
  finalDescription?: string;
  section?: string;
  finalBannerUrl?: string;
  finalButton?: SurveyFinalButtonProps;
}

export type MobilePreviewQuestions = {
  id?: string;
  organizationId: string;
  createdAt?: number;
  updatedAt?: number;
  userId?: string;
  units?: string;
  question: string;
  answerType: string;
  answerSubType: string;
  answerOptions: Array<any>;
}

export type MobilePreviewCreative = {
  ctaText: string;
  subject: string;
  message: string;
  subjectInApp: string,
  messageInApp: string,
  richNotificationMessageBody: string;
  notificationImageContent: MobilePreviewNotificationImageContent | null;
  richNotificationImageContent: MobilePreviewRichNotificationImageContent | null;
  buttons: [];
  buttonsInApp: [],
  videoContent?: MobilePreviewVideoContent;
  fullImageContent?: MobilePreviewFullImageContent;
  mainImageContent?: MobilePreviewMainImageContent;
  selectedSurvey: MobilePreviewSurvey;
  surveyQuestionDetails: Array<MobilePreviewQuestions>;
}

export type MobilePreviewProps = {
  template: MobilePreviewTemplate | null;
  registration: MobilePreviewRegistration | null;
  creative: MobilePreviewCreative | null
}

export type SurveyFinalButtonProps = {
  label?: string;
  link?: string;
}