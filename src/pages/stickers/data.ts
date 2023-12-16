export interface Sticker {
  image: File | null;
  position: smallPosition | fullLinePosition | null;
  type: "small" | "full-line";
  _id?: string;
}

export type smallPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type fullLinePosition = "top" | "bottom";

export const smallTypePositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

export const fullLineTypePositions = ["top", "bottom"];

export const INITIAL_STICKER_DATA: Sticker = {
  image: null,
  position: null,
  type: "small",
};
