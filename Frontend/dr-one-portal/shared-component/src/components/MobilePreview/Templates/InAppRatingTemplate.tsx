import { Tooltip } from "@material-ui/core";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import { MobilePreviewProps } from '../MobilePreview.model'
import Rating from "@material-ui/lab/Rating";
import CloseIcon from '@material-ui/icons/Close';

export function InAppRatingTemplate(props: MobilePreviewProps) {
    return (
        <div className="pr-wrapper-templete inApp-template">
            <div className="pr-close-wrapper"><CloseIcon /></div>
            <Rating name="size-medium" defaultValue={4} />
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