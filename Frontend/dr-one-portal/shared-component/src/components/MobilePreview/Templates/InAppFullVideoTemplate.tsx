import { useState, useRef, useEffect } from "react";
import { Tooltip } from "@material-ui/core";
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import SettingsIcon from '@material-ui/icons/Settings';
import { MobilePreviewProps } from '../MobilePreview.model';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import Spinner from '../../Spinner';

export function InAppFullVideoTemplate(props: MobilePreviewProps) {
  const playerRef = useRef(null);
  const [isSelectedVideoPlaying, toggleSelectedVideoPlaying] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const [isGifPlaying, toggleGifPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (props.gifDuration !== 0 && imageLoaded && isGifPlaying) {
      setTimeout(() => {
        toggleGifPlaying(false);
      }, (props.gifDuration * 1000));
    }
  }, [props, imageLoaded, isGifPlaying]);

  const playAndPause = (): void => {
    const videoPlayer = playerRef.current;
    if (!videoPlayer.paused) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  }

  const videoEnded = (): void => {
    setVideoCanPlay(false);
    toggleSelectedVideoPlaying(false);
  }

  const isVideoLoaded = (): void => {
    if (videoCanPlay !== true) {
      setVideoCanPlay(true);
    }
  }

  const playSelectedVideo = (): void => {
    if (isSelectedVideoPlaying !== true) {
      toggleSelectedVideoPlaying(true);
      setTimeout(() => {
        if (playerRef) {
          playerRef.current.play();
        }
      }, 100);
    }
  }

  const toggleGifImage = (): void => {
    toggleGifPlaying(true);
    toggleSelectedVideoPlaying(false);
  }

  return (
    <div className={props.cpType === 'ENGAGEMENT' ? 'pr-wrapper-templete inApp-template full-video-template engagement-full-video'
      : 'pr-wrapper-templete inApp-template full-video-template mon-full-video'}>
      <div className="pr-close-wrapper"><CloseIcon /></div>
      <div className="banner-video">
        <div className="inapp-full-img-wrapper" style={{
          display: ((props.message?.video?.split('.').pop() !== 'gif' && isSelectedVideoPlaying) ||
            (props.message?.video?.split('.').pop() === 'gif' && isGifPlaying)) ? 'none' : 'block'
        }}>
          {(props.message.banner && ((props.message?.video?.split('.').pop() !== 'gif' && !isSelectedVideoPlaying)
            || (props.message?.video?.split('.').pop() === 'gif' && !isGifPlaying))) && (
              <img
                src={props.message.banner}
                alt={props.message.body}
                className="banner-image"
              />
            )}
        </div>
        <div className="inapp-full-video-wrapper">
          {(isSelectedVideoPlaying && !videoCanPlay && props.message?.video?.split('.').pop() !== 'gif') && <Spinner color={"blue"} />}
          {(props.message?.video && isGifPlaying && props.message?.video?.split('.').pop() === 'gif' && !imageLoaded) && <Spinner color={"blue"} />}
          {/* {(props.message?.video?.split('.').pop() === 'gif' && isGifPlaying) && */}
          <img className={(props.message?.video?.split('.').pop() === 'gif' && isGifPlaying) ? 'show-image' : 'hide-image'} src={props.message.video} onLoad={() => setImageLoaded(true)} />
          {/* } */}
          {(props.message?.video && isSelectedVideoPlaying && props.message?.video?.split('.').pop() !== 'gif') &&
            <video controls controlsList="nodownload nofullscreen noremoteplayback" preload="metadata" onClick={playAndPause} onEnded={videoEnded} onCanPlay={isVideoLoaded} ref={playerRef} hidden={!videoCanPlay}>
              <source src={props.message.video} type="video/mp4" />
            </video>
          }
          {(props.message?.video && !isSelectedVideoPlaying && props.message?.video?.split('.').pop() !== 'gif' && props?.message?.banner) && <PlayArrowIcon onClick={(e) => playSelectedVideo()} />}

          {(props.message?.video && !isGifPlaying && props.message?.video?.split('.').pop() === 'gif' && props?.message?.banner
          ) && <PlayArrowIcon onClick={(e) => toggleGifImage()} />}
        </div>
      </div>
      <div className="inapp-message-content">
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
  );
}
