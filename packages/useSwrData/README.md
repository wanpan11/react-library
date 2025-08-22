# use-swr-data

[![npm version](https://badge.fury.io/js/@wanp%2Fuse-swr-data.svg)](https://badge.fury.io/js/@wanp%2Fuse-swr-data)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

基于 [SWR](https://swr.vercel.app/) 封装的数据请求 Hook，提供了更便捷的数据获取和分页管理功能。

## 目录

- [use-swr-data](#use-swr-data)
  - [目录](#目录)
  - [特性](#特性)
  - [安装](#安装)
  - [基础使用](#基础使用)
  - [简单模式](#简单模式)
  - [分页功能](#分页功能)
  - [API](#api)
    - [Props](#props)
      - [基础属性 (BaseSwrProps)](#基础属性-baseswrprops)
      - [分页属性 (PagingSwrProps)](#分页属性-pagingswrprops)
    - [返回值](#返回值)
      - [基础返回值 (BaseSwrResult)](#基础返回值-baseswrresult)
      - [分页返回值 (PagingSwrResult)](#分页返回值-pagingswrresult)
  - [注意事项](#注意事项)
  - [贡献](#贡献)

## 特性

- 🚀 简单易用的数据请求接口
- 📑 内置分页管理功能
- 🔍 支持搜索条件管理
- 💫 继承 SWR 的所有特性（缓存、自动重新验证等）
- 🎯 完整的 TypeScript 支持
- ⚡ 自动去重和错误重试
- 🎛️ 灵活的配置选项
- 🔄 支持简单模式和分页模式

## 安装

```bash
npm install @wanp/use-swr-data
# 或
yarn add @wanp/use-swr-data
# 或
pnpm add @wanp/use-swr-data
```

## 基础使用

```typescript
import useSwrData from "@wanp/use-swr-data";

// 基础数据请求
const { data, error, isLoading, refresh } = useSwrData({
  reqKey: "unique-key",
  req: async (params) => {
    const response = await fetch("your-api-endpoint");
    return response.json();
  },
  params: {
    /* 可选的请求参数 */
  },
});
```

## 简单模式

启用 `simple` 选项可以禁用自动重新验证功能，适用于一次性数据获取：

```typescript
const { data, error, isLoading } = useSwrData({
  reqKey: "static-data",
  req: async () => {
    const response = await fetch("/api/config");
    return response.json();
  },
  simple: true, // 禁用自动重新验证
});
```

## 分页功能

```typescript
interface UserData {
  list: User[];
  total: number;
}

interface SearchParams {
  name?: string;
  age?: number;
}

const {
  data,
  error,
  isLoading,
  refresh,
  pageInfo,
  searchInfo,
  onSearch,
  setPage,
  setSearch,
} = useSwrData<UserData, SearchParams>({
  reqKey: "users",
  req: async (params) => {
    const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
    return response.json();
  },
  paging: true,
  defaultPage: {
    pageNum: 1,
    pageSize: 10,
  },
  defaultSearch: {
    name: "",
    age: undefined,
  },
});
```

## API

### Props

#### 基础属性 (BaseSwrProps)

| 属性      | 类型                                  | 必填 | 描述                               |
| --------- | ------------------------------------- | ---- | ---------------------------------- |
| reqKey    | `string \| string[]`                  | 是   | 请求的唯一标识                     |
| req       | `(params: TParams) => Promise<TData>` | 是   | 数据请求函数                       |
| ready     | `boolean`                             | 否   | 是否准备好发起请求，默认为 true    |
| simple    | `boolean`                             | 否   | 禁用自动发送验证请求，默认为 false |
| params    | `TParams \| Partial<TParams>`         | 否   | 受控请求参数                       |
| swrConfig | `SWRConfiguration`                    | 否   | SWR 配置项                         |

#### 分页属性 (PagingSwrProps)

继承基础属性，额外包含：

| 属性          | 类型               | 必填 | 描述         |
| ------------- | ------------------ | ---- | ------------ |
| paging        | `true`             | 是   | 启用分页功能 |
| defaultPage   | `PageInfo`         | 否   | 默认分页信息 |
| defaultSearch | `Partial<TParams>` | 否   | 默认搜索条件 |

### 返回值

#### 基础返回值 (BaseSwrResult)

| 属性      | 类型                  | 描述               |
| --------- | --------------------- | ------------------ |
| key       | `Key`                 | 当前请求的唯一标识 |
| data      | `TData`               | 请求返回的数据     |
| error     | `any`                 | 请求错误信息       |
| isLoading | `boolean`             | 是否正在加载       |
| refresh   | `KeyedMutator<TData>` | 手动刷新数据的方法 |

#### 分页返回值 (PagingSwrResult)

继承基础返回值，额外包含：

| 属性       | 类型                                 | 描述                         |
| ---------- | ------------------------------------ | ---------------------------- |
| pageInfo   | `PageInfo`                           | 当前分页信息                 |
| searchInfo | `Partial<TParams>`                   | 当前搜索条件                 |
| onSearch   | `(value: Partial<TParams>) => void`  | 搜索方法，会重置页码到第一页 |
| setPage    | `(page: PageInfo) => void`           | 更新分页信息                 |
| setSearch  | `(search: Partial<TParams>) => void` | 更新搜索条件                 |

## 注意事项

1. **分页模式**：`pageInfo` 和 `searchInfo` 的变更都会触发新的请求
2. **搜索重置**：`onSearch` 方法会自动重置页码到第一页
3. **默认配置**：默认禁用了 SWR 的 `revalidateOnFocus` 功能，可通过 `swrConfig` 开启
4. **简单模式**：启用 `simple` 时会禁用自动重新验证，适合静态数据获取
5. **类型安全**：分页模式下的 `TParams` 必须继承 `AnyObject` 类型
6. **依赖项**：本包依赖 React 和 SWR

## 贡献

欢迎提交 issues 和 pull requests 来改进这个项目。
