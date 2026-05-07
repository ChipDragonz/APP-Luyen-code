// Simulates an API call that analyzes code and generates mini-games
export const analyzeCode = async (code) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a few levels based on the code length or just return fixed mock data for demo.
      // In a real app, an LLM would parse the code and return structured exercises.
      
      const levels = [
        {
          id: 1,
          type: 'typing',
          title: 'Fill in the blanks',
          instruction: 'Complete the missing keywords or variables in the code snippet.',
          code: code,
          // We'll mock missing parts. Let's just create a dummy representation.
          // For the sake of the demo, we will pretend the code is a React component and we hide "function" and "return"
          // If the user's code is generic, we just use a fallback mock snippet to ensure the UI works.
          snippet: [
            { type: 'text', content: 'export default ' },
            { type: 'input', answer: 'function', placeholder: 'keyword' },
            { type: 'text', content: ' App() {\n  const [count, setCount] = useState(0);\n\n  ' },
            { type: 'input', answer: 'return', placeholder: 'keyword' },
            { type: 'text', content: ' (\n    <div>Hello World</div>\n  );\n}' }
          ]
        },
        {
          id: 2,
          type: 'sort',
          title: 'Logical Ordering',
          instruction: 'Drag and drop the code blocks into the correct execution order.',
          blocks: [
            { id: 'b1', content: 'import React, { useState } from "react";' },
            { id: 'b2', content: 'export default function Counter() {' },
            { id: 'b3', content: '  const [count, setCount] = useState(0);' },
            { id: 'b4', content: '  return <button onClick={() => setCount(count + 1)}>{count}</button>;' },
            { id: 'b5', content: '}' }
          ].sort(() => Math.random() - 0.5), // Shuffle them
          correctOrder: ['b1', 'b2', 'b3', 'b4', 'b5']
        }
      ];

      resolve(levels);
    }, 2000); // Simulate 2s delay
  });
};
