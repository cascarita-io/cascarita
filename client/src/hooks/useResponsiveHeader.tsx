import { useEffect, useState } from "react";

function useResponsiveHeader(headerDesktop: string[], headerMobile: string[]) {
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isDesktop = window.innerWidth >= 769;
      setHeaders(isDesktop ? headerDesktop : headerMobile);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return headers;
}

export default useResponsiveHeader;
