import { describe, it, expect } from 'vitest';
import { createElement } from '../src/react';

describe('createElement', () => {
  it('should create element with string type', () => {
    const element = createElement('div');
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ children: undefined });
    expect(element.key).toBe(null);
    expect(element.ref).toBe(null);
  });

  it('should create element with props', () => {
    const element = createElement('div', { className: 'test', id: 'myDiv' });
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ 
      className: 'test', 
      id: 'myDiv',
      children: undefined 
    });
    expect(element.key).toBe(null);
    expect(element.ref).toBe(null);
  });

  it('should handle null props', () => {
    const element = createElement('div', null);
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ children: undefined });
    expect(element.key).toBe(null);
    expect(element.ref).toBe(null);
  });

  it('should create element with single child', () => {
    const element = createElement('div', null, 'Hello');
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ children: 'Hello' });
    expect(element.key).toBe(null);
    expect(element.ref).toBe(null);
  });

  it('should create element with multiple children', () => {
    const element = createElement('div', null, 'Hello', 'World');
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ children: ['Hello', 'World'] });
    expect(element.key).toBe(null);
    expect(element.ref).toBe(null);
  });

  it('should extract key from props', () => {
    const element = createElement('div', { key: 'test-key', className: 'test' });
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ 
      className: 'test',
      children: undefined 
    });
    expect(element.key).toBe('test-key');
    expect(element.ref).toBe(null);
  });

  it('should extract ref from props', () => {
    const ref = { current: null };
    const element = createElement('div', { ref, className: 'test' });
    
    expect(element.type).toBe('div');
    expect(element.props).toEqual({ 
      className: 'test',
      children: undefined 
    });
    expect(element.key).toBe(null);
    expect(element.ref).toBe(ref);
  });

  it('should coerce key to string', () => {
    const element = createElement('div', { key: 123 });
    
    expect(element.key).toBe('123');
  });

  it('should handle function component type', () => {
    const MyComponent = () => createElement('div');
    const element = createElement(MyComponent, { prop: 'value' });
    
    expect(element.type).toBe(MyComponent);
    expect(element.props).toEqual({ 
      prop: 'value',
      children: undefined 
    });
  });

  it('should combine props and children correctly', () => {
    const element = createElement('div', { className: 'test' }, 'child1', 'child2');
    
    expect(element.props).toEqual({
      className: 'test',
      children: ['child1', 'child2']
    });
  });
});