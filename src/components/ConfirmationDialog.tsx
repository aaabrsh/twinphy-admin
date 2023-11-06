import { Dialog } from "primereact/dialog";

export default function ConfirmationDialog({
  show,
  header,
  onClose,
  onConfirmed,
}: {
  show: boolean;
  header: any;
  onClose: () => void;
  onConfirmed: () => void;
}) {
  const footerButtons = () => {
    return (
      <div className="tw-flex tw-justify-end">
        <button
          onClick={onClose}
          className="btn btn-danger me-3 tw-w-[70px]"
        >
          No
        </button>
        <button
          onClick={onConfirmed}
          className="btn btn-primary tw-w-[70px]"
        >
          Yes
        </button>
      </div>
    );
  };

  return (
    <>
      <Dialog
        visible={show}
        header={header}
        onHide={onClose}
        position="top"
        style={{ width: "50vw" }}
        footer={footerButtons}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      ></Dialog>
    </>
  );
}
