import { InputText } from "primereact/inputtext";

export default function SearchHeader({
  text,
  textChange,
}: {
  text: string;
  textChange: (e: any) => void;
}) {
  return (
    <span className="p-input-icon-left">
      <i className="bi bi-search tw-top-[43%]" />
      <InputText
        type="search"
        value={text}
        onChange={textChange}
        placeholder="Search"
        className="tw-w-full"
      />
    </span>
  );
}
