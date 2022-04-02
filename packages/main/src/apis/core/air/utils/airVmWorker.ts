import AirVm, { VmType } from './airVm';
import { MessagePort } from 'worker_threads';
import * as socketConstList from '#/events/socket-constants';
import util from 'util';
import dayjs from 'dayjs';
import { IPages } from '/@/apis/core/air/parse';
import Articlelistrule from '/@/apis/core/database/sqlite/models/articlelistrule';

export interface AirVmContext {
  articlelistrule: Articlelistrule;
  home: any;
  baseUrl: string | undefined;
  myUrl: string;
  vars: { [key: string]: any };
  allMyVars: { [key: string]: { [key: string]: any } };
  colType: ColType;
  pages: IPages[];
  allConfig: { [key: string]: { [key: string]: any } };
  config: { [key: string]: any };
  myVars: { [key: string]: any };
}

export interface IAirVmWorkerParams {
  port: MessagePort;
  code: string;
  vmType: VmType;
  context: AirVmContext;
  documentsDir: string;
  sandbox?: any;
  rescode?: string;
}

export default async (params: IAirVmWorkerParams) => {
  const { port, code, vmType, documentsDir, context, sandbox = {}, rescode } = params;

  const airVm = new AirVm(
    vmType,
    {
      rescode,
      documentsDir,
    },
    context,
    sandbox
  );

  for (const key in socketConstList) {
    const ev = socketConstList[key];
    airVm.on(ev, (...data) => {
      port.postMessage({
        ev: ev,
        data,
      });
    });
  }

  try {
    const result = await airVm.vm?.run(code);
    return {
      AIR_RESULT: JSON.parse(JSON.stringify(airVm.sandbox.AIR_RESULT)),
      result,
      context: {
        vars: airVm.context.vars,
        allConfig: airVm.context.allConfig,
        allMyVars: airVm.context.allMyVars,
      },
      error: null,
    };
  } catch (e: any) {
    let log = `${dayjs().format('YYYY-MM-DD HH:mm:ss')} [AirVm Error] `;
    log += `\n------Error Stack Begin------\n${util.format(
      e.stack
    )}\n-------Error Stack End------- `;
    console.error(log);
    throw new Error(e.message);
  }
};
