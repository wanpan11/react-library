import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestContext from "@pak/useContainer";
import CacheRoute from "@pak/CacheRoute";

const Test_1 = () => {
  const store = TestContext.useContainer(state => [state.name]);

  useEffect(() => {
    store.setState((draft: any) => {
      return { ...draft, name: "mm" };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("name ===> Test_1");

  return (
    <div>
      <span>Test_1：</span>
      <span>{store.name}</span>
    </div>
  );
};

const Test_2 = () => {
  const store = TestContext.useContainer(state => [state.age]);

  console.log("name ===> Test_2");

  return (
    <div>
      <span>Test_2：</span>
      <span>{store.age}</span>
    </div>
  );
};

const App = () => {
  return (
    <TestContext.Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>home</div>} />

          <CacheRoute
            path="/"
            render={() => {
              return <div>CacheRoute</div>;
            }}
          />
        </Routes>
      </BrowserRouter>

      <Test_1 />
      <Test_2 />
    </TestContext.Provider>
  );
};

export default App;
