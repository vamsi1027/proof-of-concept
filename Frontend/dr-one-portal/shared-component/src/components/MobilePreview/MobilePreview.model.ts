type Notification_MessageProps = {
    title?: string;
    body?: string;
    text?: string;
    icon?: string;
    banner?: string;
    button?: Array<string>;
    video?: string;
};

type SurveyFinalButtonProps = {
    label?: string;
    link?: string;
}

type SurveyProps = {
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

type QuestionProps = {
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

export type MobilePreviewProps = {
    height?: string;
    screen?: string;
    format?: string;
    secondFormat?: string;
    template?: string;
    secondTemplate?: string,
    message?: Notification_MessageProps;
    objectiveType?: string;
    ctaText?: string;
    cpType?: string;
    gifDuration?: number;
    surveyData?: SurveyProps;
    questionDetails?: Array<QuestionProps>;
    questionNumber?: number
    modifyQuestionNumber?: any;
    width?: number;
    toggleSurveyComponent?: any;
    campaignType?: string;
};
