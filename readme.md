# Installation
```bash
npm i -g my-commands-jc
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


rm -rf ./*
npx ts-node ../src/index.ts express-api init