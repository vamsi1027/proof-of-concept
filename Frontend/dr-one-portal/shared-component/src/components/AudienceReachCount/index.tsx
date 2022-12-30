import { useEffect, useState } from "react";
import * as S from "./AudienceReachCount.styles";
import { apiDashboard, helper } from "@dr-one/utils";
import { useTranslation } from 'react-i18next';

export type AudienceReachCountProps = {
  deviceReachCount?: number;
  clusterData?: [] | any;
  targetSDKVersion?: string;
  clusterName?: string;
  clusterId?: string;
  isShowClusterWarningFlag?: boolean;
  resetWaringFlag?: any;
  updateReachCount?: any;
  enableGeofence?: boolean;
};

const AudienceReachCount = (props: AudienceReachCountProps) => {
  const { t } = useTranslation();
  let getReachCountSetTimeOut: any = null;
  const [loadingReachCount, setLoadingReachCount] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [activeDeviceReachCount, setActiveDeviceReachCount] = useState(props?.deviceReachCount);
  const [isReachCountLoading, setReachCountLoading] = useState(false);

  useEffect(() => {
    setActiveDeviceReachCount(props.deviceReachCount);
  }, [props])

  const getReachCount = (force: boolean = false, loopReachCount = true) => {
    if (props.clusterData.list.length > 0
      && helper.isIncludeFilterAdded(props.clusterData)
      && loopReachCount && !isReachCountLoading
    ) {
      setReachCountLoading(true);

      let endPoint;
      if (window.location.pathname.indexOf('audience') >= 0) {
        const filters = 'filters=' + JSON.stringify(helper.formatClusterCriteria(props.clusterData));
        endPoint = 'campaign-mgmt-api/audienceclusters/reachcount?' + filters + '&forcecalculation=' + force;
      } else {
        const feature = [];
        if (props.enableGeofence) {
          feature.push('GeoFence');
        } else {
          if (feature.indexOf('GeoFence') > -1) {
            feature.splice(feature.indexOf('GeoFence'), 1);
          }
        }
        if (['2.4.0', '2.5.0', '2.7.0'].indexOf(props?.targetSDKVersion) !== -1) {
          feature.push('AdvCampaign');
          feature.push('notification');
        } else {
          feature.push('notification');
        }
        endPoint = helper.getAudienceReachCountForCampaign(
          props.clusterData, force, feature,
          props?.targetSDKVersion,
          false,
          false
        )
      }
      apiDashboard
        .get(
          endPoint
        ).then(response => {
          if (props.clusterData !== null) {
            if (props.clusterData.list.length <= 0) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
              return;
            }
          }
          if (parseInt(response.data['status'], helper.radix) !== 100) {
            renderReachCount(response.data['data']);
            loopReachCount = false;
          } else {
            loopReachCount = true;
            renderReachCount({ 'loading': true });

            if (getReachCountSetTimeOut !== null) {
              clearTimeout(getReachCountSetTimeOut);
              getReachCountSetTimeOut = null;
            }
            getReachCountSetTimeOut = setTimeout(() => {
              getReachCount(false, loopReachCount);
            }, 5000);
          }
        }, error => {
          loopReachCount = true;
          renderReachCount({ 'loading': true });
          setReachCountLoading(false);
          props.resetWaringFlag(false);
          console.log(helper.getErrorMessage(error));
        })
    } else {
      loopReachCount = false;
      setLoadingReachCount(false);
      setActiveDeviceReachCount(null);
    }
  }

  const renderReachCount = (data: any): void => {
    setLoopCount(loopCount + 1);
    if (loopCount > 3) {
      setLoadingReachCount(false);
    }
    if (data.loading) {
      setLoadingReachCount(true);
    } else {
      if (data.scope === null) {
      } else {
        setReachCountLoading(false);
        setActiveDeviceReachCount(data.activeDeviceReachCount.toString());
        props.updateReachCount(data.activeDeviceReachCount.toString());
        props.resetWaringFlag(false);
        setLoadingReachCount(false);
      }
    }
  }

  return (
    <S.Container>
      <div className="reach-count">
        {/* <h4>{t('REACH_COUNT_HEADER')}</h4>
        <p>{t('REACH_COUNT_HEADER_SUBHEADER')}: <span>{activeDeviceReachCount === null ? t('ACTIVE_DEVICE_REACH_COUNT_INITIAL_STATE') : activeDeviceReachCount}</span></p> */}
        <h4>Total Audience Size</h4>
        {!isReachCountLoading && <p>(Active Users Only): <span>{activeDeviceReachCount === null ? 'N/D' : activeDeviceReachCount}</span></p>}
        {isReachCountLoading && <p>Calculating Reach Count...</p>}
        <div className={isReachCountLoading ? 'spinner-wrapper spinner-loader' : 'spinner-wrapper'}>
          <img
            src="/img/loading-performance-metrics-icon.svg"
            alt="loading icon"
            className={props.isShowClusterWarningFlag ? 'warningFlag' : ''}
            onClick={() => getReachCount(true)}
          />
        </div>
      </div>
    </S.Container >
  );
};

export default AudienceReachCount;
