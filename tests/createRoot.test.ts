import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createRoot } from '../src/react-dom/client';
import { createElement } from '../src/react';

describe('createRoot', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should create a root object with render and unmount methods', () => {
    const root = createRoot(container);
    
    expect(root).toHaveProperty('render');
    expect(root).toHaveProperty('unmount');
    expect(typeof root.render).toBe('function');
    expect(typeof root.unmount).toBe('function');
  });

  it('should render string content', () => {
    const root = createRoot(container);
    root.render('Hello World');
    
    expect(container.textContent).toBe('Hello World');
  });

  it('should render number content', () => {
    const root = createRoot(container);
    root.render(42);
    
    expect(container.textContent).toBe('42');
  });

  it('should render simple DOM element', () => {
    const root = createRoot(container);
    const element = createElement('div', { className: 'test' }, 'Hello');
    root.render(element);
    
    expect(container.innerHTML).toBe('<div class="test">Hello</div>');
  });

  it('should render nested elements', () => {
    const root = createRoot(container);
    const element = createElement('div', { className: 'parent' },
      createElement('span', null, 'Child 1'),
      createElement('span', null, 'Child 2')
    );
    root.render(element);
    
    expect(container.innerHTML).toBe('<div class="parent"><span>Child 1</span><span>Child 2</span></div>');
  });

  it('should handle element with style prop', () => {
    const root = createRoot(container);
    const element = createElement('div', { 
      style: { color: 'red', fontSize: '16px' } 
    }, 'Styled text');
    root.render(element);
    
    const div = container.firstChild as HTMLElement;
    expect(div.style.color).toBe('red');
    expect(div.style.fontSize).toBe('16px');
  });

  it('should handle onClick event', () => {
    const root = createRoot(container);
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    const element = createElement('button', { onClick: handleClick }, 'Click me');
    root.render(element);
    
    const button = container.firstChild as HTMLButtonElement;
    button.click();
    
    expect(clicked).toBe(true);
  });

  it('should handle function components', () => {
    const root = createRoot(container);
    const MyComponent = (props: { name: string }) => 
      createElement('div', null, `Hello ${props.name}`);
    
    const element = createElement(MyComponent, { name: 'World' });
    root.render(element);
    
    // Check that the component content is rendered correctly
    expect(container.textContent).toBe('Hello World');
    // Check that the wrapper exists with the correct attributes
    const wrapper = container.querySelector('[data-component-id]');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.style.display).toBe('contents');
  });

  it('should clear container on render', () => {
    const root = createRoot(container);
    container.innerHTML = '<p>Old content</p>';
    
    root.render(createElement('div', null, 'New content'));
    
    expect(container.innerHTML).toBe('<div>New content</div>');
  });

  it('should handle null/undefined render', () => {
    const root = createRoot(container);
    root.render(null);
    
    expect(container.innerHTML).toBe('');
    
    root.render(undefined);
    
    expect(container.innerHTML).toBe('');
  });

  it('should handle array of children', () => {
    const root = createRoot(container);
    const element = createElement('div', null, 
      ['Hello', ' ', 'World', createElement('span', null, '!')]
    );
    root.render(element);
    
    expect(container.innerHTML).toBe('<div>Hello World<span>!</span></div>');
  });

  it('should unmount and clear container', () => {
    const root = createRoot(container);
    root.render(createElement('div', null, 'Content'));
    
    expect(container.innerHTML).toBe('<div>Content</div>');
    
    root.unmount();
    
    expect(container.innerHTML).toBe('');
  });

  it('should prevent rendering after unmount', () => {
    const root = createRoot(container);
    root.unmount();
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    root.render(createElement('div', null, 'Should not render'));
    
    expect(container.innerHTML).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith('Cannot render on an unmounted root');
    
    consoleSpy.mockRestore();
  });
});