import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import {
  CONFIG_INITIAL_DATA,
  ConfigurationForm,
  ConfigurationFormError,
  ConfigurationData,
  ConfigurationTypes,
  ConfigurationValues,
  FileSizeDropdowns,
  VideoDurationDropdowns,
  formDataToValidateForRequired,
  ImageConfigTypes,
} from "./configuration_data";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import UploadImageInput from "../../components/UploadImageInput";

export default function Configuration() {
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<ConfigurationData[]>([]);
  const [formData, setFormData] =
    useState<ConfigurationForm>(CONFIG_INITIAL_DATA);
  const [error, setError] = useState<ConfigurationFormError>();
  const [images, setImages] =
    useState<{ [key in ConfigurationTypes]?: File | null }>();

  useEffect(() => {
    getConfigurationData();
  }, []);

  const getConfigurationData = () => {
    setLoading(true);
    get("configuration/all")
      .then((res) => {
        setOriginalData(res.data);
        processApiConfigurationData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't get configuration Data"
        );
        setLoading(false);
      });
  };

  const processApiConfigurationData = (data: ConfigurationData[]) => {
    const processedData: ConfigurationForm = CONFIG_INITIAL_DATA;
    for (const entry of data) {
      processedData[entry.key] = entry;
    }

    setFormData(processedData);
  };

  const onFormInputChange = (
    key: ConfigurationTypes,
    value: ConfigurationValues
  ) => {
    setFormData((fd) => ({ ...fd, [key]: { ...fd[key], value } }));
  };

  const onFormMetaDatatChange = (key: ConfigurationTypes, value: string) => {
    setFormData((fd) => ({ ...fd, [key]: { ...fd[key], unit: value } }));
  };

  const submitForm = () => {
    if (validateForm()) {
      updateConfiguration(getFilesToUpload());
    }
  };

  const validateForm = () => {
    let errors: any = {};

    for (const key of formDataToValidateForRequired) {
      if (!(formData as any)[key].value) {
        errors[key] = "required";
      }
    }

    setError(errors);

    return Object.keys(errors).length > 0 ? false : true;
  };

  const getFilesToUpload = (): FormData => {
    const fd = new FormData();

    if (images?.loading_screen_image) {
      fd.append("loading_screen_image", images?.loading_screen_image);
    }

    if (images?.home_bgd_desktop) {
      fd.append("home_bgd_desktop", images?.home_bgd_desktop);
    }

    if (images?.home_bgd_mobile) {
      fd.append("home_bgd_mobile", images?.home_bgd_mobile);
    }

    fd.append("data", JSON.stringify(formData));

    return fd;
  };

  const resetForm = () => {
    processApiConfigurationData(originalData);
    setImages({});
  };

  const updateConfiguration = (data: FormData) => {
    setLoading(true);
    create("configuration", data)
      .then((res) => {
        toast.success(res.message ?? "Configuration data updated successfully");
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ??
            "Error! couldn't update configuration Data"
        );
        setLoading(false);
      });
  };

  const onImageChange = (key: ConfigurationTypes, file?: File | null) => {
    setImages((i) => ({ ...i, [key]: file }));
  };

  const removeImageData = (key: ImageConfigTypes) => {
    onImageChange(key, null);
    onFormInputChange(key, "");
  };

  return (
    <>
      <p className="tw-text-lg tw-text-gray-500 dark-blue tw-font-semibold !tw-my-5">
        Update system-wide variables here
      </p>
      <hr />

      <form
        className="mb-5 !tw-w-auto"
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
        onReset={resetForm}
      >
        <div className="tw-flex tw-flex-col tw-gap-12 tw-my-5">
          <div>
            <div className="tw-flex gap-2">
              <span className="p-float-label">
                <InputNumber
                  inputId="max_image_upload_size"
                  value={parseInt(
                    formData.max_image_upload_size?.value as string
                  )}
                  onChange={(e) =>
                    onFormInputChange("max_image_upload_size", e.value ?? 0)
                  }
                  min={0}
                  className={` ${
                    error?.max_image_upload_size ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="max_image_upload_size">
                  Maximum Image Upload Size
                </label>
              </span>
              <span className="p-float-label">
                <Dropdown
                  inputId="imageUploadSize"
                  value={formData.max_image_upload_size.unit}
                  onChange={(e) =>
                    onFormMetaDatatChange("max_image_upload_size", e.value)
                  }
                  options={FileSizeDropdowns}
                />
                <label htmlFor="type">Size In</label>
              </span>
            </div>
            {error?.max_image_upload_size && (
              <small className="tw-text-red-500">
                {error?.max_image_upload_size}
              </small>
            )}
          </div>

          <div>
            <div className="tw-flex gap-2">
              <span className="p-float-label">
                <InputNumber
                  inputId="max_video_upload_size"
                  value={parseInt(
                    formData.max_video_upload_size.value as string
                  )}
                  onChange={(e) =>
                    onFormInputChange("max_video_upload_size", e.value ?? 0)
                  }
                  min={0}
                  className={` ${
                    error?.max_video_upload_size ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="max_video_upload_size">
                  Maximum Video Upload Size
                </label>
              </span>
              <span className="p-float-label">
                <Dropdown
                  inputId="videoUploadSize"
                  value={formData.max_video_upload_size.unit}
                  onChange={(e) =>
                    onFormMetaDatatChange("max_video_upload_size", e.value)
                  }
                  options={FileSizeDropdowns}
                />
                <label htmlFor="type">Size In</label>
              </span>
            </div>
            {error?.max_video_upload_size && (
              <small className="tw-text-red-500">
                {error?.max_video_upload_size}
              </small>
            )}
          </div>

          <div>
            <div className="tw-flex gap-2">
              <span className="p-float-label">
                <InputNumber
                  inputId="max_video_duration"
                  value={parseInt(formData.max_video_duration.value as string)}
                  onChange={(e) =>
                    onFormInputChange("max_video_duration", e.value ?? 0)
                  }
                  min={0}
                  className={` ${error?.max_video_duration ? "p-invalid" : ""}`}
                />
                <label htmlFor="max_video_duration">
                  Maximum Video Duration
                </label>
              </span>
              <span className="p-float-label">
                <Dropdown
                  inputId="videoDuration"
                  value={formData.max_video_duration.unit}
                  onChange={(e) =>
                    onFormMetaDatatChange("max_video_duration", e.value)
                  }
                  options={VideoDurationDropdowns}
                />
                <label htmlFor="type">Length In</label>
              </span>
            </div>
            {error?.max_video_duration && (
              <small className="tw-text-red-500">
                {error?.max_video_duration}
              </small>
            )}
          </div>

          <div>
            <div className="tw-flex tw-flex-col gap-2">
              <span className="p-float-label tw-mb-2">
                <label>Loading Screen Image</label>
              </span>
              {formData["loading_screen_image"]?.value && (
                <div>
                  <Button
                    className="tw-rounded mt-1"
                    type="button"
                    onClick={() => removeImageData("loading_screen_image")}
                  >
                    Use Default Loading Screen
                  </Button>
                </div>
              )}
              <UploadImageInput
                image={images?.loading_screen_image ?? null}
                onImageChange={(e) => onImageChange("loading_screen_image", e)}
                label="Upload"
                imageUrl={formData["loading_screen_image"]?.value as string}
              />
            </div>
          </div>

          <div>
            <div className="tw-flex tw-flex-col gap-2">
              <span className="p-float-label tw-mb-2">
                <label>Background Image - Desktop</label>
              </span>
              {formData["home_bgd_desktop"]?.value && (
                <div>
                  <Button
                    className="tw-rounded mt-1"
                    type="button"
                    onClick={() => removeImageData("home_bgd_desktop")}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <UploadImageInput
                image={images?.home_bgd_desktop ?? null}
                onImageChange={(e) => onImageChange("home_bgd_desktop", e)}
                label="Upload"
                imageUrl={formData["home_bgd_desktop"]?.value as string}
              />
            </div>
          </div>

          <div>
            <div className="tw-flex tw-flex-col gap-2">
              <span className="p-float-label tw-mb-2">
                <label>Background Image - Mobile</label>
              </span>
              {formData["home_bgd_mobile"]?.value && (
                <div>
                  <Button
                    className="tw-rounded mt-1"
                    type="button"
                    onClick={() => removeImageData("home_bgd_mobile")}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <UploadImageInput
                image={images?.home_bgd_mobile ?? null}
                onImageChange={(e) => onImageChange("home_bgd_mobile", e)}
                label="Upload"
                imageUrl={formData["home_bgd_mobile"]?.value as string}
              />
            </div>
          </div>
        </div>

        <div className="tw-p-2 tw-flex tw-justify-end tw-gap-2 tw-mt-1">
          <button className="btn btn-secondary" type="reset">
            Reset
          </button>
          <button disabled={loading} className="btn btn-primary" type="submit">
            {!loading ? (
              <span>Update</span>
            ) : (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
