export const fileName = 'main.ts';

export const initialCode = `// Welcome to your CodeSync workspace.
// Try changing the message or adding a new function.

type Developer = {
  name: string;
  building: string;
};

function welcome(developer: Developer): string {
  return \`Hello, \${developer.name}! Let's build \${developer.building}.\`;
}

const developer: Developer = {
  name: 'world',
  building: 'something together',
};

console.log(welcome(developer));
`;
