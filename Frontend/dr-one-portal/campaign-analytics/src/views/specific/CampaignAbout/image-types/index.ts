import {
  img_in_app,
  img_push,
  img_push_app_custom_rich_image,
  img_push_app_rich_image,
  img_push_app_rich_text,
  img_push_app_standard,
  img_push_in_app, img_push_in_app_bottom_banner, img_push_in_app_full_page,
  img_push_in_app_full_page_with_video,
  img_push_in_app_pop_up_banner,
  img_push_in_app_pop_up_video,
  img_push_in_app_rating, img_push_in_app_slider, img_push_in_app_top_banner
} from "../../../../assets";

export const CAMPIGNTYPES = {
  PUSH: img_push,
  INAPP: img_in_app,
  PUSH_INAPP: img_push_in_app,
};

export const PUSHTEMPLATETYPE = {
  STANDARD: img_push_app_standard,
  RICHTEXT: img_push_app_rich_text,
  RICHIMAGE: img_push_app_rich_image,
  CUSTOMRICHIMAGE: img_push_app_custom_rich_image,
};

export const INAPPTEMPLATETYPE = {
  FULLPAGE: img_push_in_app_full_page,
  FULLPAGEWITHVIDEO: img_push_in_app_full_page_with_video,
  POPUPBANNER: img_push_in_app_pop_up_banner,
  POPUPVIDEO: img_push_in_app_pop_up_video,
  RATING: img_push_in_app_rating,
  SLIDER: img_push_in_app_slider,
  BOTTOMBANNER: img_push_in_app_bottom_banner,
  TOPBANNER: img_push_in_app_top_banner,
}

export const getPushTemplateImage = (adTemplateType: string) => {
  return PUSHTEMPLATETYPE[adTemplateType];
}

export const getInAppTemplateImage = (adTemplateType: string) => {
  return INAPPTEMPLATETYPE[adTemplateType];
}


