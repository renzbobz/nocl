import { WriteStream } from "node:fs";

export type ThemeOpt = {
  color?: string;
  symbol?: string;
  symbolColor?: string;
  noSymbol?: boolean;
  encloseSymbolColor?: string;
};

export type ThemeOptTS = ThemeOpt & {
  options?: Intl.DateTimeFormatOptions;
  locales?: Intl.LocalesArgument;
};

export type ThemeOptObject = ThemeOpt & ThemeOptTS;

export type ThemeOptName = keyof Theme;

export interface Theme {
  log?: ThemeOpt;
  info?: ThemeOpt;
  warning?: ThemeOpt;
  error?: ThemeOpt;
  success?: ThemeOpt;
  plus?: ThemeOpt;
  minus?: ThemeOpt;
  ts?: ThemeOptTS;
  comment?: ThemeOpt;
}

type SymbolFixType = ThemeOpt | ((theme: ThemeOptObject) => SymbolFixType);

export interface Option {
  theme?: Theme;
  /** Symbol to be prepend to theme's symbol */
  symbolPrefix?: SymbolFixType;
  /** Symbol to be append to theme's symbol */
  symbolPostfix?: SymbolFixType;
  /** Enclose symbol with square brackets (default: true) */
  encloseSymbol?: boolean;
  /** Color text with chalk template (default: false) */
  useChalkTemplate?: boolean;
  sessionWS?: WriteStream;
  indentation?: number;
  stdout?: NodeJS.WriteStream;
  /** default color for all enclose symbol */
  encloseSymbolColor?: string;
  /** disable symbol to all themes */
  noSymbol?: boolean;
}
