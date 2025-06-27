export interface ReactElement {
  type: string | Function;
  props: Record<string, any>;
  key: string | null;
  ref: any;
}

type SetStateAction<T> = T | ((prevState: T) => T);
type StateUpdater<T> = (action: SetStateAction<T>) => void;

interface HookState {
  state: any;
  queue: Array<SetStateAction<any>>;
  setState?: StateUpdater<any>;
}

let currentComponent: ComponentInstance | null = null;
let currentHookIndex = 0;

interface ComponentInstance {
  hooks: HookState[];
  forceUpdate: () => void;
}

export function createElement(
  type: string | Function,
  props?: Record<string, any> | null,
  ...children: any[]
): ReactElement {
  const normalizedProps = props || {};
  
  const { key = null, ref = null, ...restProps } = normalizedProps;
  
  const element: ReactElement = {
    type,
    props: {
      ...restProps,
      children: children.length === 0 ? undefined : 
                children.length === 1 ? children[0] : 
                children
    },
    key: key ? String(key) : null,
    ref: ref || null
  };

  return element;
}

export function useState<T>(initialState: T | (() => T)): [T, StateUpdater<T>] {
  if (!currentComponent) {
    throw new Error('useState can only be called within a component');
  }

  const hookIndex = currentHookIndex++;
  const component = currentComponent;

  if (!component.hooks[hookIndex]) {
    const state = typeof initialState === 'function' 
      ? (initialState as () => T)() 
      : initialState;
    
    const setState: StateUpdater<T> = (action) => {
      // Get the current state value at update time, not from closure
      const currentState = component.hooks[hookIndex].state;
      const nextState = typeof action === 'function' 
        ? (action as (prevState: T) => T)(currentState)
        : action;

      if (Object.is(nextState, currentState)) {
        return;
      }

      component.hooks[hookIndex].state = nextState;
      component.forceUpdate();
    };

    component.hooks[hookIndex] = {
      state,
      queue: [],
      setState
    };
  }

  const hook = component.hooks[hookIndex];
  return [hook.state, hook.setState as StateUpdater<T>];
}

export function __setCurrentComponent(component: ComponentInstance | null) {
  currentComponent = component;
  currentHookIndex = 0;
}