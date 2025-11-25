import { useEffect, useState } from "react";

const useHasHydrated = (): boolean => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export default useHasHydrated;
