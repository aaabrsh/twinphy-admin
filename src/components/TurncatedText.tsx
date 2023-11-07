import { useState } from "react";

export default function TruncatedText({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const truncatedText = isTruncated ? text.slice(0, maxLength) : text;

  return (
    <div>
      <div>
        {truncatedText} {isTruncated && text.length > maxLength && "..."}
      </div>
      {text.length > maxLength && (
        <button className="btn btn-secondary btn-sm" onClick={toggleTruncate}>
          {isTruncated ? "Read More" : "Read Less"}
        </button>
      )}
    </div>
  );
}
