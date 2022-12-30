import { Tooltip } from "@material-ui/core";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { MobilePreviewProps } from '../MobilePreview.model';
import SettingsIcon from '@material-ui/icons/Settings';

export function PushCustomRichImageTemplate(props: MobilePreviewProps) {
  return (
    <div className="pr-wrapper-templete custom-rich-templete">
      <div className="white-screen">
        <div className="ws-left-section">
          <h5>{props.message.title}</h5>
          <p className="inapp-full-text">{props.message.body}</p>
        </div>
        <div className="ws-right-section">
          {props.message.icon && (
            <img
              src={props.message.icon}
              alt={props.message.title}
              className="icon-image"
            />
          )}
        </div>
        <p className="inapp-full-text">{props.message.text}</p>
      </div>
      <div>
        {props.message.banner && (
          <img
            src={props.message.banner}
            alt={props.message.title}
            className="banner-image"
          />
        )}
      </div>
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