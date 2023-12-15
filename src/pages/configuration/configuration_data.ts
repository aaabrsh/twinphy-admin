export interface ConfigurationList {
  _id: string | null;
  name: ConfigurationTypes;
  value: ConfigurationValues;
  metadata: any;
}

export type ConfigurationForm = {
  [key in ConfigurationTypes]: ConfigurationValues;
};

export type ConfigurationFormError = {
  [key in ConfigurationTypes]?: string;
};

export type ConfigurationMetadata = {
  [key in ConfigurationTypes]: string;
};

export type ConfigurationTypes =
  | "max_image_upload_size"
  | "max_video_upload_size"
  | "max_video_duration";

export const CONFIG_INITIAL_DATA: ConfigurationForm = {
  max_image_upload_size: 5000,
  max_video_upload_size: 10000,
  max_video_duration: 1,
};

export const CONFIG_METADATA_DATA: ConfigurationMetadata = {
  max_image_upload_size: "kb",
  max_video_upload_size: "kb",
  max_video_duration: "min",
};

export type ConfigurationValues = number;

export const FileSizeDropdowns = ["kb", "mb", "gb"];

export const VideoDurationDropdowns = ["sec", "min", "hr"];
