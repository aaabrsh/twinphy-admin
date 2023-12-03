import { useEffect, useState, useRef } from "react";
import { create, get, upload } from "../../services/api";
import { toast } from "react-toastify";
import { getName } from "../../utils/getName";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../utils/asset-paths";
import { setUser } from "../../services/auth";
import ToggleShowPassword from "./components/ui/ToggleShowPassword";

interface BasicProfile {
  first_name: string;
  last_name: string;
  email: string;
  profile_img?: string;
}

export default function EditProfile() {
  const INITIAL_PROFILE_DATA: BasicProfile = {
    first_name: "",
    last_name: "",
    email: "",
    profile_img: "",
  };

  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [originalProfileInfo, setOriginalProfileInfo] =
    useState<BasicProfile | null>(null);
  const [profileInfo, setProfileInfo] =
    useState<BasicProfile>(INITIAL_PROFILE_DATA);
  const [editFormErrors, setEditFormErrors] = useState<any>(null);
  const [passwordErrors, setPasswordErrors] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);

  const profileImgInputRef = useRef<any>();

  useEffect(() => {
    getProfileInfo();
  }, []);

  useEffect(() => {
    if (profileImgInputRef.current) profileImgInputRef.current.value = null;
  }, [profileImg]);

  const getProfileInfo = () => {
    get("admin/info")
      .then((res) => {
        setProfileInfo(res.data);
        setOriginalProfileInfo(res.data);
        setProfileImg(null);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load user info"
        );
      });
  };

  const handleEditFormInputChange = (key: string, value: string) => {
    setProfileInfo((p) => {
      if (!p) {
        return { ...INITIAL_PROFILE_DATA, [key]: value };
      } else {
        return { ...p, [key]: value };
      }
    });
  };

  const handleProfileImgChange = (event: any) => {
    setProfileImg(event.target.files[0]);
  };

  const openProfileImgDialog = () => {
    if (profileImgInputRef.current) profileImgInputRef.current.click();
  };

  const handleEditFormSubmit = (e: any) => {
    e.preventDefault();
    if (validateEditForm() && profileInfo) {
      updateProfile(profileInfo, profileImg);
    }
  };

  const validateEditForm = () => {
    const errors: any = {};

    if (!profileInfo.first_name) {
      errors.first_name = "first name is required";
    }

    if (!profileInfo.last_name) {
      errors.last_name = "last name is required";
    }

    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!profileInfo.email) {
      errors.email = "email is required";
    } else if (
      !emailRegex.test(profileInfo.email) ||
      profileInfo.email.includes(" ")
    ) {
      errors.email = "invalid email pattern";
    }

    setEditFormErrors(errors);

    return Object.keys(errors).length > 0 ? false : true;
  };

  const updateProfile = (payload: BasicProfile, image: File | null) => {
    const fd = new FormData();
    if (image) fd.append("file", image);
    fd.append("first_name", payload.first_name);
    fd.append("last_name", payload.last_name);
    fd.append("email", payload.email);

    setUpdateLoading(true);
    upload("admin/", fd, () => {}, "put")
      .then((res) => {
        setUser(res.data);
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update user data"
        );
        setUpdateLoading(false);
      });
  };

  function handlePasswordFormSubmit(e: any): void {
    e.preventDefault();
    if (validatePasswordForm()) {
      changePassword({ old_password: oldPassword, new_password: newPassword });
    }
  }

  const validatePasswordForm = () => {
    const errors: any = {};

    if (!oldPassword) {
      errors.old_password = "current password is required";
    } else if (oldPassword.length < 8) {
      errors.old_password = "password length is too short";
    }

    if (!newPassword) {
      errors.new_password = "new password is required";
    } else if (newPassword.length < 8) {
      errors.new_password = "password length is too short";
    }

    if (!newConfirmPassword) {
      errors.confirm_password = "password confirmation is required";
    } else if (newConfirmPassword.length < 8) {
      errors.confirm_password = "password length is too short";
    }

    if (newPassword !== newConfirmPassword) {
      errors.new_password = "passwords don't match";
      errors.confirm_password = "passwords don't match";
    }

    if (oldPassword === newPassword) {
      errors.old_password = "old and new passwords can't be the same";
      errors.new_password = "old and new passwords can't be the same";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length > 0 ? false : true;
  };

  const changePassword = (payload: {
    old_password: string;
    new_password: string;
  }) => {
    setPasswordLoading(true);
    create("admin/password", payload)
      .then((res) => {
        toast.success(res.message ?? "password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setNewConfirmPassword("");
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowNewConfirmPassword(false);
        setPasswordErrors(null);
        setPasswordLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't change password"
        );
        setPasswordLoading(false);
      });
  };

  return (
    <>
      <div className="col-xl-4">
        <div className="card">
          <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
            <img
              src={formatResourceURL(originalProfileInfo?.profile_img ?? "")}
              onError={handleProfileImageError}
              className="rounded-circle tw-h-[120px] tw-w-[120px]"
              style={{ objectFit: "cover" }}
            />
            <h2>{getName(originalProfileInfo)}</h2>
            <h5>Admin</h5>
          </div>
        </div>
      </div>

      <div className="col-xl-8">
        <div className="card">
          <div className="card-body pt-3">
            {/* <!-- Bordered Tabs --> */}
            <ul className="nav nav-tabs nav-tabs-bordered">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-edit"
                >
                  Edit Profile
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-change-password"
                >
                  Change Password
                </button>
              </li>
            </ul>
            <div className="tab-content pt-2">
              <div
                className="tab-pane fade show active profile-edit pt-3"
                id="profile-edit"
              >
                {/* <!-- Profile Edit Form --> */}
                <form onSubmit={handleEditFormSubmit}>
                  <div className="row mb-3">
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
                            : formatResourceURL(profileInfo.profile_img ?? "")
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
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="first_name"
                      className="col-md-4 col-lg-3 col-form-label"
                    >
                      First Name
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        className={`form-control ${
                          editFormErrors?.first_name ? "!tw-border-red-600" : ""
                        }`}
                        value={profileInfo.first_name}
                        onChange={(e) =>
                          handleEditFormInputChange(
                            "first_name",
                            e.target.value
                          )
                        }
                      />
                      {editFormErrors?.first_name && (
                        <div className="small text-danger w-100 py-1">
                          {editFormErrors.first_name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label
                      htmlFor="last_name"
                      className="col-md-4 col-lg-3 col-form-label"
                    >
                      Last Name
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        className={`form-control ${
                          editFormErrors?.last_name ? "!tw-border-red-600" : ""
                        }`}
                        value={profileInfo.last_name}
                        onChange={(e) =>
                          handleEditFormInputChange("last_name", e.target.value)
                        }
                      />
                      {editFormErrors?.last_name && (
                        <div className="small text-danger w-100 py-1">
                          {editFormErrors.last_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="email"
                      className="col-md-4 col-lg-3 col-form-label"
                    >
                      Email
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        className={`form-control ${
                          editFormErrors?.email ? "!tw-border-red-600" : ""
                        }`}
                        value={profileInfo.email}
                        onChange={(e) =>
                          handleEditFormInputChange("email", e.target.value)
                        }
                      />
                      {editFormErrors?.email && (
                        <div className="small text-danger w-100 py-1">
                          {editFormErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      disabled={updateLoading}
                      type="submit"
                      className="btn btn-primary"
                    >
                      {updateLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
                {/* <!-- End Profile Edit Form --> */}
              </div>

              <div className="tab-pane fade pt-3" id="profile-change-password">
                {/* <!-- Change Password Form --> */}
                <form onSubmit={handlePasswordFormSubmit}>
                  <div className="row mb-3">
                    <label
                      htmlFor="currentPassword"
                      className="col-md-4 col-lg-3 col-form-label"
                    >
                      Current Password
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <div className="input-group">
                        <input
                          id="currentPassword"
                          name="password"
                          className={`form-control ${
                            passwordErrors?.old_password
                              ? "!tw-border-red-600"
                              : ""
                          }`}
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <ToggleShowPassword
                          show={showOldPassword}
                          error={passwordErrors?.old_password}
                          toggleShowPassword={() =>
                            setShowOldPassword((s) => !s)
                          }
                        />
                        {passwordErrors?.old_password && (
                          <div className="small text-danger w-100 py-1">
                            {passwordErrors.old_password}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="newPassword"
                      className="col-md-4 col-lg-3 col-form-label"
                    >
                      New Password
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <div className="input-group">
                        <input
                          id="newPassword"
                          name="newpassword"
                          type={showNewPassword ? "text" : "password"}
                          className={`form-control ${
                            passwordErrors?.new_password
                              ? "!tw-border-red-600"
                              : ""
                          }`}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <ToggleShowPassword
                          show={showNewPassword}
                          error={passwordErrors?.new_password}
                          toggleShowPassword={() =>
                            setShowNewPassword((s) => !s)
                          }
                        />
                        {passwordErrors?.new_password && (
                          <div className="small text-danger w-100 py-1">
                            {passwordErrors.new_password}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label
                      htmlFor="renewPassword"
                      className="col-md-4 col-lg-3 col-form-label"
                    >
                      Re-enter New Password
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <div className="input-group">
                        <input
                          id="renewPassword"
                          name="renewpassword"
                          className={`form-control ${
                            passwordErrors?.confirm_password
                              ? "!tw-border-red-600"
                              : ""
                          }`}
                          type={showNewConfirmPassword ? "text" : "password"}
                          value={newConfirmPassword}
                          onChange={(e) =>
                            setNewConfirmPassword(e.target.value)
                          }
                        />
                        <ToggleShowPassword
                          show={showNewConfirmPassword}
                          error={passwordErrors?.confirm_password}
                          toggleShowPassword={() =>
                            setShowNewConfirmPassword((s) => !s)
                          }
                        />
                        {passwordErrors?.confirm_password && (
                          <div className="small text-danger w-100 py-1">
                            {passwordErrors.confirm_password}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      disabled={passwordLoading}
                      type="submit"
                      className="btn btn-primary"
                    >
                      {passwordLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <span>Change Password</span>
                      )}
                    </button>
                  </div>
                </form>
                {/* <!-- End Change Password Form --> */}
              </div>
            </div>
            {/* <!-- End Bordered Tabs --> */}
          </div>
        </div>
      </div>
    </>
  );
}
