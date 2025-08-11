import { DocLink } from './index';

const techNames = [
    'react', 'vue', 'angular', 'svelte', 'javascript', 'typescript', 'node.js', 'express',
    'next.js', 'nuxt', 'gatsby', 'tailwind', 'bootstrap', 'css', 'html', 'sass', 'scss',
    'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'kotlin', 'php', 'laravel',
    'ruby', 'rails', 'go', 'rust', 'c#', 'asp.net', 'mongodb', 'postgresql', 'mysql',
    'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'firebase', 'supabase'
];

const mockDocs: Record<string, DocLink[]> = {
    'react': [
        { id: '1', name: 'Getting Started', url: 'https://react.dev/learn', selected: false },
        { id: '2', name: 'Hooks Reference', url: 'https://react.dev/reference/react', selected: false },
        { id: '3', name: 'Components', url: 'https://react.dev/learn/your-first-component', selected: false }
    ],
    'typescript': [
        { id: '4', name: 'Handbook', url: 'https://www.typescriptlang.org/docs/', selected: false },
        { id: '5', name: 'Types', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html', selected: false },
        { id: '6', name: 'Interfaces', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html', selected: false }
    ],
    'javascript': [
        { id: '7', name: 'MDN JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', selected: false },
        { id: '8', name: 'ES6 Features', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla', selected: false }
    ]
};

const examplePrompts = [
    "Explain how React hooks work",
    "What's the difference between let, const, and var?",
    "How do I deploy a React app?",
    "Best practices for TypeScript types"
];

export {
    techNames, 
    mockDocs, 
    examplePrompts
}
