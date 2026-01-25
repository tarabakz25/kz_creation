import { AnimatePresence, motion } from "motion/react";
import { NavigationProvider, useNavigation } from "./NavigationContext";
import { useFirstVisitLoading } from "~/shared/hooks/useFirstVisitLoading";
import IndexPage from "~/features/index";
import AboutPage from "~/features/about";
import LabPage from "~/features/lab";
import ContactPage from "~/features/contact";

// ルート定義
const routes: Record<string, React.ComponentType> = {
  "/": IndexPage,
  "/about": AboutPage,
  "/lab": LabPage,
  "/contact": ContactPage,
};

function AppContent() {
  const { currentPath } = useNavigation();

  const CurrentPage = routes[currentPath] || routes["/"];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPath}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <CurrentPage />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useFirstVisitLoading();

  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
