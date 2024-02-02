#!/usr/bin/env node
// console.clear();
import spinners from "cli-spinners";
import fs, { promises as fsPromises } from "fs";
import path from "path";
import yargs, { Argv } from "yargs";
import { exec } from "child_process";
import {
  generateComponentTemplate,
  generateInterfaceTemplate,
} from "./templates/react-template";

/*Ubicacion de los templates*/
const TEMPLATE: string = path.join(__dirname, "templates/static-files");
const CURRENT_DIR = process.cwd();

/*COMANDOS NPM*/
const DEPENDENCIES_VITE_INIT =
    "npm i && npm i -D @types/node && npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p && npm add -D sass && rm -rf src/App.css src/index.css",
  DEPENDENCIES_VITE_INIT_ROUTER =
    "npm i react-router-dom && rm -rf src/adapters src/data src/domain src/services",
  DEPENDENCIES_EXPRESS_API =
    "npm init --yes && npm i express express-validator bcryptjs cors date-fns dotenv jsonwebtoken mongoose && npm i -D typescript ts-node nodemon @types/express @types/bcryptjs @types/cors @types/jsonwebtoken";

/*CARPETAS STATICAS*/
enum DIRS {
  viteTailwind = "vite-tailwind",
  viteTailwindAddRouter = "vite-tailwind-add-router",
  viteTailwindPage = "vite-tailwind-page",
  expressApi = "express-api",
}

// Capitalizar los strings
const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

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

/* EJECUTAR NPM DEPENDENCIES */
const runDependencies = (dependencies: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(dependencies, { cwd: CURRENT_DIR }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve();
    });
  });
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

/*Crear Carpeta*/
const createDirectory = (directoryPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) reject(`Error creating directory: ${err}`);
      else resolve(`Directory created successfully at ${directoryPath}`);
    });
  });
};

/* Abrir archivo en VSCode */
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

const generateReactPage = (namePage: string): void => {
  const dirPage: string = `app/app/${namePage}`;
  const filePage: string = namePage.split("App")[0];

  createDirectory(dirPage)
    .then((res) => {
      const { viteTailwindPage } = DIRS;
      const sourceFolder = path.join(TEMPLATE, viteTailwindPage);
      copyFolderSync(sourceFolder, dirPage);
      runDependencies(
        `mv ${dirPage}/adapters/auth.adapter.ts ${dirPage}/adapters/${filePage}.adapter.ts && mv ${dirPage}/domain/auth.domain.ts ${dirPage}/domain/${filePage}.domain.ts && mv ${dirPage}/routes/AuthRouter.tsx ${dirPage}/routes/${capitalize(
          filePage
        )}Router.tsx && mv ${dirPage}/services/auth.service.ts ${dirPage}/services/${filePage}.service.ts`
      );
    })
    .catch(console.log);
};

yargs
  .command(
    "g <mycommand> <filename>",
    "Genera componente|interface|app en React",
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

      if (mycommand === "a") {
        generateReactPage(filename);
        return;
      }
    }
  )
  .command(
    "vite init",
    "Creamos el espacio de trabajo para un proyecto react con Vite",
    (yargs) => {
      yargs.option("router", {
        alias: "r",
        describe: "Agregamos plantilla react-router",
        type: "string",
      });
    },
    (argv) => {
      initIntervaL("Iniciando proyecto react con vite...");
      let message: string = "\n✅ `vite init` se ha ejecutado correctamente";

      const runDependencies = (dependenciesVite: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          exec(
            dependenciesVite,
            { cwd: CURRENT_DIR },
            (error, stdout, stderr) => {
              if (error) {
                console.error(`Error: ${error.message}`);
                reject(`Error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject(`stderr: ${stderr}`);
                return;
              }
              resolve();
            }
          );
        });
      };

      const addDirsViteInit = (): void => {
        const { viteTailwind } = DIRS;
        const sourceFolder = path.join(TEMPLATE, viteTailwind);
        copyFolderSync(sourceFolder, CURRENT_DIR);
      };

      const addDirsViteInitRouter = (): Promise<string> => {
        return new Promise((resolve) => {
          const { viteTailwindAddRouter } = DIRS;
          const sourceFolder = path.join(TEMPLATE, viteTailwindAddRouter);
          copyFolderSync(sourceFolder, CURRENT_DIR);
          runDependencies(DEPENDENCIES_VITE_INIT_ROUTER)
            .then(() => resolve("\n✅ `react-router` agregado correctamente"))
            .catch(console.log);
        });
      };

      const isRouterAvailable = (): boolean => {
        const { router } = argv;
        return router !== undefined && router !== null;
      };

      runDependencies(DEPENDENCIES_VITE_INIT)
        .then(() => {
          addDirsViteInit();
          return !isRouterAvailable() ? "" : addDirsViteInitRouter();
        })
        .then((msg) => {
          message += msg;
        })
        .catch(console.log)
        .finally(() => {
          clearInterval(interval);
          console.clear();
          console.log(message);
        });
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
      // DEPENDENCIES_EXPRESS_API
      exec(
        DEPENDENCIES_EXPRESS_API,
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
            `express | express-validator | bcryptjs | cors | date-fns | dotenv | jsonwebtoken | mongoose`
          );
          console.log("\nDEVDEPENDENCIES");
          console.log(
            `typescript | ts-node | nodemon | @types/express | @types/bcryptjs | @types/cors | @types/jsonwebtoken`
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
