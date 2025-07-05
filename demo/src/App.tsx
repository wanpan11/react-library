import StoreTest from "./createContainer";
import CacheTest from "./cacheRoute";

const App = () => {
  return (
    <>
      <h1>cacheRoute</h1>
      <CacheTest />

      <hr />

      <h1>containerStore</h1>
      <StoreTest />
    </>
  );
};

export default App;
