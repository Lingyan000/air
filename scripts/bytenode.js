/*
 * @Author: Allan
 * @Description: 加密源码
 */
const { app } = require('electron');
const v8 = require('v8');
const bytenode = require('bytenode');
const fs = require('fs');
const path = require('path');

v8.setFlagsFromString('--no-lazy');

const distPaths = ['../packages/main/dist/'];
let extNew = '.jsc';

function startByteCode() {
  //开始加密
  const totalTimeLabel = '总加密用时';
  console.time(totalTimeLabel);

  for (const disPath of distPaths) {
    const rootPath = path.join(__dirname, disPath);
    console.group('加密目录:', rootPath);
    const timeLabel = 'Bundling time';
    console.time(timeLabel);

    const filenames = fs.readdirSync(rootPath);
    filenames.forEach((filename) => {
      let ext = path.extname(filename);
      let base = path.basename(filename, ext);
      if (ext === '.js' || (ext === '.cjs' && base !== 'esm-got')) {
        // if (base === 'index') {
        let filePath = path.join(rootPath, filename);
        let fileNameOut = base + extNew;
        let filePathOut = path.join(rootPath, fileNameOut);
        console.log('file: ' + filePath);
        //字节码转化
        bytenode
          .compileFile({
            filename: filePath,
            output: filePathOut,
          })
          .then(() => {
            //替换原文件代码，导入引用
            fs.writeFileSync(
              filePath,
              `require('bytenode');module.exports = require('./${fileNameOut}');`
            );
            //删除loader.js文件
            let fileNameLoader = base + '.loader.js';
            let filePathLoader = path.join(rootPath, fileNameLoader);
            if (fs.existsSync(filePathLoader)) {
              fs.unlinkSync(filePathLoader);
            }
          });
      }
    });
    console.timeEnd(timeLabel);
    console.groupEnd();
    console.log('\n');
  }
  console.timeEnd(totalTimeLabel);
}

startByteCode();

app.quit();
