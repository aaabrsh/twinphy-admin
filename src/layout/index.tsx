import { ReactNode, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import BreadCrumb from "./BreadCrumb";
import { main } from "./main";

export function Layout({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: any;
}) {
  useEffect(() => {
    main();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        {breadcrumb && <BreadCrumb data={breadcrumb} />}
        {/* <!-- End Page Title --> */}

        <section className="section dashboard">
          <div className="row">{children}</div>
        </section>
      </main>
      <Footer />
      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}
