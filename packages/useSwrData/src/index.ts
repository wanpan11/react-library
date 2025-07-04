import type { Key } from "swr";
import useSwr from "swr";
import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PAGE } from "./common";

function useSwrData<R = any, P = any>(props: UseSwrDataFullProps<P, R> & { paging: true }): UseSwrPagIngDataPage<P, R>;
function useSwrData<R = any, P = any>(props: UseSwrDataProps<P, R> & { paging?: false }): UseSwrData<R>;

function useSwrData<R = any, P = any>(props: UseSwrDataFullProps<P, R>): UseSwrData<R> | UseSwrPagIngDataPage<P, R> {
  const { reqKey, req, params, ready = true, paging = false, defaultSearch, defaultPage = DEFAULT_PAGE, swrConfig } = props;

  const [pageInfo, setPage] = useState(defaultPage);
  const [searchInfo, setSearch] = useState(defaultSearch);

  const mergeKey: Key = useMemo(() => {
    if (ready === false) {
      return null;
    }

    let mergeParams: any = {};
    if (paging) {
      mergeParams = { ...pageInfo, ...searchInfo, ...params };
    } else {
      mergeParams = params;
    }

    return [reqKey, mergeParams];
  }, [pageInfo, paging, params, ready, reqKey, searchInfo]);

  const { data, isLoading, error, mutate } = useSwr(
    mergeKey,
    async (data: [SimpleKey, P]) => {
      return req(data[1]);
    },
    swrConfig || { revalidateOnFocus: false },
  );

  const onSearch = useCallback(
    (value: SearchType<P>) => {
      setSearch(value);
      setPage(defaultPage);
    },
    [defaultPage],
  );

  if (paging) {
    return {
      data: data,
      error,
      isLoading,
      refresh: mutate,
      pageInfo,
      searchInfo,
      onSearch,
      setPage,
      setSearch,
    };
  } else {
    return {
      data: data,
      error,
      isLoading,
      refresh: mutate,
    };
  }
}

export default useSwrData;
