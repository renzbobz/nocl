export type ThemeOpt = {
  color: string;
  symbol?: string;
  symbolColor?: string;
};

export type ThemeOptTS = ThemeOpt & {
  options?: Intl.DateTimeFormatOptions;
  locales?: Intl.LocalesArgument;
};

export type ThemeOptObject = ThemeOpt & ThemeOptTS;

export type ThemeOptName = keyof Theme;

export interface Theme {
  log: ThemeOpt;
  info: ThemeOpt;
  warning: ThemeOpt;
  error: ThemeOpt;
  success: ThemeOpt;
  plus: ThemeOpt;
  minus: ThemeOpt;
  ts: ThemeOptTS;
  comment: ThemeOpt;
}

export interface Option {
  theme?: Theme;
  /** Symbol to be prepend to theme's symbol */
  symbolPrefix?: Omit<ThemeOpt, "color">;
  /** Symbol to be append to theme's symbol */
  symbolPostfix?: Omit<ThemeOpt, "color">;
  /** Enclose symbol with square brackets */
  encloseSymbol?: boolean;
  /** Color text with chalk template */
  useChalkTemplate?: boolean;
}
