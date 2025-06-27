import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { createElement, useState } from '../src/react';
import { createRoot } from '../src/react-dom/client';

describe('DOM Integration Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should update DOM when counter state changes', () => {
    let incrementHandler: (() => void) | null = null;
    let decrementHandler: (() => void) | null = null;
    let resetHandler: (() => void) | null = null;

    const Counter = (props: { initialCount?: number }) => {
      const [count, setCount] = useState(props.initialCount || 0);
      
      // Store handlers for testing
      incrementHandler = () => setCount(prevCount => prevCount + 1);
      decrementHandler = () => setCount(prevCount => prevCount - 1);
      resetHandler = () => setCount(0);
      
      return createElement('div', {}, [
        createElement('p', {}, `Count: ${count}`),
        createElement('button', { 
          id: 'increment', 
          onClick: incrementHandler 
        }, 'Increment'),
        createElement('button', { 
          id: 'decrement', 
          onClick: decrementHandler 
        }, 'Decrement'),
        createElement('button', { 
          id: 'reset', 
          onClick: resetHandler 
        }, 'Reset')
      ]);
    };

    const root = createRoot(container);
    root.render(createElement(Counter, { initialCount: 0 }));

    // Initial state
    expect(container.querySelector('p')?.textContent).toBe('Count: 0');
    
    // Test increment
    incrementHandler!();
    expect(container.querySelector('p')?.textContent).toBe('Count: 1');
    
    // Test increment again
    incrementHandler!();
    expect(container.querySelector('p')?.textContent).toBe('Count: 2');
    
    // Test decrement
    decrementHandler!();
    expect(container.querySelector('p')?.textContent).toBe('Count: 1');
    
    // Test reset
    resetHandler!();
    expect(container.querySelector('p')?.textContent).toBe('Count: 0');
  });

  it('should update DOM when todo list changes', () => {
    let addTodoHandler: (() => void) | null = null;
    let removeTodoHandler: ((index: number) => void) | null = null;
    let setInputValueHandler: ((value: string) => void) | null = null;

    const TodoApp = () => {
      const [todos, setTodos] = useState<string[]>([]);
      const [inputValue, setInputValue] = useState('');

      addTodoHandler = () => {
        if (inputValue.trim()) {
          setTodos(prevTodos => [...prevTodos, inputValue.trim()]);
          setInputValue('');
        }
      };

      removeTodoHandler = (index: number) => {
        setTodos(prevTodos => prevTodos.filter((_, i) => i !== index));
      };

      setInputValueHandler = (value: string) => {
        setInputValue(value);
      };

      return createElement('div', {}, [
        createElement('input', {
          type: 'text',
          value: inputValue,
          id: 'todo-input',
          onInput: (e: Event) => setInputValue((e.target as HTMLInputElement).value)
        }),
        createElement('button', {
          id: 'add-todo',
          onClick: addTodoHandler
        }, 'Add Todo'),
        createElement('ul', { id: 'todo-list' }, 
          todos.map((todo, index) => 
            createElement('li', { key: index }, [
              createElement('span', {}, todo),
              createElement('button', {
                onClick: () => removeTodoHandler!(index)
              }, 'Remove')
            ])
          )
        )
      ]);
    };

    const root = createRoot(container);
    root.render(createElement(TodoApp));

    // Initial state - empty list
    expect(container.querySelector('#todo-list')?.children.length).toBe(0);
    
    // Add first todo
    setInputValueHandler!('First todo');
    expect((container.querySelector('#todo-input') as HTMLInputElement)?.value).toBe('First todo');
    
    addTodoHandler!();
    expect(container.querySelector('#todo-list')?.children.length).toBe(1);
    expect(container.querySelector('#todo-list li span')?.textContent).toBe('First todo');
    expect((container.querySelector('#todo-input') as HTMLInputElement)?.value).toBe('');
    
    // Add second todo
    setInputValueHandler!('Second todo');
    addTodoHandler!();
    expect(container.querySelector('#todo-list')?.children.length).toBe(2);
    expect(container.querySelectorAll('#todo-list li span')[1]?.textContent).toBe('Second todo');
    
    // Remove first todo
    removeTodoHandler!(0);
    expect(container.querySelector('#todo-list')?.children.length).toBe(1);
    expect(container.querySelector('#todo-list li span')?.textContent).toBe('Second todo');
  });

  it('should handle rapid state updates correctly', () => {
    let updateHandler: (() => void) | null = null;

    const RapidUpdater = () => {
      const [count, setCount] = useState(0);
      
      updateHandler = () => {
        // Simulate rapid updates
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
      };
      
      return createElement('div', {}, [
        createElement('p', { id: 'rapid-count' }, `Count: ${count}`),
        createElement('button', { 
          id: 'rapid-update', 
          onClick: updateHandler 
        }, 'Update')
      ]);
    };

    const root = createRoot(container);
    root.render(createElement(RapidUpdater));

    // Initial state
    expect(container.querySelector('#rapid-count')?.textContent).toBe('Count: 0');
    
    // Trigger rapid updates
    updateHandler!();
    expect(container.querySelector('#rapid-count')?.textContent).toBe('Count: 3');
    
    // Another round
    updateHandler!();
    expect(container.querySelector('#rapid-count')?.textContent).toBe('Count: 6');
  });

  it('should handle mixed state types correctly', () => {
    let updateStringHandler: (() => void) | null = null;
    let updateNumberHandler: (() => void) | null = null;
    let updateObjectHandler: (() => void) | null = null;

    const MixedStateComponent = () => {
      const [text, setText] = useState('initial');
      const [number, setNumber] = useState(42);
      const [obj, setObj] = useState({ name: 'John', age: 25 });
      
      updateStringHandler = () => setText('updated');
      updateNumberHandler = () => setNumber(prev => prev * 2);
      updateObjectHandler = () => setObj(prev => ({ ...prev, age: prev.age + 1 }));
      
      return createElement('div', {}, [
        createElement('p', { id: 'text-value' }, text),
        createElement('p', { id: 'number-value' }, number.toString()),
        createElement('p', { id: 'object-value' }, `${obj.name} is ${obj.age}`)
      ]);
    };

    const root = createRoot(container);
    root.render(createElement(MixedStateComponent));

    // Initial state
    expect(container.querySelector('#text-value')?.textContent).toBe('initial');
    expect(container.querySelector('#number-value')?.textContent).toBe('42');
    expect(container.querySelector('#object-value')?.textContent).toBe('John is 25');
    
    // Update string
    updateStringHandler!();
    expect(container.querySelector('#text-value')?.textContent).toBe('updated');
    
    // Update number
    updateNumberHandler!();
    expect(container.querySelector('#number-value')?.textContent).toBe('84');
    
    // Update object
    updateObjectHandler!();
    expect(container.querySelector('#object-value')?.textContent).toBe('John is 26');
  });

  it('should handle event handlers correctly across re-renders', () => {
    // Create a fresh container to avoid interference
    const testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
    
    let clickCount = 0;
    let triggerReRender: (() => void) | null = null;

    const EventTest = () => {
      const [renderCount, setRenderCount] = useState(0);
      
      triggerReRender = () => setRenderCount(prev => prev + 1);
      
      const handleClick = () => {
        clickCount++;
      };
      
      return createElement('div', {}, [
        createElement('p', { id: 'render-count' }, `Renders: ${renderCount}`),
        createElement('button', { 
          id: 'test-button',
          onClick: handleClick 
        }, 'Click Me')
      ]);
    };

    const root = createRoot(testContainer);
    root.render(createElement(EventTest));

    const button = testContainer.querySelector('#test-button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    
    // Initial click
    button.click();
    expect(clickCount).toBe(1);
    
    // Trigger re-render
    triggerReRender!();
    expect(testContainer.querySelector('#render-count')?.textContent).toBe('Renders: 1');
    
    // Click again after re-render - should work
    button.click();
    expect(clickCount).toBe(2);
    
    // Another re-render
    triggerReRender!();
    expect(testContainer.querySelector('#render-count')?.textContent).toBe('Renders: 2');
    
    // Final click should work
    button.click();
    expect(clickCount).toBe(3);
    
    // Clean up
    document.body.removeChild(testContainer);
  });
});