#!/usr/bin/env node
console.clear();
import spinners from "cli-spinners";
import fs from "fs";
import path from "path";
import yargs, { Argv } from "yargs";
import { exec } from "child_process";
import {
  generateComponentTemplate,
  generateInterfaceTemplate,
} from "./templates/react-template";

/*Ubicacion de los templates*/
const TEMPLATE: string = path.join(__dirname, "templates/static-files");

/*Mostrar el spinner*/
const spinner = spinners.dots;
let interval: NodeJS.Timeout;
const initIntervaL = (message: string = "Cargando...") => {
  let i = 0;
  interval = setInterval(() => {
    process.stdout.write(
      `\r${spinner.frames[(i = ++i % spinner.frames.length)]} ${message}`
    );
  }, spinner.interval);
};

/*Copiar Carpeta con archivos incluidos*/
const copyFolderSync = (source: string, target: string) => {
  if (!fs.existsSync(target)) fs.mkdirSync(target);

  const items = fs.readdirSync(source);

  items.forEach((item) => {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);

    if (fs.lstatSync(sourcePath).isDirectory())
      copyFolderSync(sourcePath, targetPath);
    else fs.copyFileSync(sourcePath, targetPath);
  });
};

/* Ejecutar el comando para abrir el archivo en VSCode */
const openVSCode = (filePath: string): void => {
  const command = `code ${filePath}`;
  exec(command, (error) => {
    if (error) {
      console.error(`Error al abrir el archivo en VSCode: ${error}`);
      return;
    }
  });
};

/**/
const generateReactComponent = (DirAndComponent: string): void => {
  let componentName: string = DirAndComponent.split("/").reverse()[0];
  let dir: string = DirAndComponent.replace(componentName, "");
  let lastComponentArgument: string = componentName;

  // Si termina en "/" ignoramos la posicion 0 y usar posicion 1
  if (componentName === "") {
    componentName = "index";
    lastComponentArgument = DirAndComponent.split("/").reverse()[1];
  }

  // Generar el archivo del componente
  const componentFileName = `${componentName}.tsx`;
  let componentFilePath = process.cwd();
  if (dir) {
    componentFilePath = path.join(componentFilePath, dir as string);
    if (!fs.existsSync(componentFilePath))
      fs.mkdirSync(componentFilePath, { recursive: true });
  }
  componentFilePath = path.join(componentFilePath, componentFileName);

  // Obtenemos el string del template react
  // const componentContent = generateComponentTemplate(componentName as string);
  const componentContent = generateComponentTemplate(lastComponentArgument);

  // Escribir el contenido del componente en el archivo
  fs.writeFileSync(componentFilePath, componentContent, "utf-8");
  console.log(`Componente ${componentFileName} generado exitosamente`);
  console.log(componentFilePath);

  openVSCode(componentFilePath);
};
const generateReactInterface = (DirAndInterface: string): void => {
  let interfaceName = DirAndInterface.split("/").reverse()[0];
  let dir = DirAndInterface.replace(interfaceName, "");

  // Si termina en "/" ignoramos la posicion 0 y usar posicion 1
  if (interfaceName === "") {
    interfaceName = DirAndInterface.split("/").reverse()[1];
    dir = DirAndInterface.replace(`${interfaceName}/`, "");
  }

  // Generar el archivo de la interface
  const interfaceFileName = `${interfaceName}.interface.ts`;
  let interfaceFilePath = process.cwd();

  if (dir) {
    interfaceFilePath = path.join(interfaceFilePath, dir as string);
    if (!fs.existsSync(interfaceFilePath))
      fs.mkdirSync(interfaceFilePath, { recursive: true });
  }
  interfaceFilePath = path.join(interfaceFilePath, interfaceFileName);

  // Obtenemos el string del template react
  const interfaceContent = generateInterfaceTemplate(interfaceName as string);

  // return;

  // Escribir el contenido del componente en el archivo
  fs.writeFileSync(interfaceFilePath, interfaceContent, "utf-8");
  console.log(`Interface ${interfaceFileName} generado exitosamente`);
  console.log(interfaceFilePath);

  openVSCode(interfaceFilePath);
};

/**/
enum DIRS {
  viteTailwind = "vite-tailwind",
  expressApi = "express-api",
  joanCochachi = 220,
}
// type typeDIRS = Record<DIRS, string>;

yargs
  .command(
    "g <mycommand> <filename>",
    "Genera componente|interface en React",
    {},
    (argv) => {
      const { mycommand, filename } = argv as yargs.ArgumentsCamelCase<{
        mycommand: string;
        filename: string;
      }>;

      if (mycommand === "c") {
        generateReactComponent(filename);
        return;
      }
      if (mycommand === "i") {
        generateReactInterface(filename);
        return;
      }
    }
  )
  .command(
    "vite init",
    "Creamos el espacio de trabajo para un proyecto react con Vite",
    (yargs: Argv) => {
      yargs.option("tw", {
        alias: "t",
        describe: "Archivo a copiar",
        default: "src/templates/static-files/tailwind.config.js",
        type: "string",
      });
    },
    (argv) => {
      initIntervaL("Iniciando proyecto vite con react...");

      // Obtener la ruta actual
      const currentDirectory = process.cwd();
      exec(
        "npm i && npm i -D @types/node && npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p && npm add -D sass && rm -rf src/App.css src/index.css",
        { cwd: currentDirectory },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          clearInterval(interval);
          console.clear();
          console.log("\n✅ `vite init` se ha ejecutado correctamente");
        }
      );

      const { viteTailwind } = DIRS;
      const sourceFolder = path.join(TEMPLATE, viteTailwind);
      const targetFolder = process.cwd();
      copyFolderSync(sourceFolder, targetFolder);
    }
  )
  .command(
    "express-api init",
    "Creamos el espacio de trabajo para un api con Express",
    {},
    (argv) => {
      initIntervaL("Iniciando proyecto ExpressApi...");
      // Obtener la ruta actual
      const currentDirectory = process.cwd();
      // "npm i express express-validator bcryptjs cors date-fns dotenv jsonwebtoken mongoose && npm i -D typescript ts-node nodemon @types/express @types/bcryptjs @types/cors @types/dotenv @types/jsonwebtoken @types/mongoose"

      exec(
        "npm init --yes",
        { cwd: currentDirectory },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          clearInterval(interval);
          console.clear();
          console.log("\nDEPENDENCIES");
          console.log(
            `- express\n- express-validator\n- bcryptjs\n- cors\n- date-fns\n- dotenv\n- jsonwebtoken\n- mongoose`
          );
          console.log("\nDEVDEPENDENCIES");
          console.log(
            `- typescript\n- ts-node\n- nodemon\n- @types/express\n- @types/bcryptjs\n- @types/cors\n- @types/dotenv\n- @types/jsonwebtoken\n- @types/mongoose`
          );
          console.log("\n✅ `express-api` se ha ejecutado correctamente");
        }
      );

      const { expressApi } = DIRS;
      const sourceFolder = path.join(TEMPLATE, expressApi);
      const targetFolder = process.cwd();
      copyFolderSync(sourceFolder, targetFolder);
    }
  )
  .demandCommand(
    1,
    "Debes proporcionar un comando para generar un componente de React"
  )
  .help().argv;
