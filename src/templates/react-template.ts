// Capitalizar los strings
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const generateComponentTemplate = (componentName: string) => {
  return `
interface IProps {
  className?: string;
}

export const ${componentName}:React.FC<IProps> = ({ className = "" }) => {
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
// import { ${componentName} } from "@/";`;
};

export const generateInterfaceTemplate = (interfaceName: string) => {
  let newInterfaceName: string | string[] = interfaceName
    .split("-")
    .map((name) => capitalize(name));
  newInterfaceName = `I${newInterfaceName.join("")}`;
  return `
export interface ${newInterfaceName} {
  className?: string;
}
// export type { ${newInterfaceName} } from "./${interfaceName}.interface";`;
};