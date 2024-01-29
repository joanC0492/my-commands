import { Schema, model } from "mongoose";
import { Iuser } from "../domain/user.interface";

const UserSchema = new Schema<Iuser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// "nombre_de_la_coleccion"
const UserModel = model("users", UserSchema);
export default UserModel;
