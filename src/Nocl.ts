import chalk from "chalk";
import { merge } from "ts-deepmerge";
import type { Theme, Option, ThemeOptName, ThemeOptObject, ThemeOpt } from "./types";

const defaultTheme: Theme = {
  log: {
    color: "#b6b5b5",
    symbolColor: "#b6b5b5",
  },
  info: {
    color: "#105ae4",
    symbol: "i",
    symbolColor: "#105ae4",
  },
  error: {
    color: "#ea4141",
    symbol: "x",
    symbolColor: "#ea4141",
  },
  success: {
    color: "#2cc22c",
    symbol: "✓",
    symbolColor: "#2cc22c",
  },
  warning: {
    color: "#e7a414",
    symbol: "!",
    symbolColor: "#e7a414",
  },
  ts: {
    color: "#b6b5b5",
    symbolColor: "#636363",
    locales: undefined,
    options: {
      hour12: false,
      timeStyle: "medium",
    },
  },
  plus: {
    color: "green",
    symbol: "+",
    symbolColor: "green",
  },
  minus: {
    color: "red",
    symbol: "-",
    symbolColor: "red",
  },
};

export default class Nocl implements Option {
  symbolPrefix;
  symbolPostfix;
  encloseSymbol;
  useChalkTemplate;
  #theme;

  constructor(opts: Option = {}) {
    this.symbolPrefix = opts.symbolPrefix;
    this.symbolPostfix = opts.symbolPostfix;
    this.encloseSymbol = opts.encloseSymbol ?? true;
    this.useChalkTemplate = opts.useChalkTemplate ?? false;
    this.#theme = merge(defaultTheme, opts.theme || {});
  }

  get theme() {
    return this.#theme;
  }

  set theme(value) {
    this.#theme = merge(this.#theme, value);
  }

  #getThemeOpt(name: ThemeOptName) {
    const opt = this.theme[name] as ThemeOptObject;
    if (typeof opt != "object")
      throw new Error(`Invalid theme opt type: ${name}=${opt}. Must be an object.`);
    return opt;
  }

  #colorText(text: string, color: string) {
    try {
      if (!this.useChalkTemplate) throw 1;
      // this will throw an error if failed to color text with template
      let _text = /^{.*}$/.test(text) ? text : `{${color} ${text}}`;
      let args = [_text] as { [key: string]: any };
      args.raw = [_text];
      _text = chalk(args);
      return _text;
    } catch (err) {
      // failed to color text fallback
      let _text = color.startsWith("#") ? chalk.hex(color)(text) : chalk.keyword(color)(text);
      return _text;
    }
  }

  #colorMsgs(msgs: string[], color: string) {
    for (const index in msgs) {
      const msg = msgs[index];
      if (typeof msg == "string") {
        msgs[index] = this.#colorText(msg, color);
      }
    }
    return msgs;
  }

  #getSymbol({ color, symbol, symbolColor }: ThemeOpt) {
    if (!symbol) return;
    if (this.encloseSymbol) symbol = `[${symbol}]`;
    symbol = this.#colorText(symbol, symbolColor || color);
    return symbol;
  }

  #log({ theme, msgs }: { theme: ThemeOptObject; msgs: any[] }) {
    const coloredMsgs = this.#colorMsgs(msgs, theme.color);
    const coloredSymbol = this.#getSymbol(theme);
    const coloredSymbolPrefix = this.#getSymbol({ color: "gray", ...(this.symbolPrefix || {}) });
    const coloredSymbolPostfix = this.#getSymbol({ color: "gray", ...(this.symbolPostfix || {}) });
    const symbols = [coloredSymbolPrefix, coloredSymbol, coloredSymbolPostfix].filter((v) => v);
    const prefix = symbols.join(this.encloseSymbol ? "" : "|");
    if (prefix) coloredMsgs.unshift(prefix);
    console.log(...coloredMsgs);
  }

  log(...msgs: any[]) {
    const theme = this.#getThemeOpt("log");
    this.#log({ theme, msgs });
  }

  info(...msgs: any[]) {
    const theme = this.#getThemeOpt("info");
    this.#log({ theme, msgs });
  }

  success(...msgs: any[]) {
    const theme = this.#getThemeOpt("success");
    this.#log({ theme, msgs });
  }

  error(...msgs: any[]) {
    const theme = this.#getThemeOpt("error");
    this.#log({ theme, msgs });
  }

  warning(...msgs: any[]) {
    const theme = this.#getThemeOpt("warning");
    this.#log({ theme, msgs });
  }

  plus(...msgs: any[]) {
    const theme = this.#getThemeOpt("plus");
    this.#log({ theme, msgs });
  }

  minus(...msgs: any[]) {
    const theme = this.#getThemeOpt("minus");
    this.#log({ theme, msgs });
  }

  ts(...msgs: any[]) {
    const theme = this.#getThemeOpt("ts");
    theme.symbol = new Date().toLocaleString(theme.locales, theme.options);
    this.#log({ theme, msgs });
  }
}
