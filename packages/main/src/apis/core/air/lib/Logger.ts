import util from 'util';
import path from 'path';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import chalk from 'chalk';
import {
  IAir,
  ILogArgvType,
  ILogArgvTypeWithError,
  ILogColor,
  ILogger,
  Undefinable,
} from '../types';
import { ILogType } from '../utils/enum';

export class Logger implements ILogger {
  private readonly level = {
    [ILogType.success]: 'green',
    [ILogType.info]: 'blue',
    [ILogType.warn]: 'yellow',
    [ILogType.error]: 'red',
  };

  private readonly ctx: IAir;
  private logLevel!: string;
  private logPath!: string;
  constructor(ctx: IAir) {
    this.ctx = ctx;
  }

  private handleLog(type: ILogType, ...msg: ILogArgvTypeWithError[]): void {
    // check config.silent
    if (!this.ctx.getConfig<Undefinable<string>>('silent')) {
      const logHeader = chalk[this.level[type] as ILogColor](`[Air ${type.toUpperCase()}]:`);
      console.log(logHeader, ...msg);
      this.logLevel = this.ctx.getConfig('settings.logLevel');
      this.logPath =
        this.ctx.getConfig<Undefinable<string>>('settings.logPath') ||
        path.join(this.ctx.baseDir, './air.log');

      setTimeout(() => {
        this.handleWriteLog(this.logPath, type, ...msg);
      }, 0);
    }
  }

  private handleWriteLog(logPath: string, type: string, ...msg: ILogArgvTypeWithError[]): void {
    try {
      if (this.checkLogLevel(type, this.logLevel)) {
        let log = `${dayjs().format('YYYY-MM-DD HH:mm:ss')} [Air ${type.toUpperCase()}] `;
        msg.forEach((item: ILogArgvTypeWithError) => {
          if (typeof item === 'object' && type === 'error') {
            log += `\n------Error Stack Begin------\n${util.format(
              item.stack
            )}\n-------Error Stack End------- `;
          } else {
            if (typeof item === 'object') {
              item = JSON.stringify(item);
            }
            log += `${item} `;
          }
        });
        log += '\n';
        // A synchronized approach to avoid log msg sequence errors
        fs.appendFileSync(logPath, log);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private checkLogLevel(type: string, level: undefined | string | string[]): boolean {
    if (level === undefined || level === 'all') {
      return true;
    }
    if (Array.isArray(level)) {
      return level.some((item: string) => item === type || item === 'all');
    } else {
      return type === level;
    }
  }

  success(...msg: ILogArgvType[]): void {
    return this.handleLog(ILogType.success, ...msg);
  }

  info(...msg: ILogArgvType[]): void {
    return this.handleLog(ILogType.info, ...msg);
  }

  error(...msg: ILogArgvTypeWithError[]): void {
    return this.handleLog(ILogType.error, ...msg);
  }

  warn(...msg: ILogArgvType[]): void {
    return this.handleLog(ILogType.warn, ...msg);
  }
}
