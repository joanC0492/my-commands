import "dotenv/config";

// Configuracion base para las variables de entorno
export const config = {
  port: parseInt(process.env.PORT!) || 4004,
  dbConnection: process.env.DB_CNN!,
  secretJwtSeed: process.env.SECRET_JWT_SEED,
};
