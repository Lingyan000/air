import { IAir, IConfig, IStringKeyMap } from './types';
import { EventEmitter } from 'events';
import pkg from '../../../../../../package.json';
import { Logger } from '/@/apis/core/air/lib/Logger';
import { get, set, unset } from 'lodash';
import DB from '/@/apis/core/database/lowdb';
import { isConfigKeyInBlackList, isInputConfigValid } from '/@/apis/core/air/utils/common';
import { eventBus } from '/@/apis/core/air/utils/eventBus';
import { IBusEvent } from '/@/apis/core/air/utils/enum';
import fs from 'fs-extra';
import path from 'path';
import { homedir } from 'os';
import { dbChecker, dbPathChecker } from '/@/apis/core/datastore/dbChecker';

export class Air extends EventEmitter implements IAir {
  private _config!: IConfig;
  private db!: DB;
  configPath: string;
  baseDir!: string;
  tmpDir = '';
  documentsDir = '';
  rulesDir = '';
  log: Logger;
  VERSION: string = pkg.version;

  constructor(configPath = '') {
    super();
    this.configPath = configPath;
    this.log = new Logger(this);
    this.initConfigPath();
    this.initTmpDir();
    this.initDocumentsDir();
    this.initRulesDir();
    this.initConfig();
  }

  private initConfigPath(): void {
    if (this.configPath === '') {
      this.configPath = homedir() + '/.air/config.json';
    }
    if (path.extname(this.configPath).toUpperCase() !== '.JSON') {
      this.configPath = '';
      throw Error('The configuration file only supports JSON format.');
    }
    this.baseDir = path.dirname(this.configPath);
    const exist = fs.pathExistsSync(this.configPath);
    if (!exist) {
      fs.ensureFileSync(`${this.configPath}`);
    }
  }

  private initTmpDir(): void {
    if (this.tmpDir === '') {
      this.tmpDir = path.join(this.baseDir, './tmp/');
    }
    const exist = fs.existsSync(this.tmpDir);
    if (!exist) {
      fs.mkdirSync(`${this.tmpDir}`);
    }
  }

  private initDocumentsDir(): void {
    if (this.documentsDir === '') {
      this.documentsDir = path.join(this.baseDir, './documents/');
    }
    const exist = fs.existsSync(this.documentsDir);
    if (!exist) {
      fs.mkdirSync(`${this.documentsDir}`);
    }
  }

  private initRulesDir(): void {
    if (this.rulesDir === '') {
      this.rulesDir = path.join(this.documentsDir, './rules/');
    }
    const exist = fs.existsSync(this.rulesDir);
    if (!exist) {
      fs.mkdirSync(`${this.rulesDir}`);
    }
  }

  private initConfig(): void {
    this.db = new DB(this);
    this._config = this.db.read().value();
  }

  getConfig<T>(name?: string): T {
    if (!name) {
      console.log(this._config);
      return this._config as unknown as T;
    } else {
      return get(this._config, name);
    }
  }

  saveConfig(config: IStringKeyMap<any>): void {
    if (!isInputConfigValid(config)) {
      this.log.warn('the format of config is invalid, please provide object');
      return;
    }
    this.setConfig(config);
    this.db.saveConfig(config);
  }

  removeConfig(key: string, propName: string): void {
    if (!key || !propName) return;
    if (isConfigKeyInBlackList(key)) {
      this.log.warn(`the config.${key} can't be removed`);
      return;
    }
    this.unsetConfig(key, propName);
    this.db.unset(key, propName);
  }

  setConfig(config: IStringKeyMap<any>): void {
    if (!isInputConfigValid(config)) {
      this.log.warn('the format of config is invalid, please provide object');
      return;
    }
    Object.keys(config).forEach((name: string) => {
      if (isConfigKeyInBlackList(name)) {
        this.log.warn(`the config.${name} can't be modified`);
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete config[name];
      }
      set(this._config, name, config[name]);
      eventBus.emit(IBusEvent.CONFIG_CHANGE, {
        configName: name,
        value: config[name],
      });
    });
  }

  unsetConfig(key: string, propName: string): void {
    if (!key || !propName) return;
    if (isConfigKeyInBlackList(key)) {
      this.log.warn(`the config.${key} can't be unset`);
      return;
    }
    unset(this.getConfig(key), propName);
  }
}

const CONFIG_PATH = dbPathChecker();

dbChecker();

const air = new Air(CONFIG_PATH);

air.saveConfig({
  debug: true,
});

export default air;
