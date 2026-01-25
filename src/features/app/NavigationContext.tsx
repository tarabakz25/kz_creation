import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface NavigationContextType {
  navigateTo: (url: string) => void;
  currentPath: string;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname || "/";
  });

  // ブラウザの戻る/進むボタン対応
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      // ScrollSmootherをリフレッシュしてスクロール位置をリセット
      ScrollTrigger.refresh();
      window.dispatchEvent(new CustomEvent("spa-navigation"));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = useCallback((url: string) => {
    if (url === currentPath) return;

    window.history.pushState({}, "", url);
    setCurrentPath(url);

    // ScrollSmootherをリフレッシュしてスクロール位置をリセット
    ScrollTrigger.refresh();
    window.dispatchEvent(new CustomEvent("spa-navigation"));
  }, [currentPath]);

  return (
    <NavigationContext.Provider value={{ navigateTo, currentPath }}>
      {children}
    </NavigationContext.Provider>
  );
}
