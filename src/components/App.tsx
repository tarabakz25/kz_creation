import { useState } from "react";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Modal from "~/components/modal";
import Logo from "~/assets/kz_creation.svg";

export default function App() {
  const [activeContent, setActiveContent] = useState<string | null>(null);

  return (
    <main
      id="main-content"
      className="w-full h-screen flex flex-col items-center justify-between"
    >
      <Header onNavigate={setActiveContent} />

      <Logo />

      <Modal
        contentType={activeContent}
        onClose={() => setActiveContent(null)}
      />

      <Footer />
    </main>
  );
}
