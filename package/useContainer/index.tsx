import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import { shallowEqual } from "shallow-equal";

interface ObservableContext {
  state: { name: string; age: string; setState: any };
  observers: Record<string, () => void>;
}
const initData = {
  state: { name: "init", age: "init", setState: "init" },
  observers: {},
};

function createContainer() {
  const IntrinsicContext = createContext<Record<string, any>>({}); // 有状态
  const ObservableContext = createContext<ObservableContext>(initData); // 无状态，通过 ref 来保存最新的数据

  const Provider = function ({
    children,
  }: {
    children: ReactElement[] | ReactElement;
  }) {
    // state
    const [state, setState] = useState({ name: "wanpan", age: "26" });

    // 通过 ref 关联 state，不会触发组件渲染
    const { current: observableValue } = useRef<ObservableContext>({
      state: { ...state, setState },
      observers: {},
    });

    observableValue.state = { ...state, setState };

    useEffect(() => {
      // 通知观察者
      Object.keys(observableValue.observers).forEach(key =>
        observableValue.observers[key]()
      );
    });

    return (
      <IntrinsicContext.Provider value={{ state, setState }}>
        <ObservableContext.Provider value={observableValue}>
          {children}
        </ObservableContext.Provider>
      </IntrinsicContext.Provider>
    );
  };

  const useContainer = function (_depCb: (state: any) => void) {
    const observableValue = useContext(ObservableContext);
    const [newState, forceUpdate] = useState(observableValue.state);

    const depCbRef = useRef(_depCb);
    const prevDepsRef = useRef<any>([]);

    useEffect(() => {
      const key = nanoid();
      const observer = () => {
        const prev = prevDepsRef.current;
        const cur = depCbRef.current(observableValue?.state);

        // 通过浅比较，来判断依赖是否有变化
        if (shallowEqual(prev, cur)) {
          forceUpdate(observableValue?.state); // 触发渲染
        }

        prevDepsRef.current = cur;
      };
      observableValue.observers[key] = observer;

      return () => {
        delete observableValue.observers[key];
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return newState;
  };

  return { Provider, useContainer };
}

const TestContext = createContainer();

export default TestContext;
