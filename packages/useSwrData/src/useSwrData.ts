import type { Key, SWRConfiguration } from "swr";
import type { AnyObject, BaseSwrProps, BaseSwrResult, PagingSwrProps, PagingSwrResult, SimpleKey } from "./interface";
import { useCallback, useMemo, useState } from "react";
import useSwr from "swr";
import { DEFAULT_PAGE, SIMPLE_CONF } from "./common";

/**
 * 基于SWR实现的数据获取hook，支持普通数据获取和分页数据获取两种模式。
 *
 * @template TData - 响应数据的类型
 * @template TParams - 请求参数的类型
 *
 * @param {BaseSwrProps<TData, TParams> | PagingSwrProps<TData, TParams>} props - 配置项
 * @param {string} props.reqKey - 请求的唯一标识key
 * @param {(params: TParams) => Promise<TData>} props.req - 数据请求函数
 * @param {TParams} [props.params] - 请求参数
 * @param {boolean} [props.ready] - 是否启用
 * @param {boolean} [props.simple] - 简单模式(不自动重新请求)
 * @param {boolean} [props.paging] - 分页模式
 * @param {SWRConfiguration} [props.swrConfig] - SWR配置项
 * @param {object} [props.defaultPage] - 默认分页信息(仅在 paging 模式时有效)
 * @param {Partial<TParams>} [props.defaultSearch] - 默认搜索条件(仅在 paging 模式时有效)
 *
 * @returns {BaseSwrResult<TData> | PagingSwrResult<TData, TParams>} 返回SWR数据结果
 * 对于普通模式返回：{key, data, error, isLoading, refresh}
 * 对于分页模式额外返回：{pageInfo, searchInfo, onSearch, setPage, setSearch}
 *
 * @example
 * // 普通数据获取
 * const { data, isLoading } = useSwrData({
 *   reqKey: 'getUserInfo',
 *   req: (params) => fetch('/api/user').then(res => res.json()),
 * });
 *
 * // 分页数据获取
 * const { data, pageInfo, setPage, onSearch } = useSwrData({
 *   reqKey: 'getUserList',
 *   req: (params) => fetch('/api/users?' + new URLSearchParams(params)).then(res => res.json()),
 *   paging: true,
 *   defaultPage: { page: 1, pageSize: 10 },
 * });
 */
function useSwrData<TData = any, TParams = any>(props: BaseSwrProps<TData, TParams>): BaseSwrResult<TData>;
function useSwrData<TData = any, TParams extends AnyObject = any>(props: PagingSwrProps<TData, TParams>): PagingSwrResult<TData, TParams>;

function useSwrData<TData = any, TParams extends AnyObject = any>(
  props: BaseSwrProps<TData, TParams> | PagingSwrProps<TData, TParams>
): BaseSwrResult<TData> | PagingSwrResult<TData, TParams> {
  const { reqKey, req, params, ready = true, simple = false, paging = false, swrConfig } = props;

  const defaultPage = "defaultPage" in props ? props.defaultPage || DEFAULT_PAGE : DEFAULT_PAGE;
  const defaultSearch = "defaultSearch" in props ? props.defaultSearch : undefined;

  const [pageInfo, setPage] = useState(defaultPage);
  const [searchInfo, setSearch] = useState<Partial<TParams> | undefined>(defaultSearch);

  const mergeKey: Key = useMemo(() => {
    if (ready === false) {
      return null;
    }

    let mergeParams: any = {};
    if (paging) {
      mergeParams = { ...pageInfo, ...searchInfo, ...params };
    }
    else {
      mergeParams = params;
    }

    return [reqKey, mergeParams];
  }, [pageInfo, paging, params, ready, reqKey, searchInfo]);

  const mergeConf = useMemo(() => {
    let base: SWRConfiguration = { revalidateOnFocus: false };

    if (swrConfig) {
      base = swrConfig;
    }

    if (simple) {
      base = { ...SIMPLE_CONF, ...base };
    }

    return base;
  }, [simple, swrConfig]);

  const { data, isLoading, error, mutate } = useSwr(
    mergeKey,
    async (data: [SimpleKey, TParams]) => {
      return req(data[1]);
    },
    mergeConf
  );

  const onSearch = useCallback(
    (value: Partial<TParams> | undefined) => {
      setSearch(value);
      setPage(defaultPage);
    },
    [defaultPage]
  );

  if (paging) {
    return {
      key: mergeKey,
      data,
      error,
      isLoading,
      refresh: mutate,
      pageInfo,
      searchInfo,
      onSearch,
      setPage,
      setSearch,
    };
  }
  else {
    return {
      key: mergeKey,
      data,
      error,
      isLoading,
      refresh: mutate,
    };
  }
}

export { useSwrData };
