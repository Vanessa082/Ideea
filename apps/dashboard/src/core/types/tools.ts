export type MenuItem = {
  label: string;
  icon: any;
  action: () => void;
  shortcut?: string;
}

export type MenuSeparator = {
  type: "separator";
}

export type MenuItems = (MenuItem | MenuSeparator)[];