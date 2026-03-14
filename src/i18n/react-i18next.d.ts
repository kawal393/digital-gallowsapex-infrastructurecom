import "react-i18next";
import { ReactNode } from "react";

declare module "react-i18next" {
  interface CustomTypeOptions {
    // Prevent react-i18next from widening the children type
    defaultNS: "translation";
  }
  
  // Override ReactI18NextChildren to be compatible with ReactNode
  type ReactI18NextChildren = ReactNode;
}
