import { SysCallMapping } from "../../plugos/system.ts";
import { parse } from "../markdown_parser/parse_tree.ts";
import type { ParseTree } from "$sb/lib/tree.ts";
import { builtinLanguages, languageFor } from "../languages.ts";

export function languageSyscalls(): SysCallMapping {
  return {
    "language.parseLanguage": (
      _ctx,
      language: string,
      code: string,
    ): ParseTree => {
      const lang = languageFor(language);
      if (!lang) {
        throw new Error(`Unknown language ${language}`);
      }
      return parse(lang, code);
    },
    "language.listLanguages": (
      _ctx,
    ): string[] => {
      return Object.keys(builtinLanguages);
    },
  };
}
