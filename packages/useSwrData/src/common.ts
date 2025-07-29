import type { SWRConfiguration } from "swr";
import type { PageInfo } from "./interface";

export const DEFAULT_PAGE: PageInfo = { pageNum: 1, pageSize: 10 };

export const SIMPLE_CONF: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 500
};
