import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./social-media-btns.style.css";

export default function SocialMediaLinks({
  social_links,
}: {
  social_links: any;
}) {
  return (
    <>
      <Swiper
        className="overflow-hidden"
        spaceBetween={"0px"}
        slidesPerView={"auto"}
        style={{ padding: "10px" }}
      >
        {social_links?.facebook && (
          <SwiperSlide style={{ width: "60px" }}>
            <a
              href={social_links.facebook}
              target="_blank"
              className="mb-2 me-2 btn-social btn btn-icon btn-facebook"
            >
              <i style={{ lineHeight: "0px" }} className="bi bi-facebook"></i>
            </a>
          </SwiperSlide>
        )}
        {social_links?.instagram && (
          <SwiperSlide style={{ width: "60px" }}>
            <a
              href={social_links.instagram}
              target="_blank"
              className="mb-2 me-2 btn-social btn btn-icon btn-instagram"
            >
              <i style={{ lineHeight: "0px" }} className="bi bi-instagram"></i>
            </a>
          </SwiperSlide>
        )}
        {social_links?.twitter && (
          <SwiperSlide style={{ width: "60px" }}>
            <a
              href={social_links.twitter}
              target="_blank"
              className="mb-2 me-2 btn-social btn btn-icon btn-twitter"
            >
              <i style={{ lineHeight: "0px" }} className="bi bi-twitter"></i>
            </a>
          </SwiperSlide>
        )}
        {social_links?.snapchat && (
          <SwiperSlide style={{ width: "60px" }}>
            <a
              href={social_links.snapchat}
              target="_blank"
              className="mb-2 me-2 btn-social btn btn-icon btn-snapchat"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg
                className="btn-snapchat-svg"
                xmlns="http://www.w3.org/2000/svg"
                stroke="black"
              >
                <path
                  d="M21.79755,16.98718c-2.86621-.47223-4.15094-3.40149-4.204-3.52588l-.00544-.01172a1.07048,1.07048,0,0,1-.10223-.89758c.19251-.45361.82935-.6557,1.25134-.78967.10535-.03339.205-.065.28315-.096.76275-.30127.91784-.61316.91406-.8219a.66226.66226,0,0,0-.50134-.54358l-.00568-.00213a.9462.9462,0,0,0-.35632-.06824.7546.7546,0,0,0-.31287.06207,2.54,2.54,0,0,1-.95526.26612.82134.82134,0,0,1-.52954-.17725c.00915-.16992.02-.34522.0318-.53046l.004-.0653a10.10231,10.10231,0,0,0-.24091-4.03449,5.2482,5.2482,0,0,0-4.87311-3.1394q-.20114.0021-.4024.00378A5.23959,5.23959,0,0,0,6.92853,5.75293,10.08988,10.08988,0,0,0,6.68726,9.784q.01941.29872.036.59771a.8483.8483,0,0,1-.5838.17841,2.45322,2.45322,0,0,1-1.014-.26776.57538.57538,0,0,0-.2453-.04895.83387.83387,0,0,0-.81061.53265c-.08191.43061.5329.74256.90668.8902.079.03137.17822.0628.28308.096.42169.13385,1.05908.33606,1.25152.78985a1.07171,1.07171,0,0,1-.10223.89783l-.00537.01154a7.02828,7.02828,0,0,1-1.06915,1.66211,5.21488,5.21488,0,0,1-3.13483,1.86389.23978.23978,0,0,0-.20044.25006.38046.38046,0,0,0,.031.12964c.17578.41113,1.05822.75061,2.55182.981.13964.02161.19873.24927.28027.6222.03259.14929.06634.30426.1134.46423a.29261.29261,0,0,0,.31922.22876,2.48528,2.48528,0,0,0,.42492-.06091,5.52912,5.52912,0,0,1,1.12036-.12677,4.95367,4.95367,0,0,1,.8078.0683,3.87725,3.87725,0,0,1,1.535.78417,4.443,4.443,0,0,0,2.6897,1.06006c.03375,0,.06744-.00122.10009-.004.04114.00195.09522.004.15192.004a4.44795,4.44795,0,0,0,2.69122-1.06079,3.87269,3.87269,0,0,1,1.53351-.78332,4.97275,4.97275,0,0,1,.808-.0683,5.59252,5.59252,0,0,1,1.12037.11871,2.39142,2.39142,0,0,0,.425.05371h.02338a.279.279,0,0,0,.29547-.221c.04645-.15784.08045-.308.11389-.46131.08081-.371.1399-.59759.28009-.61926,1.494-.23078,2.37641-.56976,2.551-.97858a.38487.38487,0,0,0,.03174-.13086A.24.24,0,0,0,21.79755,16.98718Z"
                  fill="white"
                ></path>
              </svg>
            </a>
          </SwiperSlide>
        )}
        {social_links?.linkedin && (
          <SwiperSlide style={{ width: "60px" }}>
            <a
              href={social_links.linkedin}
              target="_blank"
              className="mb-2 me-2 btn-social btn btn-icon btn-linkedin"
            >
              <i style={{ lineHeight: "0px" }} className="bi bi-linkedin"></i>
            </a>
          </SwiperSlide>
        )}
        {social_links?.whatsapp && (
          <SwiperSlide style={{ width: "60px" }}>
            <a
              href={social_links.whatsapp}
              target="_blank"
              className="mb-2 me-2 btn-social btn btn-icon btn-whatsapp"
            >
              <i style={{ lineHeight: "0px" }} className="bi bi-whatsapp"></i>
            </a>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
}
