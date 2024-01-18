export interface ConfigurationData {
  _id?: string | null;
  key: ConfigurationTypes;
  value: ConfigurationValues;
  unit?: string;
  metadata: any;
}

export type ConfigurationForm = {
  [key in ConfigurationTypes]: ConfigurationData;
};

export type ConfigurationFormError = {
  [key in ConfigurationTypes]?: string;
};

export type ConfigurationTypes =
  | "max_image_upload_size"
  | "max_video_upload_size"
  | "max_video_duration"
  | "loading_screen_image"
  | "home_bgd_desktop"
  | "home_bgd_mobile";

export const CONFIG_INITIAL_DATA: ConfigurationForm = {
  max_image_upload_size: {
    key: "max_image_upload_size",
    value: 2,
    unit: "mb",
    metadata: {},
  },
  max_video_upload_size: {
    key: "max_video_upload_size",
    value: 5,
    unit: "mb",
    metadata: {},
  },
  max_video_duration: {
    key: "max_video_duration",
    value: 1,
    unit: "min",
    metadata: {},
  },
  loading_screen_image: {
    key: "loading_screen_image",
    value: "",
    metadata: {},
  },
  home_bgd_desktop: {
    key: "home_bgd_desktop",
    value: "",
    metadata: {},
  },
  home_bgd_mobile: {
    key: "home_bgd_mobile",
    value: "",
    metadata: {},
  },
};

export type ConfigurationValues = number | string;

export const FileSizeDropdowns = ["kb", "mb", "gb"];

export const VideoDurationDropdowns = ["sec", "min", "hr"];

export const formDataToValidateForRequired: ConfigurationTypes[] = [
  "max_image_upload_size",
  "max_video_upload_size",
  "max_video_duration",
];

export type ImageConfigTypes =
  | "loading_screen_image"
  | "home_bgd_desktop"
  | "home_bgd_mobile";
