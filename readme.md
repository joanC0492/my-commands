# Installation
```bash
npm uninstall -g my-commands-jc && npm i -g my-commands-jc
```
---
---
# Start vite project
```bash
jc vite init
```
## Creating a component

```bash
jc g <componentName> <filePath>
```

## Creating a interface
```bash
jc i <interfaceName> <filePath>
```
---
---
# Start vite project with router
```bash
jc vite init --router
```
## Creating App in router
```bash
jc g a <nameApp>
```
## Creating App in router
```bash
jc g ap <nameApp>
```
---
---
# Start express project
```bash
jc express-api init
```



npm i yargs
npm i --save-dev @types/yargs

npm install chalk

import fs from "fs";
import path from "path";
import yargs from "yargs";
import chalk from 'chalk';

# Ejecutando y mandando parametros

npm install --save-dev ts-node
npx ts-node src/index.ts param1 param2

# Publicando proyecto

npm adduser
npm publish

# Si hacemos un cambio debemos cambiar la version de lo contrario no dejara subir el paquete

"version": "1.1.0"

# Luego publicamos

npm publish

# Antes de ejecutar el npm publish, npm se fija en el package.json "prepare"

"prepare": "npm run build"

# Creamos archivo .npmignore para indicar que archivos ignorar al subir a npm

.npmignore

#

npm install commander

# Ejecutar mis pruebas

rm -rf pruebas && mkdir pruebas && cd pruebas
npx ts-node ../src/index.ts express-api init

rm -rf ./\*
npx ts-node ../src/index.ts express-api init

rm -rf node_modules src package-lock.json postcss.config.js tailwind.config.js tsconfig.json vite.config.ts
npx ts-node ../src/index.ts vite init --router
