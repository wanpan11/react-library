export type SimpleKey = string | string[];

export type AnyObject = Record<string, any>;

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

/* ******************************* props ************************************  */
export interface BaseSwrProps<TData = any, TParams = any> {
  reqKey: SimpleKey;
  req: (params: TParams) => Promise<TData>;
  ready?: boolean;
  params?: TParams extends AnyObject ? Partial<TParams> : TParams;
  paging?: undefined;
  swrConfig?: import("swr").SWRConfiguration<TData>;
}
export interface PagingSwrProps<TData = any, TParams extends AnyObject = any> extends Omit<BaseSwrProps<TData, TParams>, "paging"> {
  paging: true;
  defaultPage?: PageInfo;
  defaultSearch?: Partial<TParams>;
}

/* ******************************* result ************************************  */
export interface BaseSwrResult<TData = any> {
  key: import("swr").Key;
  data?: TData;
  error: any;
  isLoading: boolean;
  refresh: import("swr").KeyedMutator<TData>;
}
export interface PagingSwrResult<TData = any, TParams extends AnyObject = any> extends BaseSwrResult<TData> {
  pageInfo: PageInfo;
  searchInfo?: Partial<TParams> | undefined;
  onSearch: (value: Partial<TParams> | undefined) => void;
  setPage: import("react").Dispatch<import("react").SetStateAction<PageInfo>>;
  setSearch: import("react").Dispatch<import("react").SetStateAction<Partial<TParams> | undefined>>;
}
