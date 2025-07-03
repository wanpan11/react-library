type SimpleKey = string | any[];
type SearchType<P> = P extends object ? Partial<P> : P;
interface PageType {
  pageNum: number;
  pageSize: number;
}

interface UseSwrDataFullProps<P = any, R = any> {
  reqKey: SimpleKey; // 请求的 key 可以是字符串或数组
  req: (params: P) => Promise<R>; // 请求函数 返回 Promise<AxiosRes<R>>
  ready?: boolean; // 是否准备就绪，默认为 true
  params?: SearchType<P>; // 受控请求参数 受控
  // paging 相关配置
  paging?: boolean; // 是否分页，默认为 false
  defaultPage?: PageType; // 默认分页信息 非受控
  defaultSearch?: SearchType<P>; // 默认搜索信息 非受控
  // swr 配置项
  swrConfig?: import("swr").SWRConfiguration<R, any>;
}
type UseSwrDataProps<P = any, R = any> = Omit<UseSwrDataFullProps<P, R>, "paging" | "defaultPage" | "defaultSearch">;

interface UseSwrData<R = any> {
  data?: R;
  error: any;
  isLoading: boolean;
  refresh: import("swr").KeyedMutator<R>;
}
interface UseSwrPagIngDataPage<P = any, R = any> extends UseSwrData<R> {
  pageInfo: PageType;
  searchInfo?: SearchType<P>;
  onSearch: (value: SearchType<P>) => void;
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
  setSearch: React.Dispatch<React.SetStateAction<SearchType<P> | undefined>>;
}
