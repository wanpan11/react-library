import { createContainer } from "@pak/index";

const containerStore = createContainer<{
  name: string;
  age: number;
}>({
  name: "init",
  age: 0,
});

export default containerStore;
