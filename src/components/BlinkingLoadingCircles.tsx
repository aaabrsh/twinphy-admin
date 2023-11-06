export default function BlinkingLoadingCircles() {
  return (
    <div className="card-body d-flex justify-content-center">
      <div className="dz-spinner d-flex align-items-center">
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 tw-text-zinc-400"
          role="status"
          style={{ animationDelay: "100ms" }}
        ></div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 tw-text-zinc-600"
          role="status"
          style={{ animationDelay: "200ms" }}
        ></div>
        <div
          className="spinner-grow spinner-grow-sm me-2 mb-2 tw-text-zinc-800"
          role="status"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}
