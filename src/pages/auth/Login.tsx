import { useState, useEffect } from "react";
import style from "./login.module.css";
import { create } from "../../services/api";
import { toast } from "react-toastify";
import { setUser, setUserId } from "../../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [apiError, setApiError] = useState();
  const [sendingData, setSendingData] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (emailTouched) validateEmail();
  }, [email]);

  useEffect(() => {
    if (passwordTouched) validatePassword();
  }, [password]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setApiError(undefined);
      sendAuthRequest(email, password);
    }
  };

  const validateEmail = (): boolean => {
    if (email.length === 0) {
      setEmailError("email is required");
      return false;
    }

    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (!emailRegex.test(email)) {
      setEmailError("invalid email pattern");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (): boolean => {
    if (password.length === 0) {
      setPasswordError("password is required");
      return false;
    }

    if (password.length < 8) {
      setPasswordError("password length is too short");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    setEmailTouched(true);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
  };

  const sendAuthRequest = (email: string, password: string) => {
    setSendingData(true);
    create("auth/admin/login", { email, password })
      .then((res) => {
        if (res.success) {
          setApiError(undefined);
          setUser(res.data);
          setUserId(res.data._id);
          window.location.replace("/dashboard");
        } else {
          setApiError(res.message);
        }
        setSendingData(false);
      })
      .catch((e) => {
        setSendingData(false);
        console.log(e);
        toast.error("Error! login failed");
      });
  };

  return (
    <>
      <main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a
                      href="index.html"
                      className="logo d-flex align-items-center w-auto"
                    >
                      <img src="assets/img/logo.png" alt="" />
                      <span className="d-none d-lg-block">VidiBattle Admin</span>
                    </a>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">
                          Login to Your Account
                        </h5>
                        {!apiError && (
                          <p className="text-center tw-mb-0 small">
                            Enter your email & password to login
                          </p>
                        )}
                        {apiError && (
                          <p className="text-center text-danger tw-font-bold small">
                            {apiError}
                          </p>
                        )}
                      </div>

                      <form
                        onSubmit={onSubmit}
                        className="row g-3 needs-validation"
                      >
                        <div className="col-12">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <div className="input-group has-validation">
                            <input
                              type="text"
                              name="username"
                              className={`form-control ${
                                !emailTouched
                                  ? ""
                                  : emailError.length > 0
                                  ? style.invalid
                                  : style.valid
                              }`}
                              id="email"
                              value={email}
                              onChange={handleEmailChange}
                            />
                            {emailError.length > 0 && (
                              <div className={style.error_text}>
                                {emailError}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <div className="tw-flex input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className={`form-control ${
                                !passwordTouched
                                  ? ""
                                  : passwordError.length > 0
                                  ? style.invalid
                                  : style.valid
                              }`}
                              id="password"
                              value={password}
                              onChange={handlePasswordChange}
                            />
                            <div
                              className="input-group-append"
                              onClick={() => setShowPassword((s) => !s)}
                            >
                              <button
                                className="btn"
                                type="button"
                                id="togglePasswordButton"
                                style={{
                                  borderTopLeftRadius: "0px",
                                  borderBottomLeftRadius: "0px",
                                  borderColor: !passwordTouched
                                    ? "#ddd"
                                    : passwordError.length > 0
                                    ? "var(--bs-form-invalid-border-color)"
                                    : "var(--bs-form-valid-border-color)",
                                  color: !passwordTouched
                                    ? ""
                                    : passwordError.length > 0
                                    ? "var(--bs-form-invalid-border-color)"
                                    : "var(--bs-form-valid-border-color)",
                                }}
                              >
                                {showPassword ? (
                                  <i
                                    className="bi bi-eye-slash-fill"
                                    aria-hidden="true"
                                  ></i>
                                ) : (
                                  <i
                                    className="bi bi-eye-fill"
                                    aria-hidden="true"
                                  ></i>
                                )}
                              </button>
                            </div>
                          </div>
                          {passwordError.length > 0 && (
                            <div className={style.error_text}>
                              {passwordError}
                            </div>
                          )}
                        </div>
                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={sendingData}
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
