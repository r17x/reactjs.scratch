import { describe, it, expect, beforeEach } from 'vitest';
import { createElement, useState } from '../src/react';
import { createRoot } from '../src/react-dom/client';

describe('useState', () => {
  let container: HTMLDivElement;
  let root: any;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  it('should initialize state with primitive value', () => {
    let renderCount = 0;
    let capturedState: number;
    
    const TestComponent = () => {
      renderCount++;
      const [count] = useState(5);
      capturedState = count;
      return createElement('div', null, count.toString());
    };

    root.render(createElement(TestComponent));
    
    expect(capturedState!).toBe(5);
    expect(container.textContent).toBe('5');
    expect(renderCount).toBe(1);
  });

  it('should initialize state with function', () => {
    let initializerCallCount = 0;
    let capturedState: number;
    
    const TestComponent = () => {
      const [count] = useState(() => {
        initializerCallCount++;
        return 10;
      });
      capturedState = count;
      return createElement('div', null, count.toString());
    };

    root.render(createElement(TestComponent));
    
    expect(capturedState!).toBe(10);
    expect(container.textContent).toBe('10');
    expect(initializerCallCount).toBe(1);
  });

  it('should update state with direct value', () => {
    let capturedState: number;
    let capturedSetter: (value: number) => void;
    
    const TestComponent = () => {
      const [count, setCount] = useState(0);
      capturedState = count;
      capturedSetter = setCount;
      return createElement('div', null, count.toString());
    };

    root.render(createElement(TestComponent));
    
    expect(capturedState!).toBe(0);
    expect(container.textContent).toBe('0');

    capturedSetter!(5);
    
    expect(capturedState!).toBe(5);
    expect(container.textContent).toBe('5');
  });

  it('should update state with updater function', () => {
    let capturedState: number;
    let capturedSetter: (value: number | ((prev: number) => number)) => void;
    
    const TestComponent = () => {
      const [count, setCount] = useState(0);
      capturedState = count;
      capturedSetter = setCount;
      return createElement('div', null, count.toString());
    };

    root.render(createElement(TestComponent));
    
    expect(capturedState!).toBe(0);

    capturedSetter!((prev) => prev + 1);
    
    expect(capturedState!).toBe(1);
    expect(container.textContent).toBe('1');
  });

  it('should not re-render if state value is the same', () => {
    let renderCount = 0;
    let capturedSetter: (value: number) => void;
    
    const TestComponent = () => {
      renderCount++;
      const [count, setCount] = useState(5);
      capturedSetter = setCount;
      return createElement('div', null, count.toString());
    };

    root.render(createElement(TestComponent));
    
    expect(renderCount).toBe(1);
    
    capturedSetter!(5); // Same value
    
    expect(renderCount).toBe(1); // Should not re-render
  });

  it('should handle multiple state variables', () => {
    let capturedName: string;
    let capturedAge: number;
    let capturedSetName: (value: string) => void;
    let capturedSetAge: (value: number) => void;
    
    const TestComponent = () => {
      const [name, setName] = useState('John');
      const [age, setAge] = useState(25);
      
      capturedName = name;
      capturedAge = age;
      capturedSetName = setName;
      capturedSetAge = setAge;
      
      return createElement('div', null, `${name} is ${age} years old`);
    };

    root.render(createElement(TestComponent));
    
    expect(capturedName!).toBe('John');
    expect(capturedAge!).toBe(25);
    expect(container.textContent).toBe('John is 25 years old');

    capturedSetName!('Jane');
    
    expect(capturedName!).toBe('Jane');
    expect(capturedAge!).toBe(25);
    expect(container.textContent).toBe('Jane is 25 years old');

    capturedSetAge!(30);
    
    expect(capturedName!).toBe('Jane');
    expect(capturedAge!).toBe(30);
    expect(container.textContent).toBe('Jane is 30 years old');
  });

  it('should handle complex state objects', () => {
    interface User {
      name: string;
      email: string;
    }
    
    let capturedUser: User;
    let capturedSetUser: (value: User | ((prev: User) => User)) => void;
    
    const TestComponent = () => {
      const [user, setUser] = useState<User>({ name: 'John', email: 'john@example.com' });
      
      capturedUser = user;
      capturedSetUser = setUser;
      
      return createElement('div', null, `${user.name} (${user.email})`);
    };

    root.render(createElement(TestComponent));
    
    expect(capturedUser!.name).toBe('John');
    expect(capturedUser!.email).toBe('john@example.com');
    expect(container.textContent).toBe('John (john@example.com)');

    capturedSetUser!((prev) => ({ ...prev, name: 'Jane' }));
    
    expect(capturedUser!.name).toBe('Jane');
    expect(capturedUser!.email).toBe('john@example.com');
    expect(container.textContent).toBe('Jane (john@example.com)');
  });

  it('should throw error when called outside component', () => {
    expect(() => {
      useState(0);
    }).toThrow('useState can only be called within a component');
  });

  it('should preserve setter function identity', () => {
    let firstSetter: (value: number) => void;
    let secondSetter: (value: number) => void;
    let renderCount = 0;
    
    const TestComponent = () => {
      renderCount++;
      const [count, setCount] = useState(0);
      
      if (renderCount === 1) {
        firstSetter = setCount;
      } else if (renderCount === 2) {
        secondSetter = setCount;
      }
      
      return createElement('div', null, count.toString());
    };

    root.render(createElement(TestComponent));
    
    firstSetter!(1); // Trigger re-render
    
    expect(firstSetter!).toBe(secondSetter!);
  });
});