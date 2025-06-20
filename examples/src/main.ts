import { createElement, useState } from 'reactjs-scratch/react';
import { createRoot } from 'reactjs-scratch/react-dom/client';

const Counter = (props: { initialCount?: number }) => {
  const [count, setCount] = useState(props.initialCount || 0);
  
  return createElement('div', { 
    style: { 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      margin: '20px'
    } 
  },
    createElement('h1', null, 'ReactJS Scratch Demo'),
    createElement('p', null, `Count: ${count}`),
    createElement('div', { style: { marginTop: '10px' } },
      createElement('button', {
        onClick: () => setCount(count - 1),
        style: {
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }
      }, 'Decrement'),
      createElement('button', {
        onClick: () => setCount(count + 1),
        style: {
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }
      }, 'Increment'),
      createElement('button', {
        onClick: () => setCount(0),
        style: {
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, 'Reset')
    )
  );
};

const TodoApp = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return createElement('div', {
    style: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '20px'
    }
  },
    createElement('h2', null, 'Todo List'),
    createElement('div', { style: { marginBottom: '15px' } },
      createElement('input', {
        type: 'text',
        value: inputValue,
        onInput: (e: Event) => setInputValue((e.target as HTMLInputElement).value),
        placeholder: 'Enter a todo...',
        style: {
          padding: '8px',
          fontSize: '14px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginRight: '10px',
          width: '200px'
        }
      }),
      createElement('button', {
        onClick: addTodo,
        style: {
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, 'Add Todo')
    ),
    createElement('ul', { style: { listStyle: 'none', padding: 0 } },
      ...todos.map((todo, index) => 
        createElement('li', {
          key: index,
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '5px'
          }
        },
          createElement('span', null, todo),
          createElement('button', {
            onClick: () => removeTodo(index),
            style: {
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }, 'Remove')
        )
      )
    )
  );
};

const App = () => {
  return createElement('div', null,
    createElement(Counter, { initialCount: 0 }),
    createElement(TodoApp),
    createElement('div', {
      style: {
        padding: '20px',
        textAlign: 'center'
      }
    },
      createElement('h2', null, 'Features Demonstrated:'),
      createElement('ul', {
        style: {
          textAlign: 'left',
          display: 'inline-block'
        }
      },
        createElement('li', null, 'createElement for DOM elements'),
        createElement('li', null, 'Function components'),
        createElement('li', null, 'Props and children'),
        createElement('li', null, 'Event handlers'),
        createElement('li', null, 'Inline styles'),
        createElement('li', null, 'createRoot for rendering'),
        createElement('li', null, 'useState hook for state management'),
        createElement('li', null, 'Multiple state variables'),
        createElement('li', null, 'State updates with functional and direct values'),
        createElement('li', null, 'Interactive forms and lists')
      )
    )
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(createElement(App));
} else {
  console.error('Could not find app container');
}