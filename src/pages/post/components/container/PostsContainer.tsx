import { useState, useRef, useEffect } from "react";
import PostUI from "../ui/PostUI";
import CommentsContainer from "./CommentsContainer";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "primereact/menu";
import timeAgo from "../../../../utils/time";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";

interface PostContainerProps {
  feed: any[];
}

export default function PostsContainer({ feed }: PostContainerProps) {
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<"post" | "comment">();
  const [commentToDelete, setCommentToDelete] = useState("");
  const componentRefs = useRef<{ [key: string]: HTMLElement }>({});
  const navigate = useNavigate();
  const actionRef = useRef<any>();
  const params = useParams();
  const [postId, setPostId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(params.userId ?? "");
    setPostId(params.postId ?? "");
  }, []);

  const actions = [
    {
      label: "Remove Post",
      icon: "bi bi-x-octagon",
      command: () => {
        removePostClicked();
      },
    },
  ];

  const removePostClicked = () => {
    setObjectToDelete("post");
    setConfirmationDialog(true);
  };

  const removeCommentClicked = (id: string) => {
    setObjectToDelete("comment");
    setCommentToDelete(id);
    setConfirmationDialog(true);
  };

  const dialogConfirmed = () => {
    switch (objectToDelete) {
      case "post":
        removePost(postId);
        break;
      case "comment":
        removeComment(commentToDelete);
        break;
      default:
        closeDialog();
        return;
    }
    closeDialog()
  };

  const removePost = (id: string) => {
    console.log("remove post clicked", id);
  };

  const removeComment = (id: string) => {
    console.log("remove comment clicked", id);
  };


  const closeDialog = () => {
    setObjectToDelete(undefined);
    setConfirmationDialog(false);
  };

  return (
    <>
      <div className="">
        {feed.map((post, i) => (
          <div
            key={i}
            ref={(el) => (componentRefs.current[post._id] = el as HTMLElement)}
            className="tw-mb-2"
          >
            <div className="tw-flex tw-flex-col md:tw-flex-row tw-mb-2">
              <div className="d-flex align-items-center tw-flex-grow">
                <a
                  onClick={() => navigate("/user/" + post.author._id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* TODO: add default profile image incase profile image doesn't exist */}
                  <img
                    className="tw-rounded-[50%]"
                    src={post.author?.profile_img}
                    style={{ width: "50px", height: "50px" }}
                    alt="/"
                  />
                </a>
                <div className="tw-flex tw-justify-center tw-flex-col ms-3">
                  <h6 className="title mb-0">
                    <a
                      onClick={() => navigate("/user/" + post.author._id)}
                      style={{ cursor: "pointer" }}
                      className="dark-blue tw-font-bold"
                    >
                      {post.author?.first_name + " " + post.author?.last_name}
                    </a>
                  </h6>
                  <div className="tw-text-sm">
                    <span>{timeAgo(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="tw-flex tw-items-center tw-mr-4">
                <Menu model={actions} popup ref={actionRef} className="" />
                <button
                  style={{ cursor: "pointer" }}
                  className="btn dark-blue !tw-font-bold btn-md !tw-py-2"
                  onClick={(event) => {
                    actionRef.current.toggle(event);
                  }}
                >
                  <i className="bi bi-arrow-down-circle tw-mr-1"></i>
                  <span>Actions</span>
                </button>
              </div>
            </div>
            <div className="tw-flex tw-min-h-[500px] tw-max-h-[650px] tw-flex-col md:tw-flex-row">
              <div className="md:tw-w-[70%]">
                <PostUI post={post} />
              </div>
              <div className="md:tw-w-[30%] md:tw-min-w-[350px]">
                <CommentsContainer
                  post={post}
                  removeComment={removeCommentClicked}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog
        show={showConfirmationDialog}
        header={"Do you want to remove this " + objectToDelete}
        onClose={closeDialog}
        onConfirmed={dialogConfirmed}
      />
    </>
  );
}
