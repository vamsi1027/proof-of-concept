import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import * as S from "./SurveyCreation.style";

import SurveyStepper from "../SurveyStepper/SurveyStepper";
import SurveyForm from "./SurveyForm";
import { GlobalContext } from '../../../../context/globalState';
import WrapperQuestionForm from '../../../../components/Common/QuestionForm/WrapperQuestionForm';
import SurveyWelcomePage from './SurveyWelcomePage';
import SurveyLastPage from './SurveyLastPage';

export default function SurveyCreation() {
    const { state } = useContext(GlobalContext);

    return (
        <S.Container>
            <SurveyStepper />
            {state.currentSurveySection === "registration" && <SurveyForm />}
            {state.currentSurveySection === "surveywelcomepage" && <SurveyWelcomePage />}
            {state.currentSurveySection === "question" && <WrapperQuestionForm />}
            {state.currentSurveySection === "surveylastpage" && <SurveyLastPage />}
        </S.Container>
    );
}
