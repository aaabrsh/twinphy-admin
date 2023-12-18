import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { get, remove, upload } from "../../services/api";
import { toast } from "react-toastify";
import {
  formatResourceURL,
  handleCompetitionImageError,
} from "../../utils/asset-paths";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { Menu } from "primereact/menu";
import StickerTableHeader from "./components/ui/StickerTableHeader";
import { Dialog } from "primereact/dialog";
import StickerForm from "../../components/StickerForm";
import { INITIAL_STICKER_DATA, Sticker } from "./data";

export default function Stickers() {
  const [stickers, setStickers] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<any>(null);
  const [formData, setFormData] = useState<Sticker>(INITIAL_STICKER_DATA);

  const actionBtnRef = useRef<any>();

  const actionItems = [
    {
      label: "Options",
      items: [
        {
          label: "Delete Sticker",
          icon: "bi bi-x-circle",
          command: () => {
            setShowConfirmationModal(true);
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchStickers(0, limit);
  }, []);

  const fetchStickers = (page: number, limit: number) => {
    if (page >= Math.ceil(total / limit) && total && limit)
      page = Math.ceil(total / limit) - 1;

    let queryParams = {
      page: page + 1,
      limit: limit,
    };

    setTableLoading(true);
    get("sticker/list", queryParams)
      .then((res) => {
        setStickers(res.data);
        setPage(res.page);
        setTotal(res.total);
        setLimit(res.limit);
        setTableLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error! couldn't load stickers");
        setTableLoading(false);
      });
  };

  const imageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={formatResourceURL(rowData.image)}
        onError={handleCompetitionImageError}
        className="tw-shadow-lg tw-rounded-lg"
        style={{ maxWidth: "500px", maxHeight: "250px" }}
      />
    );
  };

  const onPageChange = (event: any) => {
    fetchStickers(event.page, event.rows);
  };

  const actionButtons = (rowData: any) => {
    return (
      <>
        <div>
          <Menu model={actionItems} popup ref={actionBtnRef} className="" />
          <button
            className="btn btn-primary btn-sm tw-w-[75px] !tw-py-1"
            onClick={(event) => {
              setSelectedSticker(rowData);
              actionBtnRef.current.toggle(event);
            }}
          >
            <i className="bi bi-arrow-down-circle tw-mr-1"></i>
            <span>Actions</span>
          </button>
        </div>
      </>
    );
  };

  const closeDialog = () => {
    setSelectedSticker(null);
    setShowConfirmationModal(false);
  };

  const dialogConfirmed = () => {
    deleteSticker(selectedSticker._id);
    closeDialog();
  };

  const deleteSticker = (stickerId: string) => {
    setTableLoading(true);
    remove("sticker/" + stickerId)
      .then((res) => {
        toast.success(res.message ?? "sticker deleted successfully");
        fetchStickers(0, limit);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't delete sticker"
        );
        setTableLoading(false);
      });
  };

  const openStickerForm = () => {
    setShowFormModal(true);
  };

  const onFormCancel = () => {
    clearForm();
    setShowFormModal(false);
  };

  const onFormSubmit = () => {
    const fd = new FormData();

    fd.append("file", formData.image as File);
    fd.append("type", formData.type);
    fd.append("position", formData.position ?? "top-left");
    fd.append("usage_limit", formData.usage_limit.toString());

    setTableLoading(true);
    upload("sticker", fd, () => {}, "post")
      .then((res) => {
        toast.success(res.message ?? "Sticker created successfully");
        fetchStickers(0, limit);
        onFormCancel();
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't create sticker"
        );
        setTableLoading(false);
      });
  };

  const clearForm = () => {
    setFormData(INITIAL_STICKER_DATA);
  };

  return (
    <>
      <div className="card">
        <DataTable
          loading={tableLoading}
          value={stickers}
          paginator
          rows={limit}
          totalRecords={total}
          lazy={true}
          first={(page - 1) * limit}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPage={onPageChange}
          header={<StickerTableHeader addStickerClicked={openStickerForm} />}
          emptyMessage="No competitions found."
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column header="Image" body={imageBodyTemplate}></Column>
          <Column field="type" header="type" sortable></Column>
          <Column field="position" header="Position" sortable></Column>
          <Column field="usage_limit" header="Usage Limit" sortable></Column>
          <Column field="usage_count" header="Usage Count" sortable></Column>
          <Column header="Actions" body={actionButtons}></Column>
        </DataTable>

        {/* Confirmation Modal */}
        <ConfirmationDialog
          show={showConfirmationModal}
          header={"Would you like to delete this sticker?"}
          onClose={closeDialog}
          onConfirmed={dialogConfirmed}
        />

        {/* Sticker Form Modal */}
        <Dialog
          header="Change Account Status"
          visible={showFormModal}
          onHide={onFormCancel}
          position="center"
          style={{ width: "50vw" }}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        >
          <StickerForm
            formData={formData}
            setFormData={setFormData}
            submitForm={onFormSubmit}
            cancelForm={onFormCancel}
          />
        </Dialog>
      </div>
    </>
  );
}
