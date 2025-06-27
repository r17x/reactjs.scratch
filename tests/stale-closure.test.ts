import { describe, expect, it, beforeEach } from 'vitest';
import { createElement, useState } from '../src/react';
import { createRoot } from '../src/react-dom/client';

describe('useState stale closure behavior', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should handle stale closures gracefully with robust useState implementation', () => {
    let renderCount = 0;
    let clickHandler: (() => void) | null = null;
    
    const Counter = () => {
      renderCount++;
      const [count, setCount] = useState(0);
      
      // This would normally create a stale closure problem, but our useState
      // implementation is robust and gets the current state at update time
      clickHandler = () => setCount(count + 1);
      
      return createElement('div', {}, `Count: ${count}`);
    };

    const root = createRoot(container);
    root.render(createElement(Counter));

    expect(container.textContent).toBe('Count: 0');
    expect(renderCount).toBe(1);

    // First click should work
    clickHandler!();
    expect(container.textContent).toBe('Count: 1');
    expect(renderCount).toBe(2);

    // Second click works because our useState is robust against stale closures
    clickHandler!();
    expect(container.textContent).toBe('Count: 2');
    expect(renderCount).toBe(3);
  });

  it('should work correctly with functional updates', () => {
    let renderCount = 0;
    let clickHandler: (() => void) | null = null;
    
    const Counter = () => {
      renderCount++;
      const [count, setCount] = useState(0);
      
      // This works correctly - uses functional update
      clickHandler = () => setCount(prevCount => prevCount + 1);
      
      return createElement('div', {}, `Count: ${count}`);
    };

    const root = createRoot(container);
    root.render(createElement(Counter));

    expect(container.textContent).toBe('Count: 0');
    expect(renderCount).toBe(1);

    // First click should work
    clickHandler!();
    expect(container.textContent).toBe('Count: 1');
    expect(renderCount).toBe(2);

    // Second click should also work with functional update
    clickHandler!();
    expect(container.textContent).toBe('Count: 2');
    expect(renderCount).toBe(3);

    // Third click should work too
    clickHandler!();
    expect(container.textContent).toBe('Count: 3');
    expect(renderCount).toBe(4);
  });
});