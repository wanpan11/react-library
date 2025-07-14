import { Route } from "react-router-dom";
import CacheWarp from "./CacheWarp";

/**
 * 缓存路由
 * @param cachePath 缓存路由
 * @param path 展示路由
 * @param component 组件
 */
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
