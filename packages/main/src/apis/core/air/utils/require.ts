import fs from 'fs-extra';
import dayjs from 'dayjs';

export function getRequireData(path: string): {
  url: string;
  file?: string;
  pcFile: string;
  accessTime: number;
}[] {
  if (!fs.existsSync(path)) {
    fs.ensureFileSync(path);
  }
  let data = [];
  try {
    data = fs.readJSONSync(path, 'utf8');
  } catch (e) {}
  return data;
}

export function addOrUpdateRequireData(path: string, url: string, pcFile: string) {
  const data: {
    url: string;
    file?: string;
    pcFile: string;
    accessTime: number;
  }[] = getRequireData(path);
  const index = data.findIndex((item) => item.url === url);
  if (index > -1) {
    data[index].accessTime = dayjs().valueOf();
    data[index].pcFile = pcFile;
  } else {
    data.push({ url, pcFile, accessTime: dayjs().valueOf() });
  }
  fs.writeJSONSync(path, data, { spaces: 2 });
}
