// Request Express add propertie "auth"
declare global {
  namespace Express {
    interface Request {
      auth?: {
        uidAuthenticated: string;
        nameAuthenticated: string;
      };
    }
  }
}

// const payload = { uid, name };
export interface PayloadData {
  // Lo que recibimos al generar
  uid: string;
  name: string;
}
export interface Payload extends PayloadData {
  // Siempre
  iat: number;
  exp: number;
}

export type HttpStatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 204
  | 206
  | 300
  | 301
  | 302
  | 304
  | 307
  | 308
  | 400
  | 401
  | 403
  | 404
  | 405
  | 409
  | 429
  | 500
  | 501
  | 502
  | 503
  | 504;