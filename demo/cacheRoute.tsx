import cacheRoute from "@pak/cacheRoute";
import { useState } from "react";
import { BrowserRouter, Routes, useNavigate } from "react-router-dom";

const Test_3 = () => {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/")}>缓存 /</button>
      <button onClick={() => navigate("show")} style={{ margin: "0 12px" }}>
        显示 /show
      </button>
    </>
  );
};

const Test_4 = () => {
  const [data, setData] = useState<any>(1);

  return (
    <div>
      <span>show</span>

      <button style={{ margin: "10px" }} onClick={() => setData(data + 1)}>
        当前 data ：{data}
      </button>
    </div>
  );
};

const CacheTest = () => {
  return (
    <BrowserRouter>
      <Test_3 />
      <Routes>{cacheRoute("/", "/show", <Test_4 />)}</Routes>
    </BrowserRouter>
  );
};

export default CacheTest;
