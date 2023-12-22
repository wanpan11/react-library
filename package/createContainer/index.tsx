import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { nanoid } from "nanoid";
import { shallowEqual } from "shallow-equal";

interface Observer<S, D = any> {
  state: S & { dataChange: D };
  observers: Record<string, () => void>;
}

function createContainer<T>(initData: T) {
  // 创建 context
  const ObservableContext = createContext<Observer<T>>({
    state: { ...initData, dataChange: null },
    observers: {},
  });

  const Provider = function ({
    children,
  }: {
    children: ReactNode[] | ReactNode;
  }) {
    // dispatch 更新 state
    const [state, setState] = useState(initData);

    // 创建一个稳定的 context value 不使用 react 的rerender
    const { current: observableValue } = useRef<
      Observer<T, React.Dispatch<React.SetStateAction<T>>>
    >({
      state: { ...state, dataChange: setState },
      observers: {}, // 观察者
    });
    observableValue.state = { ...state, dataChange: setState };

    // state 更新 通知观察者 组件更新
    useEffect(() => {
      Object.keys(observableValue.observers).forEach(key =>
        observableValue.observers[key]()
      );
    });

    return (
      <ObservableContext.Provider value={observableValue}>
        {children}
      </ObservableContext.Provider>
    );
  };

  const useContainer = function (_depCb: (state: T) => any[]) {
    // 获取 context 值
    const observableValue =
      useContext<Observer<T, React.Dispatch<React.SetStateAction<T>>>>(
        ObservableContext
      );

    // 创建强制更新方法
    const [newState, forceUpdate] = useState(observableValue.state);

    const depCbRef = useRef(_depCb);
    const prevDepsRef = useRef<any>([]); // 历史依赖

    // 创建观察者
    useEffect(() => {
      const key = nanoid();
      const observer = () => {
        const prev = prevDepsRef.current;
        const cur = depCbRef.current(observableValue.state);

        // 通过浅比较，来判断依赖是否有变化
        if (!shallowEqual(prev, cur)) {
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

export { createContainer };
