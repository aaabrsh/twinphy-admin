import { useRef, useEffect } from "react";
import { formatResourceURL } from "../utils/asset-paths";

export default function UploadImageInput({
  image,
  onImageChange,
  label,
  imageUrl,
}: {
  image: File | null;
  onImageChange: (e: File | null) => void;
  label: string;
  imageUrl?: string;
}) {
  const imageInputRef = useRef<any>();

  useEffect(() => {
    if (imageInputRef.current) imageInputRef.current.value = null;
  }, [image]);

  return (
    <div className="input-group my-3">
      <input
        type="file"
        className="imageuplodify"
        accept="image/*"
        ref={imageInputRef}
        onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
        multiple={false}
        style={{ display: "none" }}
      />
      <div className="tw-w-full tw-border-2 tw-border-dashed !tw-rounded-lg">
        <button
          type="button"
          className="btn !tw-text-gray-500 !tw-font-bold tw-w-full !tw-py-3"
          style={{ background: "white", color: "rgb(58, 160, 255)" }}
          onClick={() => imageInputRef.current?.click()}
        >
          {label}
        </button>
        {(image || imageUrl) && (
          <div className="m-3 tw-w-fit tw-relative">
            <img
              style={{ maxWidth: "100%" }}
              src={
                image
                  ? URL.createObjectURL(image)
                  : imageUrl
                  ? formatResourceURL(imageUrl)
                  : ""
              }
            />
            {image && (
              <div
                className="tw-w-10 tw-h-10 tw-m-2 tw-absolute tw-top-0 tw-right-0 rounded-circle bg-danger tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
                onClick={() => {
                  onImageChange(null);
                }}
              >
                <i className="bi bi-x-lg text-white"></i>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
