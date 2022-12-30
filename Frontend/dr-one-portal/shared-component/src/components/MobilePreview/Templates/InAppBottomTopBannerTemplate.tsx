import { Tooltip } from "@material-ui/core";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import { MobilePreviewProps } from '../MobilePreview.model';
import CloseIcon from '@material-ui/icons/Close';


export function InAppBottomTopBannerTemplate(props: MobilePreviewProps) {
    return (
        <div
            className={`${props.template === "TOP-BANNER" ? "top-banner" : "bottom-banner"
                } pr-wrapper-templete inApp-template ${props.cpType === 'ENGAGEMENT' ? 'engagement-top-bottom' : ''}`}>
           <div className="bottom-top-banner-inner">
           <div className="pr-close-wrapper"> <CloseIcon /></div>
            <div className="bottom-banner-image">
                {props.message.banner && (
                    <img src={props.message.banner} />
                )}
            </div>
            <p className="inapp-full-text">{props.message.title}</p>
            <p className="inapp-full-text">{props.message.body}</p>
            <div className="mobile-preview-bottom">
                {props.objectiveType !== 'showMessage' &&
                    <p>{props.ctaText}</p>}
                {/* <Tooltip title="Option for Opt-Out">
                    <SettingsOutlinedIcon />
                </Tooltip> */}
            </div>
           </div>
        </div>
    );
}