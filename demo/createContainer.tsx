import createContainer from "@pak/createContainer";

interface Store {
  name: string;
  age: number;
}
const containerStore = createContainer<Store>({
  name: "init",
  age: 0,
});

const Test_1 = () => {
  const [store, setState] = containerStore.useContainer(state => [state.name]);
  console.log("render ===> Test_1");

  return (
    <div>
      <span>Test_1_name：</span>
      <span>{store.name}</span>

      <button style={{ marginLeft: 10 }} onClick={() => setState({ ...store, name: "wanpan" })}>
        name = change
      </button>
    </div>
  );
};

const Test_2 = () => {
  const [store] = containerStore.useContainer(state => [state.age]);
  console.log("render ===> Test_2");

  return (
    <div>
      <span>Test_2_age：</span>
      <span>{store.age}</span>
    </div>
  );
};

const StoreTest = () => {
  return (
    <containerStore.Provider>
      <Test_1 />
      <Test_2 />
    </containerStore.Provider>
  );
};

export default StoreTest;
