import { ReactNode, createContext, useContext, useState } from "react";

import Cookies from "js-cookie";

interface GroupContextProps {
  groupId: number;
  setGroupId: (id: number) => void;
}

const GroupContext = createContext<GroupContextProps | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groupId, setGroupId] = useState<number>(
    Number(Cookies.get("group_id")) || 0,
  );

  return (
    <GroupContext.Provider value={{ groupId, setGroupId }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
};
