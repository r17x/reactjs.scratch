export interface ReactElement {
  type: string | Function;
  props: Record<string, any>;
  key: string | null;
  ref: any;
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