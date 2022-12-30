import { MobilePreviewProps } from '../MobilePreview.model';
import { Select, MenuItem, Button, Slider } from "@material-ui/core";
import Spinner from '../../Spinner/index';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// import SendIcon from '@material-ui/icons/Send';

export function SurveyTemplate(props: MobilePreviewProps) {
    const questionArrayMap = window.location.pathname.indexOf('survey') < 0 ? props?.questionDetails?.slice(0, -2) : props?.questionDetails;
    const questionIndex = window.location.pathname.indexOf('survey') < 0 ? props.questionNumber - 1 : props.questionNumber;

    const applyClass = () => {
        if (window.location.pathname.indexOf('survey') > -1) {
            if (props.surveyData.section === 'surveywelcomepage') {
                return 'inapp-full-text-desc align-left';
            } else {
                return 'inapp-full-text-desc';
            }
        } else {
            if (props.questionNumber === 0) {
                return 'inapp-full-text-desc align-left';
            } else {
                return 'inapp-full-text-desc';
            }
        }
    }

    const setScrollClass = () => {
        if (window.location.pathname.indexOf('survey') > -1) {
            if (props.surveyData.section === 'surveywelcomepage') {
                if (props.surveyData.welcomeBannerUrl?.length === 0) {
                    return { overflow: 'hidden' };
                } else {
                    return { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 80}px)` }
                }
            } else if (props.surveyData.section === 'surveylastpage') {
                if (props.surveyData.finalBannerUrl?.length === 0) {
                    return { overflow: 'hidden' };
                } else {
                    return { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 80}px)` }
                }
            } else if (props.surveyData.section === 'question') {
                return { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 80}px)` }
            }
        } else {
            if (props.questionNumber == 0) {
                if (props.surveyData.welcomeBannerUrl?.length === 0) {
                    return { overflow: 'hidden' };
                } else {
                    return { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 150}px)` }
                }
            } else if (props.questionNumber == props.questionDetails.length - 1) {
                if (props.surveyData.finalBannerUrl?.length === 0) {
                    return { overflow: 'hidden' };
                } else {
                    return { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 150}px)` }
                }
            } else {
                return { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 150}px)` }
            }
        }
    }

    return (
        <div className="q-survey-box">
            <div className="pr-wrapper-templete inApp-template survey-template">
                {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'question') || (window.location.pathname.indexOf('survey') < 0 && (props.questionNumber !== 0 && (props.questionNumber !== (props.questionDetails.length - 1))))) && <ArrowBackIosIcon className="back-arrow" />}
                {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'question') || (window.location.pathname.indexOf('survey') < 0 && (props.questionNumber !== 0 && (props.questionNumber !== (props.questionDetails.length - 1))))) && <div className="q-indicator-wrap">{questionArrayMap?.map((question, index) => (<div style={{ width: `${(100 / (props.questionDetails.length))}%` }} key={index} className={index <= questionIndex ? 'q-indicator highlight' : 'q-indicator'}></div>))}</div>}
                <div className="pr-close-wrapper"><CloseIcon /></div>
                {(window.location.pathname.indexOf('survey') < 0 && props?.message?.icon) && <img src={props?.message?.icon} alt="notificaton_img" className="notification-image-icon" />}
                {(Object.keys(props?.surveyData)?.length === 0 || props?.questionDetails?.length === 0) && <Spinner color={"blue"} />}
                {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'surveywelcomepage') || (window.location.pathname.indexOf('survey') < 0 && props.questionNumber === 0)) && <h4 className="inapp-full-text-heading welcome-text" id="survey-header">{props?.surveyData?.welcomeTitle}</h4>}
                {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'surveylastpage') || (window.location.pathname.indexOf('survey') < 0 && (props.questionNumber === (props?.questionDetails?.length - 1)))) && <h4 className="inapp-full-text-heading welcome-text" id="survey-header">{props?.surveyData?.finalTitle}</h4>}
                {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'question') || (props.questionNumber !== 0 && (props.questionNumber !== (props.questionDetails.length - 1)))) && <h4 className="inapp-full-text-heading welcome-text" id="survey-header">{props?.surveyData?.title}</h4>}
                {/* style={(props.questionNumber === (props?.questionDetails?.length - 1)) ? { overflow: 'hidden' } : { height: `calc(100% - ${document.getElementById('survey-header')?.clientHeight + 45}px)` }} */}
                <div className="scroll-section" style={setScrollClass()}>
                    {((window.location.pathname.indexOf('survey') > -1 && (props.surveyData.section === 'question' || props.surveyData.section === 'surveywelcomepage')) || (window.location.pathname.indexOf('survey') < 0 && props.questionNumber !== (props.questionDetails.length - 1))) && <h6 className={applyClass()}>{props?.surveyData.description}</h6>}
                    {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'surveylastpage') || (window.location.pathname.indexOf('survey') < 0 && props.questionNumber === (props.questionDetails.length - 1))) && <h6 className="inapp-full-text-desc align-left">{props?.surveyData.finalDescription}</h6>}
                    {
                        props?.questionDetails?.map((question, index) => (
                            <div className={index === props.questionNumber ? "questions active" : 'questions'} key={index}>
                                {(question.answerType === 'SLIDER' && index === props.questionNumber) && <div className="qs-row" >
                                    <label className="qus-text">{window.location.pathname.indexOf('survey') < 0 ? index : index + 1}. {question.question}</label>
                                    <p className="slider-count align-text-center">Selected Value: {question.answerOptions[0]} {question.units !== null ? question.units : ''}</p>
                                    <Slider className="range-input" min={Number(question.answerOptions[0])} max={Number(question.answerOptions[1])} defaultValue={Number(question.answerOptions[0])} />
                                    <div className="flex-space-between">
                                        <p className="slider-count ">{question.answerOptions[0]} {question.units !== null ? question.units : ''}</p>
                                        <p className="slider-count">{question.answerOptions[1]} {question.units !== null ? question.units : ''}</p>
                                    </div>
                                </div>}
                                {(question.answerType === 'FREETEXT' && index === props.questionNumber) && <div className="qs-row">
                                    <label className="qus-text">{window.location.pathname.indexOf('survey') < 0 ? index : index + 1}. {question.question}</label>
                                    <textarea value={question.answerOptions !== null && question.answerOptions.length === 2 ? question.answerOptions[1] : ''}
                                        className="form-control text-area"></textarea>
                                    <div className="information-text"> 140 <span >characters allowed</span></div>
                                </div>}
                                {(question.answerType === 'RADIOBUTTON' && index === props.questionNumber) && <div className="qs-row" >
                                    <label className="qus-text">{window.location.pathname.indexOf('survey') < 0 ? index : index + 1}. {question.question}</label>
                                    <div className="radio-container" >
                                        {
                                            question?.answerOptions?.map((option, i) => (
                                                <label key={i}>
                                                    <input type="radio" value={option}></input> {option}
                                                    <span className="checkmark"></span>
                                                </label>
                                            ))}
                                    </div>
                                </div>}
                                {(question.answerType === 'CHECKBOX' && index === props.questionNumber) && <div className="qs-row" >
                                    <label className="qus-text">{window.location.pathname.indexOf('survey') < 0 ? index : index + 1}. {question.question}</label>
                                    <div className="checkbox-container" >
                                        {
                                            question?.answerOptions?.map((option, i) => (
                                                <label key={i}>
                                                    <input type="checkbox" value={option}></input> {option}
                                                    <span className="checkmark"></span>
                                                </label>
                                            ))}
                                    </div>
                                </div>}
                                {(question.answerType === 'DROPDOWN' && index === props.questionNumber) && <div className="qs-row drop-field">
                                    <label className="qus-text">{window.location.pathname.indexOf('survey') < 0 ? index : index + 1}. {question.question}</label>
                                    <Select
                                        name="dropdown"
                                        value={question.answerOptions[0]}
                                        label="dropdown">
                                        {
                                            question?.answerOptions?.map((option: any, i) => (
                                                <MenuItem key={i} value={option}>{option}</MenuItem>
                                            ))}
                                    </Select>
                                </div>}
                                {(question.answerType === 'surveyWelcome') && <div className={props.surveyData.welcomeBannerUrl?.length === 0 ? "survey-complete remove-height" : "survey-complete"}>
                                    {(props.surveyData.welcomeBannerUrl && props.surveyData.welcomeBannerUrl.length !== 0) && <img src={props.surveyData.welcomeBannerUrl} alt="welcome_image" />}
                                </div>}
                                {(question.answerType === 'surveySubmitted') && <div className={props.surveyData.finalBannerUrl?.length === 0 ? "survey-complete remove-height" : "survey-complete"}>
                                    {(props.surveyData.finalBannerUrl && props.surveyData.finalBannerUrl.length !== 0) && <img src={props.surveyData.finalBannerUrl} alt="welcome_image" />}
                                </div>}
                            </div >
                        ))
                    }
                    {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'surveywelcomepage') || (window.location.pathname.indexOf('survey') < 0 && (props.questionNumber === 0))) && <div className="btn-mob-bottom survey-btm-btns">
                        <Button className={window.location.pathname.indexOf('survey') > -1 ? "welcome-button submit" : 'submit'} variant="outlined" color="primary" type="button" onClick={() => props.modifyQuestionNumber('forward')}>{props.surveyData.startButton}</Button>
                    </div>}
                    {(((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'surveylastpage') || (window.location.pathname.indexOf('survey') < 0 && (props.questionNumber === (props?.questionDetails.length - 1)))) &&
                       props.surveyData.finalButton && props.surveyData.finalButton?.link?.length !== 0) && <div className="btn-mob-bottom survey-btm-btns">
                            <Button className="submit" variant="outlined" color="primary" type="button">{props.surveyData.finalButton?.label}</Button>
                        </div>}
                    {(props?.questionDetails.length > 1 && ((props.questionNumber !== (props?.questionDetails.length - 1)) &&
                        ((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'question') ||
                            (window.location.pathname.indexOf('survey') < 0 && props.questionNumber !== 0 && props.questionNumber !== props.questionDetails.length - 2)))) && <div className="btn-mob-bottom survey-btm-btns">
                            <Button className="submit" variant="outlined" color="primary" type="button" onClick={() => props.modifyQuestionNumber('forward')}>Next Question</Button>
                        </div>}

                    {((window.location.pathname.indexOf('survey') < 0 && props.questionNumber < props?.questionDetails?.length - 1) || (window.location.pathname.indexOf('survey') > -1 && props.surveyData.section !== 'surveylastpage')) && <div className="btn-mob-bottom survey-btm-btns terms">
                        {((window.location.pathname.indexOf('survey') > -1 && props.surveyData.section === 'question' && props.questionNumber === props.questionDetails.length - 1) || (window.location.pathname.indexOf('survey') < 0 && props.questionNumber === props.questionDetails.length - 2)) && <Button className={window.location.pathname.indexOf('survey') > -1 ? "welcome-button submit" : 'submit'} variant="outlined" color="primary" type="button" onClick={() => props.modifyQuestionNumber('forward')}>Submit</Button>}
                        {(props?.surveyData?.termsAndConditions && props?.surveyData?.termsAndConditions?.length !== 0) && <div className="terms-condition"><input type="checkbox" value='tc' checked={props?.surveyData?.termsAndConditions && props?.surveyData?.termsAndConditions?.length !== 0 ? true : false} /> <p>I agree to the <Link to="#">T&C</Link> and <Link to="#">Privacy Policy</Link></p></div>}

                    </div>}
                </div>
            </div >
        </div >
    );
}