import { createContext, useContext, useState, ReactNode } from "react";

interface GroupContextProps {
  groupId: number;
  setGroupId: (id: number) => void;
}

const GroupContext = createContext<GroupContextProps | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [groupId, setGroupId] = useState<number>(0);

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
