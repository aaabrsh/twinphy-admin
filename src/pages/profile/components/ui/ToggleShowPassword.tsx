export default function ToggleShowPassword({
  show,
  error,
  toggleShowPassword,
}: {
  show: boolean;
  error: string;
  toggleShowPassword: () => void;
}) {
  return (
    <button
      className={`btn !tw-rounded !tw-rounded-bl-none !tw-rounded-tl-none ${
        error ? "!tw-border-red-600" : "!tw-border-[#ddd]"
      } ${error ? "!tw-text-red-600" : "!tw-black"}`}
      type="button"
      id="togglePasswordButton"
      onClick={toggleShowPassword}
    >
      {show ? (
        <i className="bi bi-eye-slash-fill" aria-hidden="true"></i>
      ) : (
        <i className="bi bi-eye-fill" aria-hidden="true"></i>
      )}
    </button>
  );
}
