import { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate, Outlet } from "react-router-dom";
import { cacheRoute } from "@pak/index";
import containerStore from "./store";

const Test_1 = () => {
  const store = containerStore.useContainer(state => [state.name]);

  console.log("render ===> Test_1");

  return (
    <div>
      <span>Test_1_name：</span>
      <span>{store.name}</span>

      <button
        style={{ marginLeft: 10 }}
        onClick={() => {
          store.dataChange(draft => {
            return {
              ...draft,
              name: "change",
            };
          });
        }}
      >
        name = change
      </button>
    </div>
  );
};

const Test_2 = () => {
  const store = containerStore.useContainer(state => [state.age]);

  console.log("render ===> Test_2");

  return (
    <div>
      <span>Test_2：</span>
      <span>{store.age}</span>
    </div>
  );
};

const Test_3 = () => {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        go /
      </button>

      <button
        style={{ margin: "0 12px" }}
        onClick={() => {
          navigate("/cache");
        }}
      >
        go /cache
      </button>

      <Outlet />
    </>
  );
};

const Test_4 = () => {
  const [data, setData] = useState<any>(1);

  return (
    <div>
      <span>Test_4</span>
      <button style={{ margin: "10px" }} onClick={() => setData(data + 1)}>
        当前 data ：{data}
      </button>
    </div>
  );
};

const App = () => {
  return (
    <containerStore.Provider>
      <h1>CacheRoute</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Test_3 />}>
            {cacheRoute({
              path: "/cache",
              cachePath: "/",
              component: <Test_4 />,
            })}
          </Route>
        </Routes>
      </BrowserRouter>

      <h1>containerStore</h1>
      <Test_1 />
      <Test_2 />
    </containerStore.Provider>
  );
};

export default App;
