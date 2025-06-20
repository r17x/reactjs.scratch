import { useState } from 'reactjs-scratch/react';
import { createRoot } from 'reactjs-scratch/react-dom/client';

const Counter = (props: { initialCount?: number }) => {
  const [count, setCount] = useState(props.initialCount || 0);
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h1>ReactJS Scratch Demo</h1>
      <p>Count: {count}</p>
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Increment
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
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

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2>Todo List</h2>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={inputValue}
          onInput={(e: Event) => setInputValue((e.target as HTMLInputElement).value)}
          placeholder="Enter a todo..."
          style={{
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginRight: '10px',
            width: '200px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Todo
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '5px'
            }}
          >
            <span>{todo}</span>
            <button
              onClick={() => removeTodo(index)}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Counter initialCount={0} />
      <TodoApp />
      <div style={{
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Features Demonstrated:</h2>
        <ul style={{
          textAlign: 'left',
          display: 'inline-block'
        }}>
          <li>JSX syntax instead of createElement</li>
          <li>Function components</li>
          <li>Props and children</li>
          <li>Event handlers</li>
          <li>Inline styles</li>
          <li>createRoot for rendering</li>
          <li>useState hook for state management</li>
          <li>Multiple state variables</li>
          <li>State updates with functional and direct values</li>
          <li>Interactive forms and lists</li>
        </ul>
      </div>
    </div>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Could not find app container');
}