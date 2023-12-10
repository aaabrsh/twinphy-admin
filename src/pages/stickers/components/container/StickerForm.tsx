import { useState } from "react";
import { Sticker, fullLineTypePositions, smallTypePositions } from "../../data";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import UploadImageInput from "../../../../components/UploadImageInput";

export default function StickerForm({
  formData,
  setFormData,
  submitForm,
  cancelForm,
}: {
  formData: Sticker;
  setFormData: any;
  submitForm: () => void;
  cancelForm: () => void;
}) {
  const [error, setError] = useState<any>({});

  const onFormInputChange = (key: string, value: any) => {
    setFormData((fd: Sticker) => ({ ...fd, [key]: value }));
  };

  const onFormSubmit = () => {
    if (validateForm()) {
      submitForm();
    }
  };

  const validateForm = () => {
    let errors: any = {};

    if (!formData.position) {
      errors.position = "type is required";
    }

    if (!formData.position) {
      errors.position = "position is required";
    }

    if (!formData.image) {
      errors.image = "image is required";
    }

    if (
      formData.type === "small" &&
      !smallTypePositions.includes(formData.position ?? "")
    ) {
      errors.position = "invalid position type";
    }

    if (
      formData.type === "full-line" &&
      !fullLineTypePositions.includes(formData.position ?? "")
    ) {
      errors.position = "invalid position type";
    }

    setError(errors);

    return Object.keys(errors).length > 0 ? false : true;
  };

  const getPositionDropdown = () => {
    switch (formData.type) {
      case "small":
        return smallTypePositions;
      case "full-line":
        return fullLineTypePositions;
      default:
        return [];
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="tw-flex tw-flex-col tw-gap-8 mb-5">
          <div>
            <label className="mb-2">Sticker Type</label>
            <div className="tw-flex tw-flex-wrap tw-gap-3">
              <div className="tw-flex tw-align-items-center">
                <RadioButton
                  inputId="small"
                  name="type"
                  value="small"
                  onChange={(e) => onFormInputChange("type", e.value)}
                  checked={formData.type === "small"}
                />
                <label htmlFor="small" className="tw-ml-2">
                  Small
                </label>
              </div>
              <div className="tw-flex tw-align-items-center">
                <RadioButton
                  inputId="fullLine"
                  name="type"
                  value="full-line"
                  onChange={(e) => onFormInputChange("type", e.value)}
                  checked={formData.type === "full-line"}
                />
                <label htmlFor="fullLine" className="tw-ml-2">
                  Full-Line
                </label>
              </div>
            </div>
            {error.type && (
              <small className="tw-text-red-500">{error.type}</small>
            )}
          </div>

          <div>
            <span className="p-float-label">
              <Dropdown
                inputId="position"
                value={formData.position}
                onChange={(e) => onFormInputChange("position", e.value)}
                options={getPositionDropdown()}
                className={`tw-w-full ${error.position ? "p-invalid" : ""}`}
              />
              <label htmlFor="position">Sticker Position</label>
            </span>
            {error.position && (
              <small className="tw-text-red-500">{error.position}</small>
            )}
          </div>
        </div>

        <div>
          <UploadImageInput
            image={formData.image}
            onImageChange={(image) => onFormInputChange("image", image)}
            label="Upload Sticker +"
          />
          {error.image && (
            <small className="tw-text-red-500">{error.image}</small>
          )}
        </div>
      </div>

      <div className="tw-flex tw-justify-end">
        <button onClick={cancelForm} className="btn btn-secondary me-3">
          Cancel
        </button>
        <button onClick={onFormSubmit} className="btn btn-primary">
          Save
        </button>
      </div>
    </>
  );
}
