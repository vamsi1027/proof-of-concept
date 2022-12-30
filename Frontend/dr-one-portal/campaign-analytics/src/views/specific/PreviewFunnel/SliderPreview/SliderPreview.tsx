import React, { useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import * as S from "./SliderPreview.style";
import { ContextCampaignType } from "../../context/context-campaign-type";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justify: "end"
  }
});

const MobilePreviewStepper = ({ previewPush, previewInApp, types }) => {
  const { campaignTypeValue } = useContext(ContextCampaignType);

  const classes = useStyles();
  const theme = useTheme();

  const steps = [previewPush, previewInApp];
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    campaignTypeValue.changeCampaignType(types[1]);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    campaignTypeValue.changeCampaignType(types[0]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (

    <S.Container>
      {steps[activeStep]}
      <MobileStepper
        variant="dots"
        steps={2}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === 1 || types[0] === undefined}
            className="button-next-step"
          >
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }

        backButton={
          <Button
            size="small" onClick={handleBack}
            disabled={activeStep === 0}
          >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </S.Container>
  );
}

export default MobilePreviewStepper;
