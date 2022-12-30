import React from "react";
import {
    Button,
    MobileStepper,
    useTheme,
    Tooltip
} from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import { MobilePreviewProps } from '../MobilePreview.model';

const SliderImage = [
    {
        sliderImage:
            "https://s3-us-west-2.amazonaws.com/com.imaginationunwired.acadia/5a294f81993c8f1570c2550d/27052020/1590593193833/1590593186395_starbuckssplash.png",
    },
    {
        sliderImage:
            "https://s3-us-west-2.amazonaws.com/com.imaginationunwired.acadia/5a294f81993c8f1570c2550d/14062018/1528983993350/96x96-MariaCardoso.png",
    },
    {
        sliderImage:
            "https://s3-us-west-2.amazonaws.com/com.imaginationunwired.acadia/5a294f81993c8f1570c2550d/27052020/1590593193833/1590593186395_starbuckssplash.png",
    },
];

export function InAppSliderTemplate(props: MobilePreviewProps) {
    const sliderSize = SliderImage.length;
    const theme = useTheme();
    const [index, setActiveStep] = React.useState(0);

    return (
        <div className="pr-wrapper-templete slider-template inApp-template">
            <div className="pr-close-wrapper"><CloseIcon /></div>
            <div className="slide-templete">
                <img
                    src={SliderImage[index].sliderImage}
                    alt={SliderImage[index].sliderImage}
                />
                <MobileStepper
                    variant="dots"
                    activeStep={index}
                    position="static"
                    backButton={
                        <Button
                            size="small"
                            onClick={() =>
                                setActiveStep((prevActiveStep) => prevActiveStep - 1)
                            }
                            disabled={index === 0}
                        >
                            {theme.direction !== "rtl" ? (
                                <KeyboardArrowLeft />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                            BACK
                        </Button>
                    }
                    steps={sliderSize}
                    nextButton={
                        <Button
                            size="small"
                            onClick={() =>
                                setActiveStep((prevActiveStep) => prevActiveStep + 1)
                            }
                            disabled={index === sliderSize - 1}
                        >
                            Next
                            {theme.direction !== "rtl" ? (
                                <KeyboardArrowRight />
                            ) : (
                                <KeyboardArrowLeft />
                            )}
                        </Button>
                    }
                />
            </div>
            <p className="inapp-full-text">{props.message.title}</p>
            <p className="inapp-full-text">{props.message.body}</p>
            {(props.message.button.length !== 0 && props.message.button.some(ele => ele.length !== 0)) && <div className="standard-button">
                {props.message.button.map((button, index) => (
                    <button key={index}>{button}</button>
                ))}
            </div>}
            <div className="mobile-preview-bottom">
                {props.objectiveType !== 'showMessage' &&
                    <p>{props.ctaText}</p>}
                <Tooltip title="Option for Opt-Out">
                    <SettingsIcon />
                </Tooltip>
            </div>
        </div>
    );
}