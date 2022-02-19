import lowdb from 'lowdb';
import lodashId from 'lodash-id';
import FileSync from 'lowdb/adapters/FileSync';
import json from 'comment-json';
import { IConfig, IAir } from '/@/apis/core/air/types';

class DB {
  private readonly ctx: IAir;
  private readonly db: lowdb.LowdbSync<any>;

  constructor(ctx: IAir) {
    this.ctx = ctx;
    const adapter = new FileSync(this.ctx.configPath, {
      serialize(obj: object): string {
        return json.stringify(obj, null, 2);
      },
      deserialize: json.parse,
    });
    this.db = lowdb(adapter);
    this.db._.mixin(lodashId);
  }

  read(): any {
    return this.db.read();
  }

  get(key = ''): any {
    return this.read().get(key).value();
  }

  set(key: string, value: any): void {
    return this.read().set(key, value).write();
  }

  has(key: string): boolean {
    return this.read().has(key).value();
  }

  insert(key: string, value: any): void {
    return this.read().get(key).insert(value).write();
  }

  unset(key: string, value: any): boolean {
    return this.read().get(key).unset(value).write();
  }

  saveConfig(config: Partial<IConfig>): void {
    Object.keys(config).forEach((name: string) => {
      this.set(name, config[name]);
    });
  }

  removeConfig(config: IConfig): void {
    Object.keys(config).forEach((name: string) => {
      this.unset(name, config[name]);
    });
  }
}

export default DB;
