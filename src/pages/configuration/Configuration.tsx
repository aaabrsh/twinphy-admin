import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import { create, get } from "../../services/api";
import { toast } from "react-toastify";
import {
  CONFIG_INITIAL_DATA,
  CONFIG_METADATA_DATA,
  ConfigurationForm,
  ConfigurationFormError,
  ConfigurationList,
  ConfigurationMetadata,
  ConfigurationTypes,
  ConfigurationValues,
  FileSizeDropdowns,
  VideoDurationDropdowns,
} from "./configuration_data";
import { Dropdown } from "primereact/dropdown";

export default function Configuration() {
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState<ConfigurationList[]>([]);
  const [formData, setFormData] =
    useState<ConfigurationForm>(CONFIG_INITIAL_DATA);
  const [error, setError] = useState<ConfigurationFormError>();
  const [metadata, setMetadata] =
    useState<ConfigurationMetadata>(CONFIG_METADATA_DATA);

  useEffect(() => {
    getConfigurationData;
  }, []);

  const getConfigurationData = () => {
    setLoading(true);
    get("configuration/all/")
      .then((res) => {
        setOriginalData(res.data);
        processApiConfigurationData(res.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't get configuration Data"
        );
        setLoading(false);
      });
  };

  const processApiConfigurationData = (data: ConfigurationList[]) => {
    const processedData: ConfigurationForm = CONFIG_INITIAL_DATA;
    for (const entry of data) {
      processedData[entry.name] = entry.value;
    }

    setFormData(processedData);
  };

  const onFormInputChange = (
    key: ConfigurationTypes,
    value: ConfigurationValues
  ) => {
    setFormData((fd) => ({ ...fd, [key]: value }));
  };

  const onFormMetaDatatChange = (key: ConfigurationTypes, value: string) => {
    setMetadata((fd) => ({ ...fd, [key]: value }));
  };

  const submitForm = () => {
    if (validateForm()) {
      updateConfiguration(formData, metadata);
    }
  };

  const validateForm = () => {
    let errors: any = {};

    for (const key in formData) {
      if (!(formData as any)[key]) {
        errors[key] = "required";
      }
    }

    setError(errors);

    return Object.keys(errors).length > 0 ? false : true;
  };

  const resetForm = () => {
    processApiConfigurationData(originalData);
  };

  const updateConfiguration = (
    data: ConfigurationForm,
    metadata: ConfigurationMetadata
  ) => {
    setLoading(true);
    const payload = { data, metadata };
    create("configuration", payload)
      .then((res) => {
        toast.success(res.message ?? "Configuration data updated successfully");
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ??
            "Error! couldn't update configuration Data"
        );
        setLoading(false);
      });
  };

  return (
    <>
      <p className="tw-text-lg tw-text-gray-500 dark-blue tw-font-semibold !tw-my-5">
        Update system-wide variables here
      </p>
      <hr />

      <form
        className="mb-5 !tw-w-auto"
        onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}
        onReset={resetForm}
      >
        <div className="tw-flex tw-flex-col tw-gap-12 tw-my-5">
          <div>
            <div className="tw-flex gap-2">
              <span className="p-float-label">
                <InputNumber
                  inputId="max_image_upload_size"
                  value={formData.max_image_upload_size}
                  onChange={(e) =>
                    onFormInputChange("max_image_upload_size", e.value ?? 0)
                  }
                  min={0}
                  className={` ${
                    error?.max_image_upload_size ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="max_image_upload_size">
                  Maximum Image Upload Size
                </label>
              </span>
              <span className="p-float-label">
                <Dropdown
                  inputId="imageUploadSize"
                  value={metadata.max_image_upload_size}
                  onChange={(e) =>
                    onFormMetaDatatChange("max_image_upload_size", e.value)
                  }
                  options={FileSizeDropdowns}
                />
                <label htmlFor="type">Size In</label>
              </span>
            </div>
            {error?.max_image_upload_size && (
              <small className="tw-text-red-500">
                {error?.max_image_upload_size}
              </small>
            )}
          </div>

          <div>
            <div className="tw-flex gap-2">
              <span className="p-float-label">
                <InputNumber
                  inputId="max_video_upload_size"
                  value={formData.max_video_upload_size}
                  onChange={(e) =>
                    onFormInputChange("max_video_upload_size", e.value ?? 0)
                  }
                  min={0}
                  className={` ${
                    error?.max_video_upload_size ? "p-invalid" : ""
                  }`}
                />
                <label htmlFor="max_video_upload_size">
                  Maximum Video Upload Size
                </label>
              </span>
              <span className="p-float-label">
                <Dropdown
                  inputId="videoUploadSize"
                  value={metadata.max_video_upload_size}
                  onChange={(e) =>
                    onFormMetaDatatChange("max_video_upload_size", e.value)
                  }
                  options={FileSizeDropdowns}
                />
                <label htmlFor="type">Size In</label>
              </span>
            </div>
            {error?.max_video_upload_size && (
              <small className="tw-text-red-500">
                {error?.max_video_upload_size}
              </small>
            )}
          </div>

          <div>
            <div className="tw-flex gap-2">
              <span className="p-float-label">
                <InputNumber
                  inputId="max_video_duration"
                  value={formData.max_video_duration}
                  onChange={(e) =>
                    onFormInputChange("max_video_duration", e.value ?? 0)
                  }
                  min={0}
                  className={` ${error?.max_video_duration ? "p-invalid" : ""}`}
                />
                <label htmlFor="max_video_duration">
                  Maximum Video Duration
                </label>
              </span>
              <span className="p-float-label">
                <Dropdown
                  inputId="videoDuration"
                  value={metadata.max_video_duration}
                  onChange={(e) =>
                    onFormMetaDatatChange("max_video_duration", e.value)
                  }
                  options={VideoDurationDropdowns}
                />
                <label htmlFor="type">Length In</label>
              </span>
            </div>
            {error?.max_video_duration && (
              <small className="tw-text-red-500">
                {error?.max_video_duration}
              </small>
            )}
          </div>
        </div>

        <div className="tw-p-2 tw-flex tw-justify-end tw-gap-2 tw-mt-1">
          <button className="btn btn-secondary" type="reset">
            Reset
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

// function PromptPlotCode() {
//   return (
//     <>
//       <div className="flex h-screen w-full select-none overflow-hidden">
//         <main
//           className="my-1 flex-1 overflow-y-auto rounded-l-lg bg-gray-200 px-10 pt-2 pb-2
//       transition duration-500 ease-in-out dark:bg-black"
//         >
//           <div className="min-h-screenbg-gray-200 rounded-xl pb-24 dark:bg-[#111827]">
//             <div className="container mx-auto mt-8 max-w-3xl">
//               <h1 className="px-6 pt-3 text-2xl font-bold text-gray-700 dark:text-white md:px-0">
//                 Account Settings
//               </h1>
//               <ul className="mt-3 flex border-b border-gray-300 px-6 text-sm font-medium text-gray-600 dark:border-gray-500 md:px-0">
//                 <li
//                   className={`mr-8 hover:text-gray-900 dark:hover:text-gray-300 border-b-2 border-gray-800 text-gray-900 dark:border-white dark:text-white`}
//                 >
//                   <button className="inline-block py-4">Profile Info</button>
//                 </li>

//                 <li
//                   className={`mr-8 hover:text-gray-900 dark:hover:text-gray-300 border-b-2 border-gray-800 text-gray-900 dark:border-white dark:text-white`}
//                 >
//                   <button className="inline-block py-4">Billing</button>
//                 </li>
//               </ul>
//               <div className="mx-auto mt-8 flex w-full overflow-hidden rounded-lg rounded-b-none bg-white">
//                 <div className="hidden w-1/3 bg-gray-100 p-8 dark:bg-gray-500 md:inline-block">
//                   <h2 className="text-md mb-4 font-medium tracking-wide text-gray-700 dark:text-white">
//                     Configurations
//                   </h2>
//                   <p className="text-sm text-gray-500 dark:text-white">
//                     Update system-wide variables here
//                   </p>
//                 </div>
//                 <div className="w-full md:w-2/3">
//                   <hr className="border-gray-200" />
//                   <form className="py-8 px-16 dark:bg-gray-300">
//                     <input className="text-sm text-gray-600 dark:bg-gray-300 dark:text-black" />

//                     <div className="flex">
//                       <input
//                         className="mt-2 block w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-400 dark:bg-gray-300"
//                         type="password"
//                         required
//                       />
//                       <button className="mx-2 rounded bg-gray-700 px-2 text-white">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={1.5}
//                           stroke="currentColor"
//                           className="h-6 w-6"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>

//               {/* </form> */}
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }
