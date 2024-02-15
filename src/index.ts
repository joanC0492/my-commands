#!/usr/bin/env node
console.clear();
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
  viteTailwindApp = "vite-tailwind-app",
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

/* Actualizar archivos */
interface UpdateFiles {
  type: "BEFORE" | "AFTER" | "REPLACE";
  filePath: string;
  strSelector: string;
  strFiles: Array<string>;
}
const updateFiles = async ({
  type,
  filePath,
  strSelector,
  strFiles,
}: UpdateFiles): Promise<void> => {
  try {
    // Leer el contenido del archivo
    const data = await fsPromises.readFile(filePath, "utf8");
    // Buscar selector
    const queryIndex = data.indexOf(strSelector);
    let queryIndexInitial = queryIndex;
    let queryIndexLatest = queryIndex;
    // Se modifica los indices dependiendo del tipo
    if (type === "AFTER") {
      queryIndexInitial += strSelector.length;
      queryIndexLatest += strSelector.length;
    }
    if (type === "REPLACE") queryIndexLatest += strSelector.length;
    // En caso de error
    if (queryIndex === -1) throw new Error("No se encontró el selector");
    // Construir el nuevo contenido del archivo
    const newData = `${data.slice(0, queryIndexInitial)}${strFiles.join(
      ""
    )}${data.slice(queryIndexLatest)}`;
    // Escribir el nuevo contenido en el archivo
    await fsPromises.writeFile(filePath, newData, "utf8");
  } catch (error) {
    console.error("Error:", error);
  }
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

const generateReactAppWithRoute = (namePage: string): void => {
  const dirPage: string = `src/app/${namePage}`;
  const filePage: string = namePage.split("App")[0];

  let filePath: string;
  let strSelector: string;
  let strFiles: string[];

  createDirectory(dirPage)
    .then((res) => {
      const { viteTailwindApp } = DIRS;
      const sourceFolder = path.join(TEMPLATE, viteTailwindApp);
      copyFolderSync(sourceFolder, dirPage);

      // Cambiando el nombre de los archivos
      return runDependencies(
        `mv ${dirPage}/adapters/auth.adapter.ts ${dirPage}/adapters/${filePage}.adapter.ts && mv ${dirPage}/domain/auth.domain.ts ${dirPage}/domain/${filePage}.domain.ts && mv ${dirPage}/routes/AuthRouter.tsx ${dirPage}/routes/${capitalize(
          filePage
        )}Router.tsx && mv ${dirPage}/services/auth.service.ts ${dirPage}/services/${filePage}.service.ts`
      );
    })
    .then(() => {
      filePath = `${dirPage}/routes/routes.ts`;
      strSelector = `import { HomePage } from "@/app/auth/pages";`;
      strFiles = [`import { HomePage } from "@/app/${namePage}/pages";`];
      return updateFiles({ type: "REPLACE", filePath, strSelector, strFiles });
    })
    .then(() => {
      filePath = `${dirPage}/routes/routes.ts`;
      strSelector = `export enum FirstAppRoutes {`;
      strFiles = [`export enum ${capitalize(filePage)}AppRoutes {`];
      return updateFiles({ type: "REPLACE", filePath, strSelector, strFiles });
    })
    .then(() => {
      filePath = `${dirPage}/routes/routes.ts`;
      strSelector = `name: FirstAppRoutes.HOME,`;
      strFiles = [`name: ${capitalize(filePage)}AppRoutes.HOME,`];
      return updateFiles({ type: "REPLACE", filePath, strSelector, strFiles });
    })
    .then(() => {
      filePath = `${dirPage}/routes/${capitalize(filePage)}Router.tsx`;
      strSelector = `export const AuthRouter: React.FC = () => {`;
      strFiles = [
        `export const ${capitalize(filePage)}Router: React.FC = () => {`,
      ];
      return updateFiles({ type: "REPLACE", filePath, strSelector, strFiles });
    })
    .then(() => {
      filePath = `src/routes/AppRouter.tsx`;
      strSelector = `</Routes>`;
      strFiles = [
        `<Route path="/${filePage}/*" element={<${capitalize(
          filePage
        )}Router />} />\n`,
      ];
      return updateFiles({ type: "BEFORE", filePath, strSelector, strFiles });
    })
    .then(() => {
      // from "react-router-dom";
      filePath = `src/routes/AppRouter.tsx`;
      strSelector = `from "react-router-dom";`;
      strFiles = [
        `\nimport { ${capitalize(
          filePage
        )}Router } from "@/app/${namePage}/routes/${capitalize(
          filePage
        )}Router";`,
      ];
      updateFiles({ type: "AFTER", filePath, strSelector, strFiles });
    })
    .catch(console.log);
};

const generateReactPageRoute = (nameApp: string, namePage: string): void => {
  const dirApp: string = `src/app/${nameApp}`;
  const fileApp: string = nameApp.split("App")[0];
  const dirAppPage: string = `src/app/${nameApp}/pages/${namePage}`;

  let filePath: string;
  let strSelector: string;
  let strFiles: string[];

  createDirectory(dirAppPage)
    .then((res) => {
      const { viteTailwindPage } = DIRS;
      const sourceFolder = path.join(TEMPLATE, viteTailwindPage);
      copyFolderSync(sourceFolder, dirAppPage);
      // Cambiando el nombre de los archivos
      return runDependencies(
        `mv ${dirAppPage}/Default.tsx ${dirAppPage}/${namePage}.tsx`
      );
    })
    .then(() => {
      // update creating file
      const updates: Array<Promise<void>> = [];
      filePath = `${dirAppPage}/${namePage}.tsx`;
      strSelector = `export const DefaultPage: () => JSX.Element = () => {`;
      strFiles = [`export const ${namePage}Page: () => JSX.Element = () => {`];
      updates.push(
        updateFiles({ type: "REPLACE", filePath, strSelector, strFiles })
      );
      // update index export
      filePath = `${dirAppPage}/index.ts`;
      strSelector = `export { DefaultPage } from "./Default";`;
      strFiles = [`export { ${namePage}Page } from "./${namePage}";`];
      updates.push(
        updateFiles({ type: "REPLACE", filePath, strSelector, strFiles })
      );
      // update page exports
      filePath = `${dirApp}/pages/index.ts`;
      strSelector = `export * from "./Home";`;
      strFiles = [`\nexport * from "./${namePage}";`];
      updates.push(
        updateFiles({ type: "AFTER", filePath, strSelector, strFiles })
      );
      // update imports routes
      filePath = `${dirApp}/routes/routes.ts`;
      strSelector = `} from "@/app/${nameApp}/pages";`;
      strFiles = [`,${namePage}Page} from "@/app/${nameApp}/pages";`];
      updates.push(
        updateFiles({ type: "REPLACE", filePath, strSelector, strFiles })
      );
      return Promise.all(updates);
    })
    .then(() => {
      // update title of creating file
      filePath = `${dirAppPage}/${namePage}.tsx`;
      strSelector = `DefaultPage`;
      strFiles = [`${namePage}Page`];
      return updateFiles({ type: "REPLACE", filePath, strSelector, strFiles });
    })
    .then(() => {
      // update enum routes
      filePath = `${dirApp}/routes/routes.ts`;
      strSelector = `export enum ${capitalize(fileApp)}AppRoutes {`;
      strFiles = [
        `\n"${namePage.toUpperCase()}" = "${namePage.toLowerCase()}",`,
      ];
      return updateFiles({ type: "AFTER", filePath, strSelector, strFiles });
    })
    .then(() => {
      // update object routes
      filePath = `${dirApp}/routes/routes.ts`;
      strSelector = `];`;
      strFiles = [
        `  {`,
        `\n    path: "${namePage.toLowerCase()}",`,
        `\n    component: ${namePage}Page,`,
        `\n    name: ${capitalize(
          fileApp
        )}AppRoutes.${namePage.toUpperCase()},`,
        `\n  },\n`,
      ];
      updateFiles({ type: "BEFORE", filePath, strSelector, strFiles });
    })
    .catch(console.log)
    .finally(() => console.log(`Page routed '${namePage}' created...`));
};

const updateFilesVite = async (): Promise<void> => {
  // Fonts in index.html
  const strFiles = [
    `\t<link rel="preconnect" href="https://fonts.googleapis.com" />\n`,
    `\t\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n`,
    `\t\t<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />\n`,
  ];
  const filePath = path.join(CURRENT_DIR, "index.html");
  const strSelector = "</head>";
  await updateFiles({
    type: "BEFORE",
    filePath,
    strSelector,
    strFiles,
  });
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
        generateReactAppWithRoute(filename);
        return;
      }
      if (mycommand === "ap") {
        const [nameApp, namePage] = filename.split("/");
        generateReactPageRoute(nameApp, namePage);
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
          return updateFilesVite();
        })
        .then(() => (!isRouterAvailable() ? "" : addDirsViteInitRouter()))
        .then((msg: string) => (message += msg))
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
