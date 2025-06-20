import { ReactElement, __setCurrentComponent } from '../../react';

interface ComponentInstance {
  hooks: Array<{ state: any; queue: Array<any>; setState?: any }>;
  forceUpdate: () => void;
  component?: Function;
  props?: any;
  container?: Element;
}

export interface Root {
  render(element: ReactElement | string | number | null | undefined): void;
  unmount(): void;
}

export interface CreateRootOptions {
  onCaughtError?: (error: Error, errorInfo: any) => void;
  onUncaughtError?: (error: Error, errorInfo: any) => void;
  onRecoverableError?: (error: Error, errorInfo: any) => void;
  identifierPrefix?: string;
}

const componentInstances = new Map<string, ComponentInstance>();
let componentIdCounter = 0;

function renderElement(element: any, container: Element): void {
  if (element === null || element === undefined || typeof element === 'boolean') {
    return;
  }

  if (typeof element === 'string' || typeof element === 'number') {
    const textNode = document.createTextNode(String(element));
    container.appendChild(textNode);
    return;
  }

  if (Array.isArray(element)) {
    element.forEach(child => renderElement(child, container));
    return;
  }

  if (typeof element === 'object' && element.type) {
    const { type, props } = element;
    
    if (typeof type === 'string') {
      const domElement = document.createElement(type);
      
      if (props) {
        Object.keys(props).forEach(propName => {
          if (propName === 'children') {
            const children = props.children;
            if (children !== undefined) {
              if (Array.isArray(children)) {
                children.forEach(child => renderElement(child, domElement));
              } else {
                renderElement(children, domElement);
              }
            }
          } else if (propName.startsWith('on') && typeof props[propName] === 'function') {
            const eventName = propName.toLowerCase().substring(2);
            domElement.addEventListener(eventName, props[propName]);
          } else if (propName === 'style' && typeof props[propName] === 'object') {
            Object.assign(domElement.style, props[propName]);
          } else if (propName === 'className') {
            domElement.className = props[propName];
          } else if (typeof props[propName] !== 'object' && typeof props[propName] !== 'function') {
            domElement.setAttribute(propName, String(props[propName]));
          }
        });
      }
      
      container.appendChild(domElement);
    } else if (typeof type === 'function') {
      // Create a unique identifier for this component instance location
      const componentId = `${type.name || 'Anonymous'}_${componentIdCounter++}`;
      
      // Create a dedicated container for this component
      const componentContainer = document.createElement('div');
      componentContainer.setAttribute('data-component-id', componentId);
      componentContainer.style.display = 'contents'; // Make wrapper invisible in layout
      
      const componentInstance: ComponentInstance = {
        hooks: [],
        component: type,
        props: props,
        container: componentContainer,
        forceUpdate: () => {
          // Re-render only this component in its dedicated container
          componentContainer.innerHTML = '';
          __setCurrentComponent(componentInstance);
          const componentResult = type(componentInstance.props);
          __setCurrentComponent(null);
          renderElement(componentResult, componentContainer);
        }
      };
      
      componentInstances.set(componentId, componentInstance);
      
      // Initial render
      __setCurrentComponent(componentInstance);
      const componentResult = type(props);
      __setCurrentComponent(null);
      renderElement(componentResult, componentContainer);
      
      // Add the component container to the parent
      container.appendChild(componentContainer);
    }
  }
}

export function createRoot(domNode: Element, options?: CreateRootOptions): Root {
  let isUnmounted = false;

  const root: Root = {
    render(element: ReactElement | string | number | null | undefined): void {
      if (isUnmounted) {
        console.error('Cannot render on an unmounted root');
        return;
      }

      domNode.innerHTML = '';
      
      try {
        renderElement(element, domNode);
      } catch (error) {
        if (options?.onUncaughtError) {
          options.onUncaughtError(error as Error, {});
        } else {
          throw error;
        }
      }
    },

    unmount(): void {
      if (isUnmounted) {
        return;
      }
      
      domNode.innerHTML = '';
      isUnmounted = true;
    }
  };

  return root;
}