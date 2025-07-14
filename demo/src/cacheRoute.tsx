import cacheRoute from "cache-route";
import { useState } from "react";
import { BrowserRouter, Routes, useNavigate } from "react-router-dom";

function Test_1() {
  const navigate = useNavigate();
  return (
    <>
      <button type="button" onClick={() => navigate("/")}>cachePage /</button>

      <button type="button" onClick={() => navigate("cache")} style={{ margin: "0 12px" }}>
        otherPage /cache
      </button>
    </>
  );
}

function Test_2() {
  const [data, setData] = useState<any>(1);

  return (
    <div>
      <span>cachePage</span>

      <button style={{ margin: "10px" }} type="button" onClick={() => setData(data + 1)}>
        当前 data ：
        {data}
      </button>
    </div>
  );
}

function CacheTest() {
  return (
    <BrowserRouter>
      <Test_1 />
      <Routes>{cacheRoute("/cache", "/", <Test_2 />)}</Routes>
    </BrowserRouter>
  );
}

export default CacheTest;
