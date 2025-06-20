import { createElement } from 'reactjs-scratch/react';
import { createRoot } from 'reactjs-scratch/react-dom/client';

const Counter = (props: { initialCount?: number }) => {
  const count = props.initialCount || 0;
  
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
    createElement('button', {
      onClick: () => {
        console.log('Button clicked! Count would be:', count + 1);
        alert(`Button clicked! This would increment count to ${count + 1}`);
      },
      style: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    }, 'Click me!')
  );
};

const App = () => {
  return createElement('div', null,
    createElement(Counter, { initialCount: 0 }),
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
        createElement('li', null, 'createRoot for rendering')
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