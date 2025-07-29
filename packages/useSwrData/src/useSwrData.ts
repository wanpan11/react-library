import type { Key } from "swr";
import type { AnyObject, BaseSwrProps, BaseSwrResult, PagingSwrProps, PagingSwrResult, SimpleKey } from "./interface";
import { useCallback, useMemo, useState } from "react";
import useSwr from "swr";
import { DEFAULT_PAGE, SIMPLE_CONF } from "./common";

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
    return swrConfig || (simple ? SIMPLE_CONF : { revalidateOnFocus: false });
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
