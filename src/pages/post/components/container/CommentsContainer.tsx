import { useState, useEffect, useRef } from "react";
import Comment from "../ui/Comment";
import { get } from "../../../../services/api";
import { useCommentsStore } from "../../../../store/store";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";

export default function CommentsContainer({
  post,
  removeComment,
}: {
  post: any;
  removeComment: (id: string) => void;
}) {
  const [showRepliesFor, setShowRepliesFor] = useState("");
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [noMoreReplies, setNoMoreReplies] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const componentRefs = useRef<{ [key: string]: HTMLElement }>({});
  const lastDate = useRef<string | null>(null);
  const lastCommentId = useRef<string | null>(null);
  const lastReplyDate = useRef<string | null>(null);
  const lastReplyId = useRef<string | null>(null);
  const comments = useCommentsStore((state) => state.comments);
  const addToComments = useCommentsStore((state) => state.addToComments);
  const clearComments = useCommentsStore((state) => state.clearComments);
  const setReplies = useCommentsStore((state) => state.setReplies);

  useEffect(() => {
    fetchComments();

    return () => {
      clearComments();
    };
  }, []);

  const fetchComments = () => {
    setCommentsLoading(true);
    const pageSize = 10;
    get("comment/get/" + post._id, {
      pageSize,
      lastDate: lastDate.current,
      lastCommentId: lastCommentId.current,
      comment_for: "post",
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setNoMoreComments(true);
        }
        addToComments([...res.data]);
        lastDate.current = res.lastDate;
        lastCommentId.current = res.lastCommentId;
        setCommentsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setCommentsLoading(false);
      });
  };

  const loadReplies = (id: string) => {
    if (showRepliesFor !== id) {
      lastReplyDate.current = null;
      lastReplyId.current = null;
      fetchReplies(id);
      setNoMoreReplies(false);
    }
    toggleShowRepliesButton(id);
  };

  const fetchReplies = (id: string) => {
    const pageSize = 5;
    setReplyLoading(true);
    get("comment/get/" + id, {
      pageSize,
      lastDate: lastReplyDate.current,
      lastCommentId: lastReplyId.current,
      comment_for: "comment",
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setNoMoreReplies(true);
        }
        setReplies([...res.data], id);
        lastReplyDate.current = res.lastDate;
        lastReplyId.current = res.lastCommentId;
        setReplyLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setReplyLoading(false);
      });

    setTimeout(() => setReplyLoading(false), 5000);
  };

  const toggleShowRepliesButton = (id: string) => {
    if (showRepliesFor === id) {
      setShowRepliesFor("");
    } else {
      setShowRepliesFor(id);
    }
  };

  // display no comments if no comments are found
  if (comments.length === 0 && !commentsLoading) {
    return (
      <div className="card bg-light p-3 !tw-w-full !tw-h-full">
        <h6 className="text-muted tw-text-center tw-text-lg">No Comments</h6>
      </div>
    );
  }

  return (
    <div className="card bg-light p-3 !tw-w-full !tw-h-full !tw-mb-0 tw-overflow-y-auto">
      <div className="d-flex align-items-center">
        <h6 className="flex-grow-1">Comments</h6>
      </div>
      <hr />
      <div className="divider border-secondary mt-1"></div>

      <div className="dz-comments-list">
        {comments.map((comment: any, i: number) => (
          <div key={i}>
            <div
              ref={(el) =>
                (componentRefs.current[comment._id] = el as HTMLElement)
              }
            >
              <Comment
                comment={comment}
                showReplies={showRepliesFor}
                loadReplies={loadReplies}
                type="comment"
                removeComment={() => {
                  removeComment(comment._id);
                }}
              />
            </div>

            {showRepliesFor === comment._id &&
              comment.comments?.map((reply: any, i: number) => (
                <div key={i}>
                  <div className="tw-pl-10">
                    <Comment
                      comment={reply}
                      type="reply"
                      removeComment={() => {
                        removeComment(reply._id);
                      }}
                    />
                  </div>
                </div>
              ))}

            {showRepliesFor === comment._id &&
              !replyLoading &&
              !noMoreReplies && (
                <div
                  className=" small"
                  style={{ cursor: "pointer" }}
                  onClick={() => fetchReplies(comment._id)}
                >
                  <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
                  <span>Show more replies</span>
                </div>
              )}
            {showRepliesFor === comment._id && replyLoading && (
              <BlinkingLoadingCircles />
            )}
          </div>
        ))}

        {!commentsLoading && !noMoreComments && (
          <div
            className="small dark-blue"
            style={{ cursor: "pointer" }}
            onClick={() => fetchComments()}
          >
            <i className="bi bi-arrow-repeat me-2" aria-hidden="true"></i>
            <span>Show more comments</span>
          </div>
        )}
        {commentsLoading && <BlinkingLoadingCircles />}
      </div>
    </div>
  );
}
