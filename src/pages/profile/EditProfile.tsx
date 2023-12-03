import { useEffect, useState, useRef } from "react";
import { create, get, upload } from "../../services/api";
import { toast } from "react-toastify";
import { getName } from "../../utils/getName";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../utils/asset-paths";
import { setUser } from "../../services/auth";
import TextInput from "./components/ui/TextInput";
import PasswordInput from "./components/ui/PasswordInput";
import UploadPhoto from "./components/ui/UploadPhoto";

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

    if (oldPassword && newPassword && newPassword !== newConfirmPassword) {
      errors.new_password = "passwords don't match";
      errors.confirm_password = "passwords don't match";
    }

    if (oldPassword && newPassword && oldPassword === newPassword) {
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
                    <UploadPhoto
                      profileImg={profileImg}
                      profileUrl={profileInfo.profile_img}
                      profileImgInputRef={profileImgInputRef}
                      openProfileImgDialog={openProfileImgDialog}
                      handleProfileImgChange={handleProfileImgChange}
                      setProfileImg={setProfileImg}
                    />
                  </div>

                  <div className="row mb-3">
                    <TextInput
                      label="First Name"
                      name="first_name"
                      value={profileInfo.first_name}
                      handleEditFormInputChange={handleEditFormInputChange}
                      error={editFormErrors?.first_name}
                    />
                  </div>
                  <div className="row mb-3">
                    <TextInput
                      label="Last Name"
                      name="last_name"
                      value={profileInfo.last_name}
                      handleEditFormInputChange={handleEditFormInputChange}
                      error={editFormErrors?.last_name}
                    />
                  </div>
                  <div className="row mb-3">
                    <TextInput
                      label="Email"
                      name="email"
                      value={profileInfo.email}
                      handleEditFormInputChange={handleEditFormInputChange}
                      error={editFormErrors?.email}
                    />
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
                    <PasswordInput
                      label="Current Password"
                      value={oldPassword}
                      name="currentPassword"
                      error={passwordErrors?.old_password}
                      showPasswordIcon={showOldPassword}
                      togglePasswordIcon={() => setShowOldPassword((s) => !s)}
                      setValue={setOldPassword}
                    />
                  </div>

                  <div className="row mb-3">
                    <PasswordInput
                      label="New Password"
                      value={newPassword}
                      name="newPassword"
                      error={passwordErrors?.new_password}
                      showPasswordIcon={showNewPassword}
                      togglePasswordIcon={() => setShowNewPassword((s) => !s)}
                      setValue={setNewPassword}
                    />
                  </div>

                  <div className="row mb-3">
                    <PasswordInput
                      label="Re-enter New Password"
                      value={newConfirmPassword}
                      name="renewPassword"
                      error={passwordErrors?.confirm_password}
                      showPasswordIcon={showNewConfirmPassword}
                      togglePasswordIcon={() =>
                        setShowNewConfirmPassword((s) => !s)
                      }
                      setValue={setNewConfirmPassword}
                    />
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
