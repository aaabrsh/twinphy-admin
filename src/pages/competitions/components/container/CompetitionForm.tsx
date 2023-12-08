import { useState, useEffect } from "react";
import { Competition, INITIAL_DATA } from "../../data";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { create, get, update } from "../../../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import UploadImageInput from "../ui/UploadImageInput";
import RoundInput from "../ui/RoundInput";
import ReactQuill from "react-quill";
import { convertTimeZone } from "../../../../utils/time";
import { Calendar } from "primereact/calendar";

export default function CompetitionForm({ isEdit }: { isEdit?: boolean }) {
  const [formData, setFormData] = useState<Competition>(INITIAL_DATA);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [roundsNo, setRoundsNo] = useState<number>(1);
  const [roundsArray, setRoundsArray] = useState<number[]>([]);
  const [minRounds, setMinRounds] = useState(1);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (isEdit) {
      getCompetitionData(params.id ?? "");
    }
  }, []);

  useEffect(() => {
    if (roundsArray.length > 0) {
      setFormData((fd) => ({
        ...fd,
        rounds: fd.rounds.slice(0, roundsNo),
      }));
    }
    setRoundsArray(new Array<number>(roundsNo).fill(1));
  }, [roundsNo]);

  const getCompetitionData = (id: string) => {
    get("competition/edit/" + id)
      .then((res) => {
        processFormDataForEdit(res.data);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't get competition Data"
        );
        navigate("/competition");
      });
  };

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
      createCompetition({ image, formData: processFormData(formData) });
    }
  };

  const processFormData = (formData: Competition) => {
    const formDataCopy = JSON.parse(JSON.stringify(formData));
    const rounds = formDataCopy.rounds;

    formDataCopy.result_date = convertTimeZone(
      formDataCopy.result_date as Date
    );

    for (let i = 0; i < rounds.length; i++) {
      let round = rounds[i];
      round.start_date = convertTimeZone(round.start_date as Date);
      round.end_date = convertTimeZone(round.end_date as Date);
    }

    return formDataCopy;
  };

  const createCompetition = ({
    formData,
    image,
  }: {
    formData: Competition;
    image: File | null;
  }) => {
    const fd = new FormData();

    fd.append("data", JSON.stringify(formData));
    if (image) fd.append("file", image);

    setLoading(true);
    const request = isEdit
      ? update("competition/edit/" + params.id, fd)
      : create("competition/create", fd);

    request
      .then((_) => {
        toast.success("competition created successfully");
        setLoading(false);
        navigate("/competition");
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't create competition"
        );
        setLoading(false);
      });
  };

  const validateForm = () => {
    let errors: any = {};

    if (!formData.name) {
      errors.name = "name is required";
    }

    if (formData.is_paid && !formData.amount) {
      errors.amount = "payment amount is required";
    }

    if (formData.is_paid && formData.amount <= 0) {
      errors.amount =
        "payment amount must be greater that zero for paid competitions";
    }

    if (!formData.result_date) {
      errors.result_date = "result date is required";
    }

    for (let i = 0; i < roundsNo; i++) {
      const round = formData.rounds[i];
      const roundErrors = errors.rounds ?? [];

      if (!round?.name) {
        roundErrors[i] = {
          ...roundErrors?.[i],
          name: "round name is required",
        };
      }

      if (!round?.start_date) {
        roundErrors[i] = {
          ...roundErrors?.[i],
          start_date: "start date is required",
        };
      }

      if (!round?.end_date) {
        roundErrors[i] = {
          ...roundErrors?.[i],
          end_date: "end date is required",
        };
      }

      if (
        round?.start_date &&
        round?.end_date &&
        round?.start_date > round?.end_date
      ) {
        roundErrors[i] = {
          ...roundErrors?.[i],
          start_date: "start date must be before end date",
        };
      }

      if (round?.min_likes == null || round?.min_likes < 0) {
        roundErrors[i] = {
          ...roundErrors?.[i],
          min_likes: "minimum number of likes are required",
        };
      }

      if (roundErrors.length > 0) {
        errors.rounds = roundErrors;
      }
    }

    setError(errors);

    return Object.keys(errors).length > 0 ? false : true;
  };

  const resetForm = () => {
    navigate("/competition");
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const onRoundDataChange = (
    key: string,
    index: number,
    value: string | Date | number | null
  ) => {
    const roundsCopy = formData.rounds;

    if (key === "start_date") {
      let start_date = new Date(value as string);
      start_date = new Date(
        start_date.getFullYear(),
        start_date.getMonth(),
        start_date.getDate()
      );
      roundsCopy[index] = { ...roundsCopy[index], [key]: start_date };

      if (roundsCopy[index - 1] && !isNaN((value as Date)?.getTime())) {
        let end_date = new Date(value as string);
        end_date = new Date(
          end_date.getFullYear(),
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        roundsCopy[index - 1] = {
          ...roundsCopy[index - 1],
          end_date,
        };
      }
    } else {
      roundsCopy[index] = { ...roundsCopy[index], [key]: value };
    }
    setFormData((f) => ({ ...f, rounds: roundsCopy }));
  };

  const getMinResultDate = () => {
    const rounds = formData.rounds;
    const lastRound = rounds[rounds.length - 1];
    let lastDate = new Date();
    if (lastRound && lastRound.end_date) {
      lastDate = lastRound.end_date;
    }

    if (formData.result_date && formData.result_date < lastDate) {
      setFormData((data) => ({ ...data, result_date: null }));
    }

    return lastDate;
  };

  const processFormDataForEdit = (data: any) => {
    data.end_date = new Date(data.end_date);
    data.start_date = new Date(data.start_date);
    data.result_date = new Date(data.result_date);

    for (const round of data.rounds) {
      round.start_date = new Date(round.start_date);
      round.end_date = new Date(round.end_date);
    }

    setRoundsNo(data.rounds_count);
    setFormData(data);
    setMinRounds(data.current_round);
  };

  return (
    <>
      <form
        className="mb-5"
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
              <label
                htmlFor="description"
                style={{
                  top: "-0.75rem",
                  fontSize: "12px",
                }}
              >
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => onFormInputChange("description", value)}
              />
            </span>
            {error.description && (
              <small className="tw-text-red-500">{error.description}</small>
            )}
          </div>

          <div>
            <span className="p-float-label">
              <Dropdown
                inputId="type"
                value={formData.type}
                onChange={(e) => onFormInputChange("type", e.value)}
                options={["any", "image", "video"]}
                className={`tw-w-full ${error.type ? "p-invalid" : ""}`}
              />
              <label htmlFor="type">Allowed Post Types</label>
            </span>
          </div>

          <div>
            <span className="p-float-label">
              <InputNumber
                inputId="roundsNo"
                value={roundsNo}
                onChange={(e) =>
                  setRoundsNo(
                    e.value === null || e.value < minRounds
                      ? minRounds
                      : e.value
                  )
                }
                min={minRounds}
                className={`tw-w-full`}
              />
              <label htmlFor="roundsNo">Number of Rounds</label>
            </span>
          </div>

          {/* Rounds */}
          <div>
            <fieldset>
              <legend
                className="dark-blue"
                style={{ textDecoration: "underline" }}
              >
                Rounds
              </legend>
              {roundsArray.map((_, i) => (
                <RoundInput
                  key={i}
                  index={i}
                  round={formData.rounds?.[i]}
                  prev={formData.rounds?.[i - 1]}
                  error={error.rounds?.[i]}
                  is_last={i === roundsNo - 1}
                  onRoundInputChange={onRoundDataChange}
                  current_round={isEdit ? minRounds : null}
                />
              ))}
            </fieldset>
          </div>

          <div>
            <span className="p-float-label">
              <Calendar
                inputId="result_date"
                value={formData?.result_date}
                onChange={(e) => onFormInputChange("result_date", e.value)}
                className={`tw-w-full ${error?.result_date ? "p-invalid" : ""}`}
                minDate={getMinResultDate()}
              />
              <label htmlFor="result_date">Result Date</label>
            </span>
            {error?.result_date && (
              <small className="tw-text-red-500">{error.result_date}</small>
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
                  onChange={(e) => onFormInputChange("amount", e.value)}
                  mode="currency"
                  currency="INR"
                  currencyDisplay="code"
                  locale="en-IN"
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

        <div>
          <UploadImageInput
            image={image}
            onImageChange={handleImageChange}
            imageUrl={isEdit ? (formData as any)["image"] : null}
          />
        </div>
        <div className="tw-p-2 tw-flex tw-justify-end tw-gap-2 tw-mt-1">
          <button className="btn btn-secondary" type="reset">
            Cancel
          </button>
          <button disabled={loading} className="btn btn-primary" type="submit">
            {!loading ? (
              <span>Submit</span>
            ) : (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
