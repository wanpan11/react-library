import type { ReactNode } from "react";
import { nanoid } from "nanoid";
import { createContext, use, useEffect, useRef, useState } from "react";
import { shallowEqual } from "shallow-equal";

interface Observer<S> {
  state: S;
  setState?: React.Dispatch<React.SetStateAction<S>>;
  readonly observers: Record<string, () => void>;
}

/**
 * 创建一个 contextStore 消费者会在订阅的属性变化后才会 rerender
 * @param initData 初始数据
 */
function createContainer<T>(initData: T) {
  const ObservableContext = createContext<Observer<T>>({
    state: { ...initData },
    setState: undefined,
    observers: {},
  });

  const Provider = function ({ children }: { children: ReactNode[] | ReactNode }) {
    // dispatch 更新 state
    const [state, setState] = useState(initData);

    // 创建一个稳定的 context value 不使用 react 的rerender
    const { current: observableValue } = useRef<Observer<T>>({
      state,
      setState,
      observers: {}, // 观察者
    });
    observableValue.state = state;
    observableValue.setState = setState;

    // state 更新 通知观察者 组件更新
    useEffect(() => {
      Object.keys(observableValue.observers).forEach(key => observableValue.observers[key]());
    });

    return <ObservableContext value={observableValue}>{children}</ObservableContext>;
  };

  const useContainer = function (setDep: (state: T) => any[]): [T, React.Dispatch<React.SetStateAction<T>>] {
    // 获取 context 值
    const observableValue = use<Observer<T>>(ObservableContext);

    // 创建强制更新方法
    const [newState, forceUpdate] = useState(observableValue.state);

    const depRef = useRef(setDep);
    const prevDepRef = useRef<any>([]); // 历史依赖

    // 创建观察者
    useEffect(() => {
      const key = nanoid();

      const observer = () => {
        const prev = prevDepRef.current;
        const cur = depRef.current(observableValue.state);

        // 通过浅比较，来判断依赖是否有变化
        if (!shallowEqual(prev, cur)) {
          forceUpdate(observableValue?.state); // 触发渲染
        }

        prevDepRef.current = cur;
      };
      observableValue.observers[key] = observer;

      return () => {
        delete observableValue.observers[key];
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [newState, observableValue.setState!];
  };

  return { Provider, useContainer };
}

export default createContainer;
