# nocl

Styled nodejs console logger

## Installation

```
npm i nocol
```

## Usage

```js
import nocl, { Nocl } from "nocol";

nocl.log("Hello world!");
```

Default export: `nocl` - an instance of _Nocl_ class

### Create new instance

```js
const nocl2 = new Nocl(options);
nocl2.log("Hello world from nocl2!");
```

### Class init options / properties

You can also modify the properties directly to change the styling without creating new instance

| name             | type    | default      | description                            |
| ---------------- | ------- | ------------ | -------------------------------------- |
| symbolPrefix     | object  |              | Symbol to be prepend to theme's symbol |
| symbolPostfix    | object  |              | Symbol to be append to theme's symbol  |
| encloseSymbol    | boolean | true         | Enclose symbol with square brackets    |
| useChalkTemplate | boolean | false        | Color text with chalk template         |
| theme            | object  | DefaultTheme | Logging theme style object             |

## Default theme

| name    | color   | symbol           | symbolColor |
| ------- | ------- | ---------------- | ----------- |
| log     | #b6b5b5 |                  | #b6b5b5     |
| info    | #105ae4 | i                | #105ae4     |
| error   | #ea4141 | x                | #ea4141     |
| success | #2cc22c | ✓                | #2cc22c     |
| warning | #e7a414 | !                | #e7a414     |
| ts      | #b6b5b5 | {curr_timestamp} | #636363     |
| plus    | green   | +                | green       |
| minus   | red     | -                | red         |
| comment | gray    | #                | gray        |

_For color or symbolColor value, you can pass hex color or chalk ForegroundColor_

![themes](https://github.com/renzbobz/nocl/blob/main/examples/themes.png?raw=true)

## Examples

### Modifying theme

This will merge into current instance theme

```js
nocl.info("default theme");
const theme = {
  info: {
    symbol: "info",
    symbolColor: "#074880",
  },
};
nocl.theme = theme;
nocl.info("modified theme");
// OR
const nocl3 = new Nocl({
  theme,
});
nocl3.info("modified theme from nocl3");
```

![modified_info_theme](https://github.com/renzbobz/nocl/blob/main/examples/modified_info_theme.png?raw=true)

### Modifying theme: ts

Change timestamp display

```js
nocl.ts("default theme: ts");
nocl.theme = {
  ts: {
    // type LocalesArgument
    locales: undefined,
    // type DateTimeFormatOptions
    options: {
      hour12: true,
      timeStyle: "medium",
    },
  },
};
nocl.ts("modified theme: ts");
```

![modified_ts_theme](https://github.com/renzbobz/nocl/blob/main/examples/modified_ts_theme.png?raw=true)

### Using symbolPrefix

```js
nocl.log("without symbolPrefix");
nocl.symbolPrefix = {
  symbol: "1/10",
};
nocl.log("with symbolPrefix");
```

![symbolPrefix](https://github.com/renzbobz/nocl/blob/main/examples/symbolPrefix.png?raw=true)

### Using symbolPostfix

```js
nocl.log("without symbolPostfix");
nocl.symbolPostfix = {
  symbol: "username",
};
nocl.log("with symbolPostfix");
```

![symbolPostfix](https://github.com/renzbobz/nocl/blob/main/examples/symbolPostfix.png?raw=true)

### Using encloseSymbol

```js
nocl.info("with encloseSymbol");
nocl.encloseSymbol = false;
nocl.info("without encloseSymbol");
```

![encloseSymbol](https://github.com/renzbobz/nocl/blob/main/examples/encloseSymbol.png?raw=true)

### Using useChalkTemplate

This will fallback to chalk if there was an error coloring using template

```js
nocl.log("{yellow without using chalk template}");
nocl.useChalkTemplate = true;
nocl.log("{yellow using chalk template}");
```

![useChalkTemplate](https://github.com/renzbobz/nocl/blob/main/examples/useChalkTemplate.png?raw=true)

### Using session log

```js
nocl.startSession(filepath, options); // createWriteStream
nocl.log("hello");
nocl.endSession();
```

![sessionLogs](https://github.com/renzbobz/nocl/blob/main/examples/session-logs.png?raw=true)

---

Check [tests](https://github.com/renzbobz/nocl/tree/main/test)

## TODO

- [x] session logging

## Changelog

- 1.1.3
  - fixed chalk template
- 1.1.2
  - added new theme "comment"
- 1.1.1
  - added object support for session log
- 1.1.0
  - added session logging
- 1.0.2
  - stable version
