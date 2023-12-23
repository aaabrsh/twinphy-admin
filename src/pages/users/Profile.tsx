import { useEffect, useState } from "react";
import {
  AccountCompletion,
  ProfileProviders,
  Tag,
} from "../../components/Tags";
import { get } from "../../services/api";
import { getStatusSeverity } from "../../utils/account-status";
import style from "./profile.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getName } from "../../utils/getName";
import { getDate } from "../../utils/time";
import { Skeleton } from "primereact/skeleton";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import NotFoundMessage from "../../components/NotFoundMessage";
import { formatNumber } from "../../utils/number-formatting";
import {
  defaultPost,
  defaultThumbnail,
  formatResourceURL,
  handlePostImageError,
  handleProfileImageError,
} from "../../utils/asset-paths";
import PlayBtn from "../../components/PlayBtn";
import SocialMediaLinks from "./components/ui/SocialMediaLinks";

export default function Profile() {
  const [profile, setProfileData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [lastDate, setLastDate] = useState();
  const [lastPostId, setLastPostId] = useState();
  const [postsLoading, setPostsLoading] = useState(false);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (params.username) {
      fetchProfileInfo(params.username);
      fetchPosts();
    }
  }, []);

  const fetchProfileInfo = (id: string) => {
    get("user/profileInfo/" + id)
      .then((res) => {
        setProfileData(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  };

  const fetchPosts = () => {
    setPostsLoading(true);
    const pageSize = 15;
    return get("post/userPosts/" + params.username, {
      pageSize,
      lastDate,
      lastPostId,
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setPostsLoading(false);
          setNoMorePosts(true);
        }
        const photos = res.data.map((data: any) => {
          if (data.media.length > 0) {
            const media = data.media[0];
            if (media?.type === "video") {
              data.src = media?.thumbnail?.filename
                ? formatResourceURL(media?.thumbnail?.filename)
                : null;
            } else {
              data.src = media?.filename
                ? formatResourceURL(media?.filename)
                : null;
            }
          }
          return data;
        });
        setPosts((p) => [...p, ...photos]);
        setLastDate(res.lastDate);
        setLastPostId(res.lastPostId);
        setPostsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPostsLoading(false);
      });
  };

  const getAddress = (address: any) => {
    let res = "";

    if (address?.country) {
      res += address.country;
    }

    if (address?.state) {
      res += ", " + address.state;
    }

    if (address?.city) {
      res += ", " + address.city;
    }

    if (address?.address_line) {
      res += ", " + address.address_line;
    }

    return res ? res.trim() : "-";
  };

  if (pageLoading) {
    return (
      <>
        <div className="tw-flex tw-gap-5">
          <Skeleton className="!tw-w-[150px] !tw-h-[150px] tw-rounded-[50%]" />
          <div className=" tw-h-full tw-flex-grow">
            <Skeleton className="!tw-h-full" />
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return <NotFoundMessage message="User Not Found" />;
  }

  return (
    <>
      {/* Basic Info */}
      <div>
        <div className="tw-flex tw-w-full tw-flex-col sm:tw-flex-row">
          <div
            className="tw-pr-2 tw-bg-[var(--primary-color)] sm:tw-bg-transparent"
            style={{ borderRight: "4px solid var(--primary-color)" }}
          >
            <img
              src={formatResourceURL(profile.profile_img)}
              onError={handleProfileImageError}
              alt=""
              className="tw-rounded-[50%]"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="tw-text-center text-muted">{"@" + profile.username}</div>
          </div>
          <div className="tw-flex tw-flex-col tw-w-full tw-px-2">
            <div className="tw-flex-grow tw-flex tw-flex-col md:tw-flex-row">
              <div className="tw-flex tw-flex-grow tw-flex-col">
                <div className={style.textContainer}>
                  <span className={style.label}>Full Name: </span>
                  <span>{getName(profile)}</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Email: </span>
                  <span>{profile.email ?? "-"}</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Contact Number: </span>
                  <span>{profile.contact_no ?? "-"}</span>
                </div>
                <div className={style.textContainer}>
                  <span className={style.label}>Joined On: </span>
                  <span>{getDate(profile.createdAt)}</span>
                </div>
              </div>
              <div className="tw-flex">
                <div className="tw-flex tw-flex-col tw-items-start md:tw-items-end">
                  <span className={style.label + " " + style.textContainer}>
                    Account Status:
                  </span>
                  <span className={style.label + " " + style.textContainer}>
                    Account Provider:
                  </span>
                  <span className={style.label + " " + style.textContainer}>
                    Account Completion:
                  </span>
                </div>
                <div className="tw-flex tw-flex-col tw-items-center">
                  <span className={style.textContainer}>
                    <Tag type={getStatusSeverity(profile.status ?? "")}>
                      active
                    </Tag>
                  </span>
                  <span className={style.textContainer}>
                    <ProfileProviders provider={profile.provider ?? ""} />
                  </span>
                  <span className={style.textContainer}>
                    <AccountCompletion
                      is_complete={profile?.is_complete ?? ""}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="tw-flex text-white">
              <div className={style.tab + " bg-primary"}>
                <span>{formatNumber(profile.posts_count)}</span>
                <span>Posts</span>
              </div>
              <div className={style.tab + " bg-primary"}>
                <span>{formatNumber(profile.followers_count)}</span>
                <span>Followers</span>
              </div>
              <div className={style.tab + " bg-primary"}>
                <span>{formatNumber(profile.following_count)}</span>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2">
          <span className={style.label}>Bio: </span>
          <span>{profile.bio}</span>
        </div>
        <div className="p-2">
          <span className={style.label}>Address: </span>
          <span>{getAddress(profile.address)}</span>
        </div>
        <div className="w-100 d-flex justify-content-center">
          <SocialMediaLinks social_links={profile.social_links} />
        </div>
      </div>

      {/* POSTS */}
      <div>
        <hr />
        <div className="tw-text-3xl tw-text-[#012970] tw-text-center">
          Posts
        </div>
        <hr />
        <section className="section tw-py-2">
          <div className="row">
            {posts.map((post: any, i: number) => (
              <div
                key={i}
                className="col-md-4"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("post/" + post._id)}
              >
                <div className="card">
                  <div className="card-body tw-h-[200px] !tw-p-0">
                    <img
                      src={
                        post.src ??
                        (post.media?.[0]?.type === "video"
                          ? defaultThumbnail
                          : defaultPost)
                      }
                      onError={handlePostImageError}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {post.media?.[0]?.type === "video" && <PlayBtn />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {!noMorePosts && !postsLoading && (
          <div className="tw-flex tw-justify-center">
            <button
              onClick={fetchPosts}
              className="btn btn-primary tw-w-full tw-max-w-[500px]"
            >
              <i className="bi bi-arrow-clockwise tw-mr-2 tw-text-lg"></i>
              <span>Show More</span>
            </button>
          </div>
        )}
        {postsLoading && <BlinkingLoadingCircles />}
      </div>
    </>
  );
}
