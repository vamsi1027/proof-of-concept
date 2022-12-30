import { Tooltip } from "@material-ui/core";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import { MobilePreviewProps } from '../MobilePreview.model';
import CloseIcon from '@material-ui/icons/Close';

export function InAppBannerTemplate(props: MobilePreviewProps) {
  return (
    <div className={props.cpType === 'ENGAGEMENT' ? 'pr-wrapper-templete inApp-template Popup-banner engagement-popup-banner'
  : 'pr-wrapper-templete inApp-template Popup-banner'}>
     <div className="popup-banner-video-inner">
     <div className="pr-close-wrapper"><CloseIcon /></div>
      <div className="banner-video">
      <div className="inapp-full-img-wrapper">
        {props.message.banner && (
          <img src={props.message.banner} alt="InAppBannerTemplate" />
        )}
      </div>
     
      <p className="inapp-full-text"><b>{props.message.title}</b></p>
      <p className="inapp-full-text">{props.message.body}</p>
      </div>
      
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
      
    </div>
  );
}