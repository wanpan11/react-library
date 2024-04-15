import { useMemo, cloneElement } from "react";
import { Route, useLocation } from "react-router-dom";

function CacheRoute({ path, cachePath, children }: { path: string; cachePath: string; children: React.ReactElement }) {
  const { pathname } = useLocation();

  return useMemo(
    () =>
      !pathname.includes(cachePath) ? (
        <></>
      ) : (
        cloneElement(children, {
          style: { display: pathname !== path ? "none" : "" },
        })
      ),
    [children, cachePath, path, pathname],
  );
}

/**
 * @description  当前 pathname 与 path 模糊匹配时缓存组件, 当前 pathname 与 path 相同时展示组件
 * @param {string} path 需要展示的路径
 * @param {cachePath} path 需要开始缓存的路径
 * @param {component} component
 * @returns
 */
export const cacheRoute = ({ path, cachePath, component }: { path: string; cachePath: string; component: React.ReactElement }) => {
  const Component = (
    <CacheRoute path={path} cachePath={cachePath}>
      {component}
    </CacheRoute>
  );

  return (
    <>
      <Route path={path} element={Component} />
      <Route path={cachePath} element={Component} />
    </>
  );
};
