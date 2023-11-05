export const profileCompletionTemplate = (rowData: any) => {
  let data = rowData.is_complete.toString();
  return (
    <>
      <div
        className={`tw-flex tw-gap-1 tw-items-center ${
          data === "true" ? "tw-text-green-500" : "tw-text-red-500"
        }`}
      >
        <i
          className={`bi ${
            data === "true" ? "bi-bookmark-check-fill" : "bi-bookmark-x-fill"
          }  tw-text-2xl`}
        ></i>
        <span className={``}>{data}</span>
      </div>
    </>
  );
};
