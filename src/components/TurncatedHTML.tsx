import { useEffect, useRef, useState } from "react";

export default function TruncatedHTML({
  text,
  maxHeight,
}: {
  text: string;
  maxHeight: number;
}) {
  const [isTruncated, setIsTruncated] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (containerRef.current && containerRef.current.offsetHeight > maxHeight) {
      setHasOverflow(true);
      setIsTruncated(true);
      hideOverflow(maxHeight);
    }
  }, [containerRef, text]);

  useEffect(() => {
    if (isTruncated) {
      hideOverflow(maxHeight);
    } else {
      showOverflow();
    }
  }, [isTruncated]);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const hideOverflow = (height: number) => {
    if (containerRef.current) {
      containerRef.current.style.height = height + "px";
      containerRef.current.style.overflowY = "hidden";
    }
  };

  const showOverflow = () => {
    if (containerRef.current) {
      containerRef.current.style.height = "auto";
    }
  };

  return (
    <div>
      <div ref={(el) => (containerRef.current = el as HTMLDivElement)}>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
      {hasOverflow && (
        <button
          className="btn btn-secondary btn-sm mt-2"
          onClick={toggleTruncate}
        >
          {isTruncated ? "Read More" : "Read Less"}
        </button>
      )}
    </div>
  );
}
