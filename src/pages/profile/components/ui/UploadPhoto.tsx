import { MutableRefObject } from "react";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../utils/asset-paths";

export default function UploadPhoto({
  profileImg,
  profileUrl,
  profileImgInputRef,
  openProfileImgDialog,
  handleProfileImgChange,
  setProfileImg,
}: {
  profileImg: File | null;
  profileUrl?: string;
  profileImgInputRef: MutableRefObject<any>;
  openProfileImgDialog: () => void;
  handleProfileImgChange: (e: any) => void;
  setProfileImg: (val: File | null) => void;
}) {
  return (
    <>
      <label
        htmlFor="profileImage"
        className="col-md-4 col-lg-3 col-form-label"
      >
        Profile Image
      </label>
      <div className="col-md-8 col-lg-9">
        <img
          src={
            profileImg
              ? URL.createObjectURL(profileImg)
              : formatResourceURL(profileUrl ?? "")
          }
          onError={handleProfileImageError}
          className="tw-h-[120px] tw-w-[120px]"
          style={{ objectFit: "cover" }}
        />
        <div className="pt-2 tw-flex tw-gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            title="Upload new profile image"
            onClick={openProfileImgDialog}
          >
            <i className="bi bi-upload"></i>

            {/* Hidden Input Elements for profile_img upload */}
            <input
              type="file"
              accept="image/*"
              ref={profileImgInputRef}
              onChange={handleProfileImgChange}
              style={{ display: "none" }}
            />
          </button>

          {profileImg && (
            <button
              type="button"
              onClick={() => setProfileImg(null)}
              className="btn btn-danger btn-sm"
              title="Remove my profile image"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
