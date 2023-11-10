import { Menu } from "primereact/menu";
import { getName } from "../../../../utils/getName";
import timeAgo from "../../../../utils/time";
import { useRef } from "react";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../utils/asset-paths";

export default function Comment({
  comment,
  showReplies,
  type,
  removeComment,
  loadReplies,
}: {
  comment: any;
  showReplies?: string;
  type: "comment" | "reply";
  removeComment: () => void;
  loadReplies?: (id: string) => void;
}) {
  const actionRef = useRef<any>();

  const actions = [
    {
      label: "Remove",
      icon: "bi bi-x-octagon",
      command: () => {
        removeComment();
      },
    },
  ];

  return (
    <>
      <div className="tw-flex tw-py-2">
        <div className="tw-flex tw-gap-2">
          <img
            src={formatResourceURL(comment?.author?.profile_img)}
            onError={handleProfileImageError}
            alt="/"
            className="tw-rounded-[50%]"
            style={{ width: "30px", height: "30px" }}
          />
          <div>
            <div className="font-14 tw-font-semibold tw-m-0">
              {getName(comment?.author)}
            </div>
            <p className="mb-0 tw-text-zinc-800">{comment.content}</p>
            <div className="tw-text-sm tw-flex tw-gap-2 tw-text-zinc-600">
              <div className="">{comment.likes_count} Likes</div>
              <div className="">{timeAgo(comment.createdAt)}</div>
            </div>
            {type === "comment" && comment.has_reply && (
              <div
                className="py- tw-font-semibold text-primary small text-primary-hover"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => (loadReplies ? loadReplies(comment._id) : null)}
              >
                {showReplies !== comment._id && (
                  <span>
                    <span className="me-1">Show replies</span>
                    <i className="bi bi-chevron-down" aria-hidden="true"></i>
                  </span>
                )}
                {showReplies === comment._id && (
                  <span>
                    <span className="me-1">Hide replies</span>
                    <i className="bi bi-chevron-up" aria-hidden="true"></i>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="ms-auto">
          <Menu model={actions} popup ref={actionRef} className="" />
          <button
            style={{ cursor: "pointer" }}
            className="btn dark-blue !tw-font-bold btn-md !tw-py-2"
            onClick={(event) => {
              actionRef.current.toggle(event);
            }}
          >
            <i className="bi bi-arrow-down-circle tw-mr-1"></i>
          </button>
        </div>
      </div>
    </>
  );
}
