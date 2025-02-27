import { env } from "./env";

export const defaultThumbnail = "/assets/img/default-thumbnail.png";
export const defaultPost = "/assets/img/default-post.png";
export const defaultCompetition = "/assets/img/default-post.png";
export const defaultUser = "/assets/img/default-user.png";

export const handleProfileImageError = (event: any) => {
  event.target.src = defaultUser;
};

export const handlePostImageError = (event: any) => {
  event.target.src = defaultPost;
};

export const handleCompetitionImageError = (event: any) => {
  event.target.src = defaultCompetition;
};

export const formatResourceURL = (filename: string) => {
  return `${env.VITE_API_URL}/media/` + filename;
};
