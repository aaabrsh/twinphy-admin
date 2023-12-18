import { useEffect, useState } from "react";
import { formatResourceURL } from "../../../../utils/asset-paths";
import { Sticker } from "../../../stickers/data";

export default function ShowStickers({
  stickers,
  removeSticker,
}: {
  stickers: Sticker[];
  removeSticker: (index: number) => void;
}) {
  const [smallStickers, setSmallStickers] = useState<
    { sticker: Sticker; index: number }[]
  >([]);
  const [fullLineStickers, setFullLineStickers] = useState<
    { sticker: Sticker; index: number }[]
  >([]);

  useEffect(() => {
    const smalls = [];
    const fullLines = [];

    for (let i = 0; i < stickers.length; i++) {
      stickers[i].type === "small"
        ? smalls.push({ sticker: stickers[i], index: i })
        : fullLines.push({ sticker: stickers[i], index: i });
    }

    setSmallStickers(smalls);
    setFullLineStickers(fullLines);
  }, [stickers]);
  return (
    <>
      <div>
        {smallStickers.length > 0 && (
          <div>
            <h3>Small Stickers</h3>
            <hr />
          </div>
        )}
        <div className="tw-flex tw-gap-2 tw-flex-wrap">
          {smallStickers.map((sm, i) => (
            <SmallSticker
              key={i}
              sticker={sm.sticker}
              remove={() => removeSticker(sm.index)}
            />
          ))}
        </div>

        {fullLineStickers.length > 0 && (
          <div>
            <h3>Full-Line Stickers</h3>
            <hr />
          </div>
        )}

        <div className="tw-flex gap-2 tw-flex-col">
          {fullLineStickers.map((fl, i) => (
            <FullLineSticker
              key={i}
              sticker={fl.sticker}
              remove={() => removeSticker(fl.index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const SmallSticker = ({
  sticker,
  remove,
}: {
  sticker: Sticker;
  remove: () => void;
}) => {
  return (
    <div className="m-3 tw-w-fit tw-relative">
      <img
        style={{ maxWidth: "100%", maxHeight: "150px" }}
        src={
          !(sticker as any)._id
            ? URL.createObjectURL(sticker.image as File)
            : formatResourceURL((sticker.image as any) ?? "")
        }
      />
      {!(sticker as any)._id && (
        <div
          className="tw-w-10 tw-h-10 tw-m-2 tw-absolute tw-top-0 tw-right-0 rounded-circle bg-danger tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
          onClick={remove}
        >
          <i className="bi bi-x-lg text-white"></i>
        </div>
      )}
      <h6>
        Position:{" "}
        <span className="text-primary fw-bold">{sticker.position}</span>
      </h6>
      <h6>
        Usage Limit:{" "}
        <span className="text-primary fw-bold">{sticker.usage_limit}</span>
      </h6>
    </div>
  );
};

const FullLineSticker = ({
  sticker,
  remove,
}: {
  sticker: Sticker;
  remove: () => void;
}) => {
  return (
    <div className="m-3 tw-w-fit tw-relative">
      <img
        style={{ maxWidth: "100%", maxHeight: "200px" }}
        src={
          !(sticker as any)._id
            ? URL.createObjectURL(sticker.image as File)
            : formatResourceURL((sticker.image as any) ?? "")
        }
      />
      {!(sticker as any)._id && (
        <div
          className="tw-w-10 tw-h-10 tw-m-2 tw-absolute tw-top-0 tw-right-0 rounded-circle bg-danger tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
          onClick={remove}
        >
          <i className="bi bi-x-lg text-white"></i>
        </div>
      )}
      <h6>
        Position:{" "}
        <span className="text-primary fw-bold">{sticker.position}</span>
      </h6>
      <h6>
        Usage Limit:{" "}
        <span className="text-primary fw-bold">{sticker.usage_limit}</span>
      </h6>
    </div>
  );
};
