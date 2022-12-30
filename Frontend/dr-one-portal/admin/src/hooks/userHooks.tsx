import {
  ReactNode,
  useContext,
  createContext,
  useEffect,
  useState,
} from "react";
import { listenEvent } from "@dr-one/utils";

type IUser = {
  user?: any;
};
type ProviderUserProps = {
  children: ReactNode;
  value: IUser;
};

const userContext = createContext<IUser>({});

export function useUser() {
  return useContext(userContext);
}

export function ProviderUser({ children, value }: ProviderUserProps) {
  const [user, setUser] = useState<any>(value.user);
  useEffect(() => {
    listenEvent("[APP SOURCE OFF ACTION]/[ACTION NAME]", (event) => {
      setUser(event.detail);
    });
  }, []);
  return (
    <userContext.Provider value={{ user }}>{children}</userContext.Provider>
  );
}
