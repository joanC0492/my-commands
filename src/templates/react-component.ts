export const generateComponentTemplate = (componentName: string) => {
  return `
interface IProps {
  className?: string;
}

export const ${componentName} = ({ className = "" }: IProps) => {
  return (
    <div className={\`\${className}\`}>      
      <p className="text-2xl">${componentName}</p>
      <p>Este es un componente de React generado personalizado.</p>
      <ul>
        {[...new Array(20)].map((_, index) => (
          <li key={index}>{index + 1}</li>
        ))}
      </ul>
    </div>
  );
};
// export { ${componentName} } from "./${componentName}";
// import { ${componentName} } from "@/";
`;
};
