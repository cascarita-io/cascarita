import React, { useEffect, useRef } from "react";

import { CopyIcon } from "@radix-ui/react-icons";

import { TrashBinIcon } from "../../../assets/Icons";
import { DraggableSubMenuProps } from "./types";

const DraggableSubMenu: React.FC<DraggableSubMenuProps> = ({
  onDelete,
  onClose,
  onCopy,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        right: -55,
        padding: 8,
        borderLeft: "1px solid #AAAAAA",
        gap: 10,
      }}>
      <button type="button" onClick={onDelete}>
        <TrashBinIcon width={20} height={20} color={"#AAAAAA"} />
      </button>
      <button type="button" onClick={onCopy}>
        <CopyIcon width={20} height={20} color={"#AAAAAA"} />
      </button>
    </div>
  );
};

export default DraggableSubMenu;
