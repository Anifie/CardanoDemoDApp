import axios from "axios";

const isDebug = process.env.NEXT_PUBLIC_ENV_MODE !== "production";
console.log("current env", process.env.NEXT_PUBLIC_ENV_MODE);
export var logger = isDebug ? console.log.bind(console) : function () { };

export const errLog = async (msg, extra) => {
  console.log("errlog", msg);
};

export const logSS = (msg) => {
  try {
    const cacheLog = sessionStorage.getItem("honda-grep-log");
    if (cacheLog) {
      const jsonLog = JSON.parse(cacheLog);
      jsonLog.push(msg);
      sessionStorage.setItem("honda-grep-log", JSON.stringify(jsonLog));
    } else {
      sessionStorage.setItem("honda-grep-log", JSON.stringify([]));
    }
  } catch {
    console.log("Grep fail");
  }
};
export const getLSLog = () => {
  const log = JSON.parse(sessionStorage.getItem("honda-grep-log") || "[]");
  return log;
};
