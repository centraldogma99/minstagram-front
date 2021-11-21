/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from "react";

const ToastContext = createContext<{ setToastOpen: (b: boolean) => void, toastMessage: string, setToastMessage: (s: string) => void }>({
  setToastOpen: (b: boolean) => { },
  toastMessage: "",
  setToastMessage: (s: string) => { }
})

export default ToastContext;

