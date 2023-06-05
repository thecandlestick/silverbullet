import { AppCommand } from "./hooks/command.ts";

export type PageMeta = {
  name: string;
  lastModified: number;
  lastOpened?: number;
  perm: "ro" | "rw";
} & Record<string, any>;

export type AttachmentMeta = {
  name: string;
  contentType: string;
  lastModified: number;
  size: number;
  perm: "ro" | "rw";
};

// Used by FilterBox
export type FilterOption = {
  name: string;
  orderId?: number;
  hint?: string;
} & Record<string, any>;

export type Notification = {
  id: number;
  message: string;
  type: "info" | "error";
  date: Date;
};

export type PanelMode = number;

export type BuiltinSettings = {
  indexPage: string;
  // Format: compatible with docker ignore
  spaceIgnore?: string;
};

export type PanelConfig = {
  mode?: PanelMode;
  html?: string;
  script?: string;
};

export type AppViewState = {
  currentPage?: string;
  currentPageMeta?: PageMeta;
  isLoading: boolean;
  showPageNavigator: boolean;
  showCommandPalette: boolean;
  showCommandPaletteContext?: string;
  unsavedChanges: boolean;
  synced: boolean;
  panels: { [key: string]: PanelConfig };
  allPages: PageMeta[];
  commands: Map<string, AppCommand>;
  notifications: Notification[];
  recentCommands: Map<string, Date>;

  uiOptions: {
    vimMode: boolean;
    darkMode: boolean;
    forcedROMode: boolean;
  };

  // Filter box
  showFilterBox: boolean;
  filterBoxLabel: string;
  filterBoxPlaceHolder: string;
  filterBoxOptions: FilterOption[];
  filterBoxHelpText: string;
  filterBoxOnSelect: (option: FilterOption | undefined) => void;

  // Prompt
  showPrompt: boolean;
  promptMessage?: string;
  promptDefaultValue?: string;
  promptCallback?: (value: string | undefined) => void;

  // Confirm
  showConfirm: boolean;
  confirmMessage?: string;
  confirmCallback?: (value: boolean) => void;
};

export const initialViewState: AppViewState = {
  isLoading: false,
  showPageNavigator: false,
  showCommandPalette: false,
  unsavedChanges: false,
  synced: true,
  uiOptions: {
    vimMode: false,
    darkMode: false,
    forcedROMode: false,
  },
  panels: {
    lhs: {},
    rhs: {},
    bhs: {},
    modal: {},
  },
  allPages: [],
  commands: new Map(),
  recentCommands: new Map(),
  notifications: [],
  showFilterBox: false,
  filterBoxHelpText: "",
  filterBoxLabel: "",
  filterBoxOnSelect: () => {},
  filterBoxOptions: [],
  filterBoxPlaceHolder: "",

  showPrompt: false,
  showConfirm: false,
};

export type Action =
  | { type: "page-loaded"; meta: PageMeta }
  | { type: "page-loading"; name: string }
  | { type: "pages-listed"; pages: PageMeta[] }
  | { type: "page-changed" }
  | { type: "page-saved" }
  | { type: "sync-change"; synced: boolean }
  | { type: "start-navigate" }
  | { type: "stop-navigate" }
  | {
    type: "update-commands";
    commands: Map<string, AppCommand>;
  }
  | { type: "show-palette"; context?: string }
  | { type: "hide-palette" }
  | { type: "show-notification"; notification: Notification }
  | { type: "dismiss-notification"; id: number }
  | {
    type: "show-panel";
    id: "rhs" | "lhs" | "bhs" | "modal";
    config: PanelConfig;
  }
  | { type: "hide-panel"; id: string }
  | { type: "command-run"; command: string }
  | {
    type: "show-filterbox";
    options: FilterOption[];
    placeHolder: string;
    helpText: string;
    label: string;
    onSelect: (option: FilterOption | undefined) => void;
  }
  | { type: "hide-filterbox" }
  | {
    type: "show-prompt";
    message: string;
    defaultValue: string;
    callback: (value: string | undefined) => void;
  }
  | { type: "hide-prompt" }
  | {
    type: "show-confirm";
    message: string;
    callback: (value: boolean) => void;
  }
  | { type: "hide-confirm" }
  | { type: "set-ui-option"; key: string; value: any };
