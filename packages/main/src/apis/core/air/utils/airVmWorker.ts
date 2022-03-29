import AirVm, { VmType } from './airVm';
import AirParse from '/@/apis/core/air/parse';
import { MessagePort } from 'worker_threads';
import { cloneDeep } from 'lodash';
import * as socketConstList from '#/events/socket-constants';

export interface IAirVmWorkerParams {
  port: MessagePort;
  code: string;
  vmType: VmType;
  ctx: AirParse;
  documentsDir: string;
  sandbox?: any;
  rescode?: string;
}

export default async (params: IAirVmWorkerParams) => {
  const { port, code, vmType, documentsDir, ctx, sandbox = {}, rescode } = params;

  const airVm = new AirVm(
    vmType,
    {
      rescode,
      documentsDir,
    },
    ctx,
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
      AIR_RESULT: cloneDeep(airVm.sandbox.AIR_RESULT),
      result,
      ctx: {
        vars: airVm.ctx.vars,
        allConfig: airVm.ctx.allConfig,
        allMyVars: airVm.ctx.allMyVars,
        isRefreshPage: airVm.ctx.isRefreshPage,
      },
      error: null,
    };
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message);
  }
};
