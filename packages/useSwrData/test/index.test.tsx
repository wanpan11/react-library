import type { AnyObject, BaseSwrProps, BaseSwrResult, PagingSwrProps, PagingSwrResult } from "../src/interface";
import { fireEvent, render } from "@testing-library/react";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useSwrData from "../src/index";

interface ObjParams { name: string; age: number; type: string; value: string }
type NumParams = number;

const getResData = vi.fn(data => data);
const getReqParams = vi.fn(data => data);
function reSetMock() {
  getResData.mockReset();
  getReqParams.mockReset();
}

async function object(data: ObjParams) {
  return new Promise<ObjParams>((resolve) => {
    setTimeout(() => {
      getReqParams(data);
      resolve(data);
    }, 1000);
  });
}
async function num(data: NumParams) {
  return new Promise<NumParams>((resolve) => {
    setTimeout(() => {
      getReqParams(data);
      resolve(data);
    }, 1000);
  });
}

function TestDemo<P>(props: BaseSwrProps<P>) {
  const swrData = useSwrData(props);
  getResData(swrData);

  return (
    <div>
      <div>
        data:
        {JSON.stringify(swrData.data)}
      </div>
      <div>
        isLoading:
        {String(swrData.isLoading)}
      </div>
      <div>
        error:
        {String(swrData.error)}
      </div>
    </div>
  );
}
function TestDemoPaging<P extends AnyObject>(props: PagingSwrProps<P, P>) {
  const swrData = useSwrData(props);
  getResData(swrData);

  return (
    <div>
      <button
        type="button"
        className="page_btn"
        onClick={() => {
          swrData.setPage({ pageNum: swrData.pageInfo.pageNum + 1, pageSize: swrData.pageInfo.pageSize });
        }}
      />

      <button
        type="button"
        className="search_btn"
        onClick={() => {
          swrData.setSearch({ type: "search", value: "search" } as unknown as Partial<P>);
        }}
      />

      <button
        type="button"
        className="search_btn_1"
        onClick={() => {
          swrData.onSearch(undefined);
        }}
      />
    </div>
  );
}

describe("suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    reSetMock();
  });

  it("base params test", async () => {
    render(<TestDemo<NumParams> reqKey="base" req={num} params={1} />);
    await vi.advanceTimersByTimeAsync(2000);
    const res_1 = getResData.mock.calls.findLast(() => true)?.[0] as BaseSwrResult<any>;

    expect(res_1.key).toEqual(["base", 1]);
    expect(getReqParams).toHaveLastReturnedWith(1);
    reSetMock();

    /* 2 */
    render(<TestDemo<ObjParams> reqKey={["base", "array"]} req={object} params={{ type: "bae" }} />);
    await vi.advanceTimersByTimeAsync(2000);
    const res_2 = getResData.mock.calls.findLast(() => true)?.[0] as BaseSwrResult<any>;

    expect(res_2.key).toEqual([["base", "array"], { type: "bae" }]);
    expect(getReqParams).toHaveLastReturnedWith({ type: "bae" });
  });

  it("paging params test", async () => {
    const { rerender } = render(<TestDemoPaging<ObjParams> reqKey="paging" req={object} params={{ name: "test", age: 18 }} paging />);
    await vi.advanceTimersByTimeAsync(2000);
    const res_1 = getResData.mock.calls.findLast(() => true)?.[0] as PagingSwrResult;

    expect(res_1.key).toEqual(["paging", { pageNum: 1, pageSize: 10, name: "test", age: 18 }]);
    expect(getReqParams).toHaveLastReturnedWith({ name: "test", age: 18, pageNum: 1, pageSize: 10 });
    reSetMock();

    /* 2 */
    rerender(<TestDemoPaging<ObjParams> reqKey={["paging", "array"]} req={object} params={{ name: "ha-ha", age: 99 }} paging />);
    await vi.advanceTimersByTimeAsync(2000);
    const res_2 = getResData.mock.calls.findLast(() => true)?.[0] as PagingSwrResult;

    expect(res_2.key).toEqual([["paging", "array"], { name: "ha-ha", age: 99, pageNum: 1, pageSize: 10 }]);
    expect(getReqParams).toHaveLastReturnedWith({ name: "ha-ha", age: 99, pageNum: 1, pageSize: 10 });
  });

  it("pageChange test", async () => {
    const { container } = render(<TestDemoPaging<ObjParams> reqKey="paging" req={object} params={{ name: "test", age: 18 }} paging />);
    await vi.advanceTimersByTimeAsync(2000);

    fireEvent(container.querySelector(".page_btn")!, new MouseEvent("click", { bubbles: true }));
    const res_1 = getResData.mock.calls.findLast(() => true)?.[0] as PagingSwrResult;

    expect(res_1.pageInfo).toEqual({ pageNum: 2, pageSize: 10 });
  });

  it("search test", async () => {
    const { container, rerender } = render(<TestDemoPaging<ObjParams> reqKey="paging" req={object} params={{ name: "test", age: 18 }} paging />);
    await vi.advanceTimersByTimeAsync(2000);

    fireEvent(container.querySelector(".search_btn")!, new MouseEvent("click", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(2000);
    const res_1 = getResData.mock.calls.findLast(() => true)?.[0] as PagingSwrResult;
    expect(res_1.key).toEqual(["paging", { name: "test", age: 18, pageNum: 1, pageSize: 10, type: "search", value: "search" }]);
    expect(res_1.searchInfo).toEqual({ type: "search", value: "search" });
    expect(getReqParams).toHaveLastReturnedWith({ name: "test", age: 18, pageNum: 1, pageSize: 10, type: "search", value: "search" });
    reSetMock();

    /* 2 */
    rerender(<TestDemoPaging<ObjParams> reqKey="paging-2" req={object} params={{ name: "test", age: 18 }} defaultSearch={{ type: "defaultSearch" }} paging />);
    await vi.advanceTimersByTimeAsync(2000);

    fireEvent(container.querySelector(".search_btn_1")!, new MouseEvent("click", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(2000);
    const res_2 = getResData.mock.calls.findLast(() => true)?.[0] as PagingSwrResult;
    expect(res_2.key).toEqual(["paging-2", { name: "test", age: 18, pageNum: 1, pageSize: 10 }]);
    expect(res_2.searchInfo).toEqual(undefined);
    expect(getReqParams).toHaveLastReturnedWith({ name: "test", age: 18, pageNum: 1, pageSize: 10 });
  });
});
