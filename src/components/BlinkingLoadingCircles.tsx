export default function BlinkingLoadingCircles() {
  return (
    <div className="card-body d-flex justify-content-center">
      <div className="dz-spinner d-flex align-items-center">
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 tw-text-[#FF671F]"
          role="status"
          style={{ animationDelay: "100ms" }}
        ></div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 tw-text-[#FFFFFF]"
          role="status"
          style={{ animationDelay: "200ms" }}
        ></div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 tw-text-[#046A38]"
          role="status"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
