import { UserProvider } from "@/contexts/UserContext";
import React from "react";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};
