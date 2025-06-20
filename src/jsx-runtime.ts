import { createElement } from './react';

export function jsx(type: any, props: any, key?: string | number) {
  const { children, ...restProps } = props || {};
  
  if (key !== undefined) {
    restProps.key = key;
  }
  
  if (children !== undefined) {
    if (Array.isArray(children)) {
      return createElement(type, restProps, ...children);
    } else {
      return createElement(type, restProps, children);
    }
  }
  
  return createElement(type, restProps);
}

export const jsxs = jsx;
export const jsxDEV = jsx;