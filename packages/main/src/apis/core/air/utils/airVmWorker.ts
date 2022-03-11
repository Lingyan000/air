import AirVm, { VmType } from './airVm';
import AirParse from '/@/apis/core/air/parse';
import { MessagePort } from 'worker_threads';
import { cloneDeep } from 'lodash';
import { HIDE_LOADING, REFRESH_PAGE, SHOW_LOADING } from '#/events/socket-constants';

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

  airVm.on(REFRESH_PAGE, () => {
    port.postMessage({
      ev: REFRESH_PAGE,
    });
  });

  airVm.on(SHOW_LOADING, (...data) => {
    port.postMessage({
      ev: SHOW_LOADING,
      data,
    });
  });

  airVm.on(HIDE_LOADING, () => {
    port.postMessage({
      ev: HIDE_LOADING,
    });
  });

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
