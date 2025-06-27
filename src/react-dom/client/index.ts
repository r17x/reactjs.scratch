import { ReactElement, __setCurrentComponent } from '../../react';

interface SyntheticEvent {
  target: EventTarget;
  currentTarget: EventTarget;
  preventDefault(): void;
  stopPropagation(): void;
  nativeEvent: Event;
  type: string;
  timeStamp: number;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
}

interface InputState {
  element: HTMLInputElement;
  value: string;
  selectionStart: number | null;
  selectionEnd: number | null;
  focused: boolean;
}

interface ComponentInstance {
  hooks: Array<{ state: any; queue: Array<any>; setState?: any }>;
  forceUpdate: () => void;
  component?: Function;
  props?: any;
  container?: Element;
  previousRender?: any;
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

// Event delegation system
const eventDelegationMap = new Map<Element, Map<string, Set<{ element: Element; handler: Function }>>>();
const normalizedEventMap = new Map<string, string>([
  ['onInput', 'input'],
  ['onChange', 'change'],
  ['onClick', 'click'],
  ['onFocus', 'focus'],
  ['onBlur', 'blur'],
  ['onSubmit', 'submit'],
  ['onKeyDown', 'keydown'],
  ['onKeyUp', 'keyup'],
  ['onMouseDown', 'mousedown'],
  ['onMouseUp', 'mouseup'],
  ['onMouseOver', 'mouseover'],
  ['onMouseOut', 'mouseout']
]);

function createSyntheticEvent(nativeEvent: Event): SyntheticEvent {
  // Preserve event properties in closure to prevent them from becoming invalid
  const target = nativeEvent.target;
  const currentTarget = nativeEvent.currentTarget;
  
  return {
    target: target!,
    currentTarget: currentTarget!,
    preventDefault: () => nativeEvent.preventDefault(),
    stopPropagation: () => nativeEvent.stopPropagation(),
    nativeEvent: nativeEvent,
    type: nativeEvent.type,
    timeStamp: nativeEvent.timeStamp,
    bubbles: nativeEvent.bubbles,
    cancelable: nativeEvent.cancelable,
    defaultPrevented: nativeEvent.defaultPrevented
  };
}

function setupEventDelegation(container: Element, eventType: string): void {
  if (!eventDelegationMap.has(container)) {
    eventDelegationMap.set(container, new Map());
  }
  
  const containerEvents = eventDelegationMap.get(container)!;
  if (!containerEvents.has(eventType)) {
    containerEvents.set(eventType, new Set());
    
    // Add single event listener to container for this event type
    container.addEventListener(eventType, (nativeEvent: Event) => {
      const handlers = containerEvents.get(eventType);
      if (handlers) {
        const target = nativeEvent.target as Element;
        
        // Find handlers for this target or its ancestors
        for (const { element, handler } of handlers) {
          if (element === target || element.contains(target)) {
            const syntheticEvent = createSyntheticEvent(nativeEvent);
            handler(syntheticEvent);
            
            // Stop after first matching handler (most specific)
            break;
          }
        }
      }
    });
  }
}

function addEventHandler(container: Element, element: Element, eventType: string, handler: Function): void {
  setupEventDelegation(container, eventType);
  const containerEvents = eventDelegationMap.get(container)!;
  const handlers = containerEvents.get(eventType)!;
  handlers.add({ element, handler });
}

function removeEventHandler(container: Element, element: Element, eventType: string, handler: Function): void {
  const containerEvents = eventDelegationMap.get(container);
  if (containerEvents) {
    const handlers = containerEvents.get(eventType);
    if (handlers) {
      // Find and remove the specific handler
      for (const handlerObj of handlers) {
        if (handlerObj.element === element && handlerObj.handler === handler) {
          handlers.delete(handlerObj);
          break;
        }
      }
    }
  }
}

function findRootContainer(element: Element): Element {
  // Find the root container (component container or root DOM node)
  let current = element;
  while (current.parentElement) {
    if (current.hasAttribute('data-component-id') || current.parentElement === document.body) {
      return current;
    }
    current = current.parentElement;
  }
  return current;
}

function captureInputStates(container: Element): InputState[] {
  const inputStates: InputState[] = [];
  const inputs = container.querySelectorAll('input');
  
  inputs.forEach(input => {
    if (input instanceof HTMLInputElement) {
      inputStates.push({
        element: input,
        value: input.value,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
        focused: document.activeElement === input
      });
    }
  });
  
  return inputStates;
}

function restoreInputStates(container: Element, savedStates: InputState[]): void {
  const inputs = container.querySelectorAll('input');
  
  savedStates.forEach((savedState, index) => {
    const input = inputs[index];
    if (input instanceof HTMLInputElement) {
      // Restore value if it's controlled
      if (input.value !== savedState.value) {
        input.value = savedState.value;
      }
      
      // Restore focus and selection
      if (savedState.focused) {
        input.focus();
        if (savedState.selectionStart !== null && savedState.selectionEnd !== null) {
          input.setSelectionRange(savedState.selectionStart, savedState.selectionEnd);
        }
      }
    }
  });
}

function updateElement(container: Element, newElement: any, oldElement: any, index: number = 0): void {
  // If no old element, add the new element
  if (!oldElement) {
    renderElement(newElement, container);
    return;
  }
  
  // If no new element, remove the old element
  if (!newElement) {
    const childToRemove = container.childNodes[index];
    if (childToRemove) {
      container.removeChild(childToRemove);
    }
    return;
  }
  
  // Handle text content updates specifically
  if ((typeof newElement === 'string' || typeof newElement === 'number') && 
      (typeof oldElement === 'string' || typeof oldElement === 'number')) {
    if (newElement !== oldElement) {
      const textNode = container.childNodes[index];
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = String(newElement);
      } else {
        // Fallback: replace the node entirely
        const childToReplace = container.childNodes[index];
        if (childToReplace) {
          container.removeChild(childToReplace);
        }
        renderElement(newElement, container);
      }
    }
    return;
  }
  
  // If elements have changed types, replace the old element
  if (hasChanged(newElement, oldElement)) {
    const childToReplace = container.childNodes[index];
    if (childToReplace) {
      container.removeChild(childToReplace);
    }
    renderElement(newElement, container);
    return;
  }
  
  // If elements are the same type, update properties and children
  if (typeof newElement === 'object' && newElement.type && typeof newElement.type === 'string') {
    const domElement = container.childNodes[index] as Element;
    updateElementProps(domElement, newElement.props, oldElement.props);
    
    // Update children
    const newChildren = Array.isArray(newElement.props?.children) ? newElement.props.children : [newElement.props?.children].filter(Boolean);
    const oldChildren = Array.isArray(oldElement.props?.children) ? oldElement.props.children : [oldElement.props?.children].filter(Boolean);
    
    const maxLength = Math.max(newChildren.length, oldChildren.length);
    for (let i = 0; i < maxLength; i++) {
      updateElement(domElement, newChildren[i], oldChildren[i], i);
    }
  }
}

function hasChanged(newElement: any, oldElement: any): boolean {
  // Different types
  if (typeof newElement !== typeof oldElement) {
    return true;
  }
  
  // Different primitive values
  if (typeof newElement === 'string' || typeof newElement === 'number') {
    return newElement !== oldElement;
  }
  
  // Different element types
  if (newElement.type !== oldElement.type) {
    return true;
  }
  
  return false;
}

function updateElementProps(domElement: Element, newProps: any, oldProps: any): void {
  const allProps = { ...oldProps, ...newProps };
  
  Object.keys(allProps).forEach(propName => {
    const newValue = newProps?.[propName];
    const oldValue = oldProps?.[propName];
    
    if (newValue !== oldValue) {
      if (propName === 'children') {
        // Children are handled separately
        return;
      } else if (propName.startsWith('on') && typeof newValue === 'function') {
        // Use event delegation system for consistent event handling
        const eventName = propName.toLowerCase().substring(2);
        const container = findRootContainer(domElement);
        
        if (oldValue) {
          removeEventHandler(container, domElement, eventName, oldValue);
        }
        if (newValue) {
          addEventHandler(container, domElement, eventName, newValue);
        }
      } else if (propName === 'style' && typeof newValue === 'object') {
        Object.assign((domElement as HTMLElement).style, newValue);
      } else if (propName === 'className') {
        (domElement as HTMLElement).className = newValue || '';
      } else if (propName === 'value' && domElement instanceof HTMLInputElement) {
        // Handle controlled input values carefully
        if (domElement.value !== newValue) {
          domElement.value = newValue || '';
        }
      } else if (typeof newValue !== 'object' && typeof newValue !== 'function') {
        if (newValue === null || newValue === undefined) {
          domElement.removeAttribute(propName);
        } else {
          domElement.setAttribute(propName, String(newValue));
        }
      }
    }
  });
}

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
            const handler = props[propName];
            const container = findRootContainer(domElement);
            addEventHandler(container, domElement, eventName, handler);
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
          // Get the new render result
          __setCurrentComponent(componentInstance);
          const newComponentResult = type(componentInstance.props);
          __setCurrentComponent(null);
          
          // Use smart DOM diffing instead of clearing innerHTML
          if (componentInstance.previousRender) {
            updateElement(componentContainer, newComponentResult, componentInstance.previousRender, 0);
          } else {
            // First render - still need to clear and render normally
            componentContainer.innerHTML = '';
            renderElement(newComponentResult, componentContainer);
          }
          
          // Store the current render for next comparison
          componentInstance.previousRender = newComponentResult;
        }
      };
      
      componentInstances.set(componentId, componentInstance);
      
      // Initial render
      __setCurrentComponent(componentInstance);
      const componentResult = type(props);
      __setCurrentComponent(null);
      renderElement(componentResult, componentContainer);
      
      // Store the initial render for future comparisons
      componentInstance.previousRender = componentResult;
      
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
      
      // Clean up event delegation for this root
      eventDelegationMap.delete(domNode);
      
      // Clear component instances
      componentInstances.clear();
      
      domNode.innerHTML = '';
      isUnmounted = true;
    }
  };

  return root;
}