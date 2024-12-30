import { WriteStream, createWriteStream } from "node:fs";
import chalk from "chalk";
import { template as chalkTemplate } from "chalk-template";
import { merge } from "ts-deepmerge";
import stripAnsi from "strip-ansi";
import JSONStringifySafe from "json-stringify-safe";
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
  comment: {
    color: "gray",
    symbol: "#",
    symbolColor: "gray",
  },
};

export default class Nocl implements Option {
  symbolPrefix;
  symbolPostfix;
  encloseSymbol;
  useChalkTemplate;
  sessionWS?: WriteStream;
  indentation;
  stdout;
  #originalStdoutWrite;
  #theme;
  #sessionMsgs: string[] = [];

  constructor(opts: Option = {}) {
    this.symbolPrefix = opts.symbolPrefix;
    this.symbolPostfix = opts.symbolPostfix;
    this.encloseSymbol = opts.encloseSymbol ?? true;
    this.useChalkTemplate = opts.useChalkTemplate ?? false;
    this.indentation = opts.indentation ?? 0;
    this.sessionWS = opts.sessionWS;
    this.stdout = opts.stdout ?? process.stdout;
    this.#originalStdoutWrite = this.stdout.write.bind(this.stdout);
    this.#theme = merge(defaultTheme, opts.theme || {});
  }

  get theme() {
    return this.#theme;
  }

  set theme(value: Partial<Theme>) {
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
      let _text = `{${color} ${text}}`;
      return chalkTemplate(_text);
    } catch (err) {
      // failed to color text fallback
      let _text = color.startsWith("#") ? chalk.hex(color)(text) : chalk.keyword(color)(text);
      return _text;
    }
  }

  #colorMsgs(msgs: any[], color: string) {
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

  #logSession(coloredMsgs: any[]) {
    const ws = this.sessionWS!;
    const message = coloredMsgs
      .map((msg) =>
        stripAnsi(typeof msg == "object" ? JSONStringifySafe(msg) : msg?.toString?.() || "")
      )
      .join(" ");
    const date = new Date();
    const timestamp =
      date.toLocaleTimeString(undefined, { hour12: false }) + "." + date.getMilliseconds();
    this.#sessionMsgs.push(timestamp + " " + message);
    const writeMsgs = () => {
      for (const msg of this.#sessionMsgs) {
        if (ws.write(msg)) {
          this.#sessionMsgs.shift();
        } else {
          ws.once("drain", writeMsgs);
          break;
        }
      }
    };
    writeMsgs();
  }

  #log({ theme, msgs }: { theme: ThemeOptObject; msgs: any[] }) {
    const coloredMsgs = this.#colorMsgs(msgs, theme.color);
    const coloredSymbol = this.#getSymbol(theme);
    const coloredSymbolPrefix = this.#getSymbol({ color: "gray", ...(this.symbolPrefix || {}) });
    const coloredSymbolPostfix = this.#getSymbol({ color: "gray", ...(this.symbolPostfix || {}) });
    const symbols = [coloredSymbolPrefix, coloredSymbol, coloredSymbolPostfix].filter((v) => v);
    const prefix = symbols.join(this.encloseSymbol ? "" : "|");
    if (prefix) coloredMsgs.unshift(prefix);
    if (this.indentation > 0) coloredMsgs[0] = "  ".repeat(this.indentation) + coloredMsgs[0];
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

  comment(...msgs: any[]) {
    const theme = this.#getThemeOpt("comment");
    this.#log({ theme, msgs });
  }

  startSession(filepath: string, options?: any) {
    if (!filepath) throw new Error("filepath required");
    const ws = createWriteStream(filepath, options);
    ws.once("finish", () => ws.close());
    this.sessionWS = ws;

    this.stdout.write = (chunk, ...args) => {
      if (typeof chunk === "string" && this.sessionWS) {
        this.#logSession([chunk.toString()]);
      }
      return this.#originalStdoutWrite(chunk, ...args as any);
    };
  }


  endSession() {
    this.sessionWS?.end();
    this.sessionWS = undefined;
    this.stdout.write = this.#originalStdoutWrite;
  }

  group(...msgs: any[]) {
    this.log(...msgs);
    this.indentation++;
  }

  groupEnd() {
    this.indentation--;
  }

  /** log new line */
  nl() {
    this.log("");
  }

  /** new instance with same settings */
  clone(opts: Option = {}) {
    return new Nocl(merge(
      { 
        sessionWS: this.sessionWS, 
        theme: this.#theme, 
        indentation: this.indentation, 
        useChalkTemplate: this.useChalkTemplate,
        encloseSymbol: this.encloseSymbol,
        symbolPostfix: this.symbolPostfix,
        symbolPrefix: this.symbolPrefix
      },
      opts
    ));
  }
}