import cacheRoute from "@pak/cacheRoute";
import { useState } from "react";
import { BrowserRouter, Routes, useNavigate } from "react-router-dom";

const Test_1 = () => {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/")}>cachePage /</button>

      <button onClick={() => navigate("cache")} style={{ margin: "0 12px" }}>
        otherPage /cache
      </button>
    </>
  );
};

const Test_2 = () => {
  const [data, setData] = useState<any>(1);

  return (
    <div>
      <span>cachePage</span>

      <button style={{ margin: "10px" }} onClick={() => setData(data + 1)}>
        当前 data ：{data}
      </button>
    </div>
  );
};

const CacheTest = () => {
  return (
    <BrowserRouter>
      <Test_1 />
      <Routes>{cacheRoute("/cache", "/", <Test_2 />)}</Routes>
    </BrowserRouter>
  );
};

export default CacheTest;
