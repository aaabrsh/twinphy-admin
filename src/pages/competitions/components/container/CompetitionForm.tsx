import { useState } from "react";
import { Competition, INITIAL_DATA } from "../../data";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";

export default function CompetitionForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Competition) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Competition>(INITIAL_DATA);
  const [error, setError] = useState<any>({});

  const onFormInputChange = (
    key: string,
    value: string | Date | boolean | number | null | undefined
  ) => {
    if ((key === "is_paid" && value === true) || value === false) {
      setFormData((f) => ({ ...f, [key]: value, amount: 0 }));
    } else {
      setFormData((f) => ({ ...f, [key]: value }));
    }
  };

  const submitForm = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const validateForm = () => {
    setError({});
    let isValid = true;

    if (!formData.name) {
      setError((e: any) => ({ ...e, name: "name is required" }));
      isValid = false;
    }

    if (!formData.start_date) {
      setError((e: any) => ({ ...e, start_date: "start date is required" }));
      isValid = false;
    }

    if (!formData.end_date) {
      setError((e: any) => ({ ...e, end_date: "start date is required" }));
      isValid = false;
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      setError((e: any) => ({
        ...e,
        start_date: "start date must be before end date",
      }));
      isValid = false;
    }

    if (formData.is_paid && !formData.amount) {
      setError((e: any) => ({ ...e, amount: "payment amount is required" }));
      isValid = false;
    }

    if (formData.is_paid && formData.amount <= 0) {
      setError((e: any) => ({
        ...e,
        amount:
          "payment amount must be greater that zero for paid competitions",
      }));
      isValid = false;
    }

    return isValid;
  };

  const resetForm = () => {
    setFormData(INITIAL_DATA);
    onCancel();
  };

  const getTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
        onReset={resetForm}
      >
        <div className="tw-flex tw-flex-col tw-gap-8">
          <div>
            <span className="p-float-label tw-mt-5">
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => onFormInputChange("name", e.target.value)}
                className={`tw-w-full ${error.name ? "p-invalid" : ""}`}
              />
              <label htmlFor="name">Name</label>
            </span>
            {error.name && (
              <small className="tw-text-red-500">{error.name}</small>
            )}
          </div>

          <div>
            <span className="p-float-label">
              <InputTextarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  onFormInputChange("description", e.target.value)
                }
                rows={2}
                cols={30}
                className={`tw-w-full ${error.description ? "p-invalid" : ""}`}
              />
              <label htmlFor="description">Description</label>
            </span>
            {error.description && (
              <small className="tw-text-red-500">{error.description}</small>
            )}
          </div>

          <div>
            <span className="p-float-label">
              <Calendar
                inputId="start_date"
                value={formData.start_date}
                onChange={(e) => onFormInputChange("start_date", e.value)}
                className={`tw-w-full ${error.start_date ? "p-invalid" : ""}`}
                minDate={new Date()}
              />
              <label htmlFor="start_date">Start Date</label>
            </span>
            {error.start_date && (
              <small className="tw-text-red-500">{error.start_date}</small>
            )}
          </div>

          <div>
            <span className="p-float-label">
              <Calendar
                inputId="end_date"
                value={formData.end_date}
                onChange={(e) => onFormInputChange("end_date", e.value)}
                className={`tw-w-full ${error.end_date ? "p-invalid" : ""}`}
                minDate={getTomorrow()}
              />
              <label htmlFor="end_date">End Date</label>
            </span>
            {error.end_date && (
              <small className="tw-text-red-500">{error.end_date}</small>
            )}
          </div>

          <div>
            <span className="flex align-items-center">
              <Checkbox
                inputId="is_paid"
                name="is_paid"
                value={formData.is_paid}
                onChange={(e) => onFormInputChange("is_paid", e.checked)}
                checked={formData.is_paid}
              />
              <label
                htmlFor="is_paid"
                style={{ cursor: "pointer" }}
                className="tw-ml-2"
              >
                Has Payment
              </label>
            </span>
          </div>

          {formData.is_paid && (
            <div>
              <span className="p-float-label flex-auto mt-1 my-1">
                <InputNumber
                  inputId="amount"
                  value={formData.amount}
                  onValueChange={(e) => onFormInputChange("amount", e.value)}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  className={`tw-w-full ${error.amount ? "p-invalid" : ""}`}
                />
                <label htmlFor="amount">Amount</label>
              </span>
              {error.amount && (
                <small className="tw-text-red-500">{error.amount}</small>
              )}
            </div>
          )}
        </div>
        <div className="tw-p-2 tw-flex tw-justify-end tw-gap-2 tw-mt-1">
          <button className="btn btn-secondary" type="reset">
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}