import { memo } from "react";
import { useLocation } from "react-router-dom";

const CacheWarp = memo(({ path, component }: { path: string; component: React.ReactElement }) => {
  const { pathname } = useLocation();
  return <div style={{ display: pathname === path ? "" : "none" }}>{component}</div>;
});

export default CacheWarp;
