import { create } from "zustand";
import { CommentState, PostState } from "./interface";

export const usePostStore = create<PostState>((set) => ({
  posts: [],

  setPosts: (posts: PostState["posts"]) => set({ posts: [...posts] }),

  addToFeed: (posts: PostState["posts"]) =>
    set((state) => ({ posts: [...state.posts, ...posts] })),

  decrementCommentsCount: (id: string) =>
    set(({ posts }) => {
      const postsCopy = posts.map((post) => {
        if (post._id === id) {
          post.comments_count =
            post.comments_count > 0 ? post.comments_count - 1 : 0;
        }
        return post;
      });

      return { posts: postsCopy };
    }),

  clearPosts: () => set({ posts: [] }),
}));

export const useCommentsStore = create<CommentState>((set) => ({
  comments: [],
  commentsHash: {},

  setComments: (newComments: CommentState["comments"]) =>
    set((state) => {
      const { comments, commentsHash } = buildCommentsHash(
        newComments,
        state.comments,
        state.commentsHash
      );
      return { comments, commentsHash };
    }),

  addToComments: (newComments: CommentState["comments"]) =>
    set((state) => {
      const { comments, commentsHash } = buildCommentsHash(
        newComments,
        state.comments,
        state.commentsHash
      );
      return { comments, commentsHash };
    }),

  setReplies: (replies: CommentState["comments"], parent_id: string) =>
    set((state) => {
      const { uniqueComments, updatedHash } = getUniqueComments(
        replies,
        state.commentsHash
      );
      const commentsCopy = state.comments.map((comment) => {
        if (comment._id === parent_id) {
          if (comment.comments && comment.comments.length > 0) {
            comment.comments.push(...uniqueComments);
          } else {
            comment.comments = [...uniqueComments];
          }
          comment.has_reply = true;
        }
        return comment;
      });

      return { comments: commentsCopy, commentsHash: updatedHash };
    }),

  deleteComment: (id: string) =>
    set(({ comments }) => {
      const newComments = [];

      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === id) {
          continue;
        }
        newComments.push(comments[i]);
      }

      return { comments: newComments };
    }),

  clearComments: () => set({ comments: [], commentsHash: {} }),
}));

// maintain a commenthash so that comments don't get duplicated
function buildCommentsHash(
  comments: CommentState["comments"],
  oldComments: CommentState["comments"],
  oldHash: CommentState["commentsHash"]
): {
  comments: CommentState["comments"];
  commentsHash: CommentState["commentsHash"];
} {
  let hash: CommentState["commentsHash"] = { ...oldHash };
  let newComments: CommentState["comments"] = [...oldComments];

  comments.map((comment) => {
    if (!hash[comment._id]) {
      hash[comment._id] = true;
      newComments.push(comment);
    }
  });

  return { comments: newComments, commentsHash: hash };
}

function getUniqueComments(
  newComments: CommentState["comments"],
  oldCommentsHash: CommentState["commentsHash"]
): {
  uniqueComments: CommentState["comments"];
  updatedHash: CommentState["commentsHash"];
} {
  const updatedHash: CommentState["commentsHash"] = { ...oldCommentsHash };
  const uniqueComments: CommentState["comments"] = [];

  newComments.map((c) => {
    if (!updatedHash[c._id]) {
      updatedHash[c._id] = true;
      uniqueComments.push(c);
    }
  });

  return { uniqueComments, updatedHash };
}
