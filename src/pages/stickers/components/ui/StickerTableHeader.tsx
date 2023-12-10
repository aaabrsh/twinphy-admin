export default function StickerTableHeader({
  addStickerClicked,
}: {
  addStickerClicked: () => void;
}) {
  return (
    <>
      <div className="tw-flex tw-flex-col tw-gap-2 md:tw-flex-row">
        <div className="tw-flex-grow"></div>
        <div className="">
          <button
            className="btn btn-primary !tw-flex tw-items-center tw-justify-center"
            onClick={addStickerClicked}
          >
            <i className="bi bi-plus tw-text-3xl"></i>
            <span>Add Sticker</span>
          </button>
        </div>
      </div>
    </>
  );
}
