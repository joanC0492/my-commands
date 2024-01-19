export const generateComponentTemplate = (componentName: string) => {
  return `
export const ${componentName} = () => {
  return (
    <div>
      <h1>${componentName}</h1>
      <p>Este es un componente de React generado personalizado.</p>
      <ul>
      {[...new Array(20)].map((_, index) => (
        <li key={index}>{index + 1}</li>
      ))}
      </ul>
    </div>
  );
};
// import { ${componentName} } from "@/";
`;
};
