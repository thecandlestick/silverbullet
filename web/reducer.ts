import { Action, AppViewState } from "./types.ts";

export default function reducer(
  state: AppViewState,
  action: Action,
): AppViewState {
  // console.log("Got action", action);
  switch (action.type) {
    case "page-loading":
      return {
        ...state,
        isLoading: true,
        currentPage: action.name,
      };
    case "page-loaded":
      return {
        ...state,
        isLoading: false,
        allPages: state.allPages.map((pageMeta) =>
          pageMeta.name === action.meta.name
            ? { ...pageMeta, lastOpened: Date.now() }
            : pageMeta
        ),
        currentPage: action.meta.name,
        currentPageMeta: action.meta,
      };
    case "page-changed":
      return {
        ...state,
        unsavedChanges: true,
      };
    case "page-saved":
      return {
        ...state,
        unsavedChanges: false,
      };
    case "sync-change":
      return {
        ...state,
        synced: action.synced,
      };
    case "start-navigate":
      return {
        ...state,
        showPageNavigator: true,
      };
    case "stop-navigate":
      return {
        ...state,
        showPageNavigator: false,
      };
    case "pages-listed": {
      // Let's move over any "lastOpened" times to the "allPages" list
      const oldPageMeta = new Map(
        [...state.allPages].map((pm) => [pm.name, pm]),
      );
      for (const pageMeta of action.pages) {
        const oldPageMetaItem = oldPageMeta.get(pageMeta.name);
        if (oldPageMetaItem && oldPageMetaItem.lastOpened) {
          pageMeta.lastOpened = oldPageMetaItem.lastOpened;
        }
      }
      return {
        ...state,
        allPages: action.pages,
      };
    }
    case "show-palette": {
      return {
        ...state,
        showCommandPalette: true,
        showCommandPaletteContext: action.context,
      };
    }
    case "hide-palette":
      return {
        ...state,
        showCommandPalette: false,
        showCommandPaletteContext: undefined,
      };
    case "command-run":
      return {
        ...state,
        recentCommands: state.recentCommands.set(action.command, new Date()),
      };
    case "update-commands":
      return {
        ...state,
        commands: action.commands,
      };
    case "show-notification":
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case "dismiss-notification":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    case "show-panel":
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.id]: action.config,
        },
      };
    case "hide-panel":
      return {
        ...state,
        panels: {
          ...state.panels,
          [action.id]: {},
        },
      };

    case "show-filterbox":
      return {
        ...state,
        showFilterBox: true,
        filterBoxOnSelect: action.onSelect,
        filterBoxPlaceHolder: action.placeHolder,
        filterBoxOptions: action.options,
        filterBoxLabel: action.label,
        filterBoxHelpText: action.helpText,
      };
    case "hide-filterbox":
      return {
        ...state,
        showFilterBox: false,
        filterBoxOnSelect: () => {},
        filterBoxPlaceHolder: "",
        filterBoxOptions: [],
        filterBoxHelpText: "",
      };
    case "show-prompt":
      return {
        ...state,
        showPrompt: true,
        promptDefaultValue: action.defaultValue,
        promptMessage: action.message,
        promptCallback: action.callback,
      };
    case "hide-prompt":
      return {
        ...state,
        showPrompt: false,
        promptDefaultValue: undefined,
        promptMessage: undefined,
        promptCallback: undefined,
      };
    case "show-confirm":
      return {
        ...state,
        showConfirm: true,
        confirmMessage: action.message,
        confirmCallback: action.callback,
      };
    case "hide-confirm":
      return {
        ...state,
        showConfirm: false,
        confirmMessage: undefined,
        confirmCallback: undefined,
      };
    case "set-ui-option":
      return {
        ...state,
        uiOptions: {
          ...state.uiOptions,
          [action.key]: action.value,
        },
      };
  }
  return state;
}
