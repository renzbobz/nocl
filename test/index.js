import nocl, { Nocl } from "../lib/index.js";

nocl.startSession(import.meta.dirname + "/nocl.log");

nocl.log("nocl.log");
nocl.info("nocl.info");
nocl.success("nocl.success");
nocl.error("nocl.error");
nocl.warning("nocl.warning");
nocl.plus("nocl.plus");
nocl.minus("nocl.minus");
nocl.comment("nocl.comment");
nocl.ts("nocl.ts");

console.log("----------------------------------------------------");

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

console.log("----------------------------------------------------");

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

console.log("----------------------------------------------------");

nocl.log("without symbolPrefix");
nocl.symbolPrefix = {
  symbol: "1/10",
};
nocl.log("with symbolPrefix");

console.log("----------------------------------------------------");

nocl.log("without symbolPostfix");
nocl.symbolPostfix = {
  symbol: "username",
};
nocl.log("with symbolPostfix");

console.log("----------------------------------------------------");

nocl.info("with encloseSymbol");
nocl.encloseSymbolColor = "blue";
nocl.info("with encloseSymbolColor");
nocl.encloseSymbolColor = null;
nocl.encloseSymbol = false;
nocl.info("without encloseSymbol");
nocl.encloseSymbol = true;

console.log("----------------------------------------------------");

nocl.log("{yellow without using chalk template}");
nocl.useChalkTemplate = true;
nocl.log("{yellow using chalk template}");

console.log("----------------------------------------------------");

const data = { a: 1 };
data.b = data;
nocl.log(data);

console.log("----------------------------------------------------");

const n = new Nocl({ useChalkTemplate: true });
n.group("ms:");
n.log("a");
n.group("{yellow members3:}");
n.log("b");
n.groupEnd();
n.log("c");
n.groupEnd();
n.log("d");

n.nl(2);

console.log("----------------------------------------------------");

n.log("{red n}");
const n2 = nocl.clone();
n2.useChalkTemplate = false;
n2.log("{red n2}");

nocl.log("{red nocl}");

console.log("----------------------------------------------------");

nocl.line();
nocl.line({ color: "magenta", symbol: "~" });
nocl.line({ label: "Left" });
nocl.line({ label: "{white.inverse  Center }", align: "center" });
nocl.line({ color: "green", symbol: "~", label: "Right", align: "right" });
nocl.line({ symbol: " ", label: "{white.inverse  Center }", align: "center" });
nocl.line({ symbol: " ", label: "{white.inverse  Left }", align: "left" });
nocl.line({ symbol: " ", label: "{white.inverse  Right }", align: "right" });

nocl.endSession();
