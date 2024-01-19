#!/usr/bin/env node

console.clear();
import spinners from "cli-spinners";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { exec } from "child_process";
import { generateComponentTemplate } from "./templates/react-component";

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

const argv = yargs
  .command(
    "g c <DirAndComponent>",
    "Genera un componente de React",
    (yargs) => {
      yargs.positional("DirAndComponent", {
        describe: "Nombre del componente a crear",
        type: "string",
      });
    },
    (argv) => {
      const { DirAndComponent } = argv as yargs.ArgumentsCamelCase<{
        DirAndComponent: string;
      }>;

      const componentName = DirAndComponent.split("/").reverse()[0];
      const dir = DirAndComponent.replace(componentName, "");      

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
      const componentContent = generateComponentTemplate(
        componentName as string
      );

      // Escribir el contenido del componente en el archivo
      fs.writeFileSync(componentFilePath, componentContent, "utf-8");
      console.log(`Componente ${componentFileName} generado exitosamente`);
      console.log(componentFilePath);
    }
  )
  .command(
    "vite init",
    "Creamos el espacio de trabajo para un proyecto react con Vite",
    (yargs) => {
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
          console.log("\n✅ `init vite` se ha ejecutado correctamente");
        }
      );

      enum DIRS {
        viteTailwind = "vite-tailwind",
      }
      const { viteTailwind } = DIRS as { viteTailwind: string };

      const sourceFolder = path.join(TEMPLATE, viteTailwind);
      const targetFolder = process.cwd();
      copyFolderSync(sourceFolder, targetFolder);
    }
  )
  .demandCommand(
    1,
    "Debes proporcionar un comando para generar un componente de React"
  )
  .help().argv;

export { argv };
