import { Tooltip } from "@material-ui/core";
import React from 'react';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { MobilePreviewProps } from '../MobilePreview.model';
import TelegramIcon from '@material-ui/icons/Telegram';

export function PushRichTextTemplate(props: MobilePreviewProps) {
  return (
    <React.Fragment>
      <div className="mobile-notification-screen">
        {/* <div className="white-screen">
          <div className="white-screen-content-notification">
            <div className="ws-left-section">
              <h4 className="app-name"><TelegramIcon /> Application Name</h4>
              <h5>{props.message.title}</h5>
              <p>{props.message.body}</p>
            </div>
            <div className="ws-right-section">
              {props.message.icon && (
                <img src={props.message.icon} alt={props.message.title} className="icon-image" />
              )}
            </div>
          </div>
        </div> */}

        <div className="white-screen rich-text">
          <div className="white-screen-content-notification">
            <div className="ws-left-section">
              <h4 className="app-name"><TelegramIcon /> Application Name</h4>
              <h5>{props.message.title}</h5>
              {/* <p>{props.message.body}</p> */}
              <p>{props.message.text}</p>
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
          </div>

          

          {(props.message.button.length !== 0 && props.message.button.some(ele => ele.length !== 0)) && <div className="standard-button horizontal-alignment">
            {props.message.button.map((button, index) => (
              <button key={index} color="primary">{button}</button>
            ))}
          </div>}
          <div className="mobile-preview-bottom">
            {props.objectiveType !== 'showMessage' &&
              <p>{props.ctaText}</p>}
            {/* <Tooltip title="Option for Opt-Out">
              <SettingsOutlinedIcon />
            </Tooltip> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
