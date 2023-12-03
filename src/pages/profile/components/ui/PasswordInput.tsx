import ToggleShowPassword from "./ToggleShowPassword";

export default function PasswordInput({
  label,
  value,
  name,
  error,
  showPasswordIcon,
  togglePasswordIcon,
  setValue,
}: {
  label: string;
  value: string;
  name: string;
  error: string;
  showPasswordIcon: boolean;
  togglePasswordIcon: () => void;
  setValue: (value: string) => void;
}) {
  return (
    <>
      <label htmlFor={name} className="col-md-4 col-lg-3 col-form-label">
        {label}
      </label>
      <div className="col-md-8 col-lg-9">
        <div className="input-group">
          <input
            id={name}
            name="password"
            className={`form-control ${error ? "!tw-border-red-600" : ""}`}
            type={showPasswordIcon ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <ToggleShowPassword
            show={showPasswordIcon}
            error={error}
            toggleShowPassword={togglePasswordIcon}
          />
          {error && <div className="small text-danger w-100 py-1">{error}</div>}
        </div>
      </div>
    </>
  );
}
