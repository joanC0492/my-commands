import { useContext } from "react";
import { GlobalContext } from "@/store/context/GlobalProvider";

export const useGlobalContext = () => useContext(GlobalContext);
