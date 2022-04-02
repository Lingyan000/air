import AirVm from '/@/apis/core/air/utils/airVm/index';
import { URL } from 'url';
import { join } from 'path';
import fs from 'fs-extra';

export default (airVm: AirVm) => {
  function getFilePath(fileName: string) {
    if (fileName.startsWith('hiker://files')) {
      const url = new URL(fileName);
      const path = decodeURIComponent(url.pathname);
      return join(airVm.documentsDir, path);
    } else {
      return join(
        airVm.documentsDir,
        `./rules/files/${airVm.context.articlelistrule.title}/${fileName}`
      );
    }
  }

  return {
    saveFile(fileName: string, content: string) {
      const filePath = getFilePath(fileName);
      fs.ensureDirSync(filePath);
      fs.writeFileSync(filePath, content);
    },

    readFile(fileName: string) {
      const filePath = getFilePath(fileName);
      return fs.readFileSync(filePath, 'utf-8');
    },

    deleteFile(fileName: string) {
      const filePath = getFilePath(fileName);
      fs.removeSync(filePath);
    },

    fileExist(fileName: string) {
      return fs.pathExists(getFilePath(fileName));
    },
  };
};
