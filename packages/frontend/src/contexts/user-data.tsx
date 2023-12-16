import { type ReactNode, useReducer, createContext, Dispatch } from "react";
import {
  type UserAccountDataResponse,
  InitialUserAccountData,
} from "shared/types/NovelAiApi/UserData";

interface Action {
  type: "set";
  payload?: UserAccountDataResponse;
}

export const UserDataContext = createContext(
  {} as {
    userData: UserAccountDataResponse | undefined;
    dispatchUserData: Dispatch<Action>;
  },
);

interface Props {
  children: ReactNode;
}

function reducer(
  state: UserAccountDataResponse,
  action: Action,
): UserAccountDataResponse {
  switch (action?.type) {
    case "set":
      if (!action?.payload) return state;
      return action?.payload;
    default:
      return state;
  }
}

export default function UserDataProvider({ children }: Props) {
  const [userData, dispatchUserData] = useReducer(
    reducer,
    InitialUserAccountData,
  );

  return (
    <UserDataContext.Provider value={{ userData, dispatchUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
