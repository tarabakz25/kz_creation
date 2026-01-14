import CursorEffect from "~/components/gsap/cursorEffectCanvas";
import Shader from "~/components/shader";
import Header from "~/components/header";
import Footer from "~/components/footer";

import Logo from "~/assets/kz_creation.svg";

export default function IndexPage() {
  return (
    <>
      <div className="fixed inset-0 -z-10 w-full">
        <CursorEffect />
        <Shader />
      </div>

      <div className="flex flex-col items-center justify-between w-full min-h-screen">
        <Header variant="top" />

        <div className="flex-1 flex items-center justify-center">
          <img src={Logo.src} alt="KZ Creation Logo" />
        </div>

        <Footer variant="top" />
      </div>
    </>
  );
}
