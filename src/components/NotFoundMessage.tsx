export default function NotFoundMessage({ message }: { message: string }) {
  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-flex-col tw-bg-zinc-200 tw-rounded-2xl tw-w-full">
      <img
        src="/assets/img/not-found.svg"
        className="img-fluid py-5"
        style={{ width: "300px", height: "300px" }}
      />
      <span className="dark-blue tw-opacity-80 tw-pb-10 tw-font-bold tw-text-3xl">
        {message}
      </span>
    </div>
  );
}
