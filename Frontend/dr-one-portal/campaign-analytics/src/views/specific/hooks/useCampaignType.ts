import {useEffect, useState} from "react";

export const useCampaignType = () => {
  const [campaignType, setCampaignType] = useState('PUSH');

  const convertToKey = (_campaignType: string) => {
    const campaignTypeParts = _campaignType.split('-');
    let campaignTypeJoined: string = campaignTypeParts[0];
    if(campaignTypeParts[1] !== undefined)
      campaignTypeJoined.concat(campaignTypeParts[1]);
    return campaignTypeJoined;
  }

  const changeCampaignType = (_campaignType: string): void => {
    const campaignTypeConverted = convertToKey(_campaignType);
    setCampaignType(campaignTypeConverted);
  }

  return [campaignType, changeCampaignType]
}
