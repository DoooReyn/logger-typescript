/**
 * 短时间格式
 */
function shortDay(): string {
  let date: Date = new Date();
  let h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ms = date.getMilliseconds();
  return `${h}:${m}:${s}.${ms}`;
}


/**
 * 日志等级枚举
 * @enum {number}
 */
export enum E_Log_Level {
  Trace = 0,
  Info,
  Warn,
  Error,
  Silence
}

//console方法
const __ConsoleMethod__ = ["trace", "log", "warn", "error"];
const __ConsoleMethodName__ = ["追踪", "日志", "警告", "错误"];
const __ConsoleMethodColor__ = ["#cbd", "#afa", "#ff5", "#f88"];
const __CallChains__ = [E_Log_Level.Trace, E_Log_Level.Warn, E_Log_Level.Error];

/**
 * 等级日志
 * @description 低于设定等级的日志不会被输出
 * @class
 * @example
 * Logger.setLevel(E_Log_Level.Info);
 * let groups = [[1,2,3,4],{a:1,b:2,c: 3}];
 * Logger.trace("trace", ...groups);
 * Logger.info("info", ...groups);
 * Logger.warn("warn", ...groups);
 * Logger.error("error", ...groups);
 */
export class Logger {
  private constructor() {}

  /** 当前日志等级 */
  private static current_log_level: E_Log_Level = E_Log_Level.Trace;

  /**
   * 设置日志等级
   * @param level
   */
  public static setLevel(level: E_Log_Level) {
    this.current_log_level = level;
  }

  /**
   * 获得日志等级
   * @returns LOG_LEVEL
   */
  public static getLevel(): E_Log_Level {
    return this.current_log_level;
  }

  /**
   * 是否完全开放
   * @returns boolean
   */
  public static isFullOpen(): boolean {
    return this.current_log_level === E_Log_Level.Trace;
  }

  /**
   * 是否全部关闭
   * @returns boolean
   */
  public static isSilence(): boolean {
    return this.current_log_level === E_Log_Level.Silence;
  }

  /**
   * 根据日志等级判定是否可用
   * @param level 日志等级
   */
  private static isValid(level: E_Log_Level): boolean {
    return !this.isSilence() && level >= this.current_log_level;
  }

  /**
   * 输出日志内容
   * @param level 日志等级
   * @param label 分组标签
   * @param groups 分组数据
   */
  private static applyGroup(level: E_Log_Level, label: string, ...groups: any) {
    if (!this.isValid(level)) {
      return;
    }

    //渲染日志前置标记
    let color = __ConsoleMethodColor__[level];
    let args = [
      `%c${label} %c${shortDay()}`,
      `font-weight:bold;background:${color};`,
      `font-weight:bold;background:#ffb;`
    ];

    //输出日志内容
    let group_method =
      label.length === 0 || label.indexOf("@") >= 0
        ? "group"
        : "groupCollapsed";
    console[group_method](...args);
    for (let group of groups) {
      console.log(group);
    }
    if (__CallChains__.includes(level)) {
      console[__ConsoleMethod__[level]]("调用链回溯");
    }
    console.groupEnd();
  }

  /**
   * 打印跟踪日志
   * @param args
   */
  public static trace(label: string, ...args: any): void {
    this.isValid(E_Log_Level.Trace) &&
      this.applyGroup(E_Log_Level.Trace, label, ...args);
  }

  /**
   * 打印信息日志
   * @param args
   */
  public static info(label: string, ...args: any): void {
    this.isValid(E_Log_Level.Info) &&
      this.applyGroup(E_Log_Level.Info, label, ...args);
  }

  /**
   * 打印警告日志
   * @param args
   */
  public static warn(label: string, ...args: any): void {
    this.isValid(E_Log_Level.Warn) &&
      this.applyGroup(E_Log_Level.Warn, label, ...args);
  }

  /**
   * 打印错误日志
   * @param args
   */
  public static error(label: string, ...args: any): void {
    this.isValid(E_Log_Level.Error) &&
      this.applyGroup(E_Log_Level.Error, label, ...args);
  }
}

export { Logger };
