export default function TextInput({
  label,
  value,
  name,
  error,
  handleEditFormInputChange,
}: {
  label: string;
  value: string;
  name: string;
  error: string;
  handleEditFormInputChange: (key: string, value: string) => void;
}) {
  return (
    <>
      <label htmlFor={name} className="col-md-4 col-lg-3 col-form-label">
        {label}
      </label>
      <div className="col-md-8 col-lg-9">
        <input
          id={name}
          name={name}
          type="text"
          className={`form-control ${error ? "!tw-border-red-600" : ""}`}
          value={value}
          onChange={(e) => handleEditFormInputChange(name, e.target.value)}
        />
        {error && <div className="small text-danger w-100 py-1">{error}</div>}
      </div>
    </>
  );
}
