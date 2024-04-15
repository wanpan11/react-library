import { memo } from "react";
import { Route, useLocation } from "react-router-dom";

const CacheWarp = memo(({ path, component }: { path: string; component: React.ReactElement }) => {
  const { pathname } = useLocation();
  return <div style={{ display: pathname === path ? "" : "none" }}>{component}</div>;
});
CacheWarp.displayName = "CacheWarp";

function cacheRoute(cachePath: string, path: string, component: React.ReactElement) {
  const node = <CacheWarp path={path} component={component} />;

  return (
    <>
      <Route path={cachePath} element={node} />
      <Route path={path} element={node} />
    </>
  );
}

export default cacheRoute;
