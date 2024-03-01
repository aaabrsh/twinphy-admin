import { useState, useEffect } from "react";
import { Competition, INITIAL_DATA, Round } from "../../data";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { create, get, update } from "../../../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import UploadImageInput from "../../../../components/UploadImageInput";
import RoundInput from "../ui/RoundInput";
import ReactQuill from "react-quill";
import { Calendar } from "primereact/calendar";
import { INITIAL_STICKER_DATA, Sticker } from "../../../stickers/data";
import { Dialog } from "primereact/dialog";
import StickerForm from "../../../../components/StickerForm";
import ShowStickers from "../ui/ShowStickers";

export default function CompetitionForm({ isEdit }: { isEdit?: boolean }) {
  const [formData, setFormData] = useState<Competition>(INITIAL_DATA);
  const [originalData, setOriginalData] = useState<Competition>(INITIAL_DATA);
  const [image, setImage] = useState<File | null>(null);
  const [image_long, setImageLong] = useState<File | null>(null);
  const [error, setError] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [roundsNo, setRoundsNo] = useState<number>(1);
  const [roundsArray, setRoundsArray] = useState<number[]>([]);
  const [minRounds, setMinRounds] = useState(1);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [stickerData, setStickerData] = useState<Sticker>(INITIAL_STICKER_DATA);
  const [showStickerFormModal, setShowStickerFormModal] = useState(false);
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

    if (isEdit) {
      const rounds: any[] = [];
      for (let i = 0; i < roundsNo; i++) {
        let round: any = formData.rounds[i];
        let originalRound: any = originalData.rounds[i];

        if (!round) round = {};
        if (!round._id !== originalRound?._id) round._id = originalRound?._id;
        if (!round.start_date) round.start_date = originalRound?.start_date;
        if (!round.end_date) round.end_date = originalRound?.end_date;
        if (round.min_likes === undefined)
          round.min_likes = originalRound?.min_likes;
        if (round.percentage_to_advance === undefined)
          round.percentage_to_advance = originalRound?.percentage_to_advance;

        rounds.push(round);
      }

      setFormData((fd) => ({ ...fd, rounds: rounds as Round[] }));
    }
  }, [roundsNo]);

  const getCompetitionData = (id: string) => {
    setLoading(true);
    get("competition/edit/" + id)
      .then((res) => {
        processFormDataForEdit(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
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
      createCompetition({
        image,
        image_long,
        formData: processFormData(formData),
      });
    }
  };

  const processFormData = (formData: Competition) => {
    const formDataCopy = JSON.parse(JSON.stringify(formData));
    // use this function if the data needs to be processed before sending it to the API
    return formDataCopy;
  };

  const createCompetition = ({
    formData,
    image,
    image_long,
  }: {
    formData: Competition;
    image: File | null;
    image_long: File | null;
  }) => {
    const fd = new FormData();

    if (image) fd.append("image", image);
    if (image_long) fd.append("image_long", image_long);
    if (formData.has_sticker) {
      const finalStickers: any[] = [];
      let stickerIndex = 0;
      stickers.forEach((sticker) => {
        const s: any = {
          type: sticker.type,
          position: sticker.position,
          usage_limit: sticker.usage_limit,
        };

        if (sticker._id) s._id = sticker._id;

        if (
          sticker.image &&
          (!sticker._id || typeof sticker.image !== "string")
        ) {
          fd.append(`stickers`, sticker.image);
          s.index = stickerIndex;
          stickerIndex++;
        }

        finalStickers.push(s);
      });
      (formData as any).stickers = [...finalStickers];
    } else {
      (formData as any).stickers = [];
    }

    fd.append("data", JSON.stringify(formData));

    setLoading(true);
    const request = isEdit
      ? update("competition/edit/" + params.id, fd)
      : create("competition/create", fd);

    request
      .then((res) => {
        toast.success(res.message ?? "competition created successfully");
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

      if (round?.percentage_to_advance == null && i < roundsNo - 1) {
        roundErrors[i] = {
          ...roundErrors?.[i],
          percentage_to_advance: "% value to advance users is required",
        };
      }

      if (roundErrors.length > 0) {
        errors.rounds = roundErrors;
      }

      if (
        i === roundsNo - 1 &&
        formData.result_date &&
        round.end_date &&
        formData.result_date < round?.end_date
      ) {
        errors.result_date =
          "result date and time must at least be equal to the end of the last round";
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

  const handleLongImageChange = (file: File | null) => {
    setImageLong(file);
  };

  const onRoundDataChange = (
    key: string,
    index: number,
    value: string | Date | number | null
  ) => {
    const roundsCopy = formData.rounds;

    if (key === "start_date") {
      roundsCopy[index] = { ...roundsCopy[index], [key]: value as Date };

      // update the end_date of the previous round
      if (roundsCopy[index - 1] && !isNaN((value as Date)?.getTime())) {
        roundsCopy[index - 1] = {
          ...roundsCopy[index - 1],
          end_date: value as Date,
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
    const today = new Date();
    let lastDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
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
    setOriginalData(data);
    setMinRounds(data.current_round);

    if (data.has_sticker && data.stickers && data.stickers.length > 0) {
      setStickers(data.stickers);
    }
  };

  const addSticker = () => {
    if (stickerData._id) {
      const stickersCopy = stickers.map((s) =>
        s._id === stickerData._id ? stickerData : s
      );
      setStickers(stickersCopy);
    } else {
      setStickers((s) => [...s, stickerData]);
    }
    closeStickerModal();
  };

  const closeStickerModal = () => {
    setStickerData(INITIAL_STICKER_DATA);
    setShowStickerFormModal(false);
  };

  const removeSticker = (index: number) => {
    let stickersCopy = [...stickers];

    if (isEdit) {
      stickersCopy[index] = (originalData as any).stickers?.[index];
    } else {
      stickersCopy = [
        ...stickersCopy.slice(0, index),
        ...stickersCopy.slice(index + 1),
      ];
    }

    setStickers(stickersCopy);
  };

  const handleStickerEdit = (sticker: Sticker) => {
    setStickerData(sticker);
    setShowStickerFormModal(true);
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
        <div>
          <UploadImageInput
            image={image}
            onImageChange={handleImageChange}
            imageUrl={isEdit ? (formData as any)["image"] : null}
            label="Competition Cover Photo (4:3)"
          />
          <UploadImageInput
            image={image_long}
            onImageChange={handleLongImageChange}
            imageUrl={isEdit ? (formData as any)["image_long"] : null}
            label="Competition Cover Photo - Long (3:1)"
          />
        </div>

        <div className="tw-flex tw-flex-col tw-gap-8 tw-mb-5">
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
                  current_round={
                    isEdit && (formData as any)["status"] !== "scheduled"
                      ? minRounds
                      : null
                  }
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
                showTime
                hourFormat="12"
                stepMinute={60}
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

          <div>
            <span className="flex align-items-center">
              <Checkbox
                inputId="has_sticker"
                name="has_sticker"
                value={formData.has_sticker}
                onChange={(e) => {
                  onFormInputChange("has_sticker", e.checked);
                  if (!e.checked) {
                    setStickers([]);
                  }
                }}
                checked={formData.has_sticker}
              />
              <label
                htmlFor="has_sticker"
                style={{ cursor: "pointer" }}
                className="tw-ml-2"
              >
                Has Stickers
              </label>
            </span>
          </div>

          {formData.has_sticker && (
            <div className="">
              <button
                className="btn btn-primary"
                onClick={() => setShowStickerFormModal(true)}
                type="button"
              >
                + Add Sticker
              </button>
            </div>
          )}

          <ShowStickers
            stickers={stickers}
            removeSticker={removeSticker}
            editSticker={handleStickerEdit}
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

      {/* Sticker Form Modal */}
      <Dialog
        header="Change Account Status"
        visible={showStickerFormModal}
        onHide={closeStickerModal}
        position="center"
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <StickerForm
          formData={stickerData}
          setFormData={setStickerData}
          submitForm={addSticker}
          cancelForm={closeStickerModal}
        />
      </Dialog>
    </>
  );
}
