import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import useSwrData from "../src/index";
import { afterEach } from "node:test";

type ObjParams = { name: string; age: number };
type NumParams = number;

const getReqParams = vi.fn(data => data);

function object(data: ObjParams) {
  return new Promise<ObjParams>(resolve => {
    setTimeout(() => {
      getReqParams(data);
      resolve(data);
    }, 1000);
  });
}
function num(data: NumParams) {
  return new Promise<NumParams>(resolve => {
    setTimeout(() => {
      getReqParams(data);
      resolve(data);
    }, 1000);
  });
}

function TestDemo<P>({ reqKey, req, params }: UseSwrDataProps<P>) {
  const { data, isLoading, error } = useSwrData({ reqKey, req, params });

  return (
    <div>
      <div>data: {JSON.stringify(data)}</div>
      <div>isLoading: {String(isLoading)}</div>
      <div>error: {String(error)}</div>
    </div>
  );
}
function TestDemoPaging<P>({ reqKey, req, params }: UseSwrDataFullProps<P>) {
  const { data, isLoading, error } = useSwrData({ reqKey, req, params, paging: true });

  return (
    <div>
      <div>data: {JSON.stringify(data)}</div>
      <div>isLoading: {String(isLoading)}</div>
      <div>error: {String(error)}</div>
    </div>
  );
}

describe("suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("obj params test", async () => {
    render(<TestDemo<ObjParams> reqKey={"obj-test"} req={object} params={{ name: "test", age: 18 }} />);

    await vi.advanceTimersByTimeAsync(2000);
    expect(getReqParams).toHaveReturnedWith({ name: "test", age: 18 });
  });

  it("num params test", async () => {
    render(<TestDemo<NumParams> reqKey={"num-test"} req={num} params={1} />);

    await vi.advanceTimersByTimeAsync(2000);
    expect(getReqParams).toHaveReturnedWith(1);
  });

  it("reqKey is array test", async () => {
    render(<TestDemo<NumParams> reqKey={["num-test", "2222"]} req={num} params={1} />);

    await vi.advanceTimersByTimeAsync(2000);
    expect(getReqParams).toHaveReturnedWith(1);
  });

  it("Paging test", async () => {
    render(<TestDemoPaging<NumParams> reqKey={["num-test", "2222"]} req={num} params={1} />);

    await vi.advanceTimersByTimeAsync(2000);
    expect(getReqParams).toHaveReturnedWith(1);
  });
});
