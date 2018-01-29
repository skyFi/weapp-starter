const fs = require('fs');

const cheerio = require('cheerio');
const request = require('request');

const Types = {
  'string': 'string',
  'number': 'number',
  'boolean': 'boolean',
  'function': 'Function',
  'object': 'object',
  'callback': 'Function',
  'stringarray': 'string[]',
  'float': 'number',
  'int': 'number',
  'dateint': 'number',
  'integer': 'number',
  'array': 'Array<any>',
  'arraybuffer': 'ArrayBuffer'
};

const ApiDocUrl = 'http://mp.weixin.qq.com/debug/wxadoc/dev/api/';

const isFunctionNeedToBePromisified = function(funcName) {
  return ['clearStorage', 'hideToast', 'showNavigationBarLoading', 'hideNavigationBarLoading', 'drawCanvas', 'canvasToTempFilePath', 'hideKeyboard'].indexOf(funcName) === -1
        && !/^(on|create|stop|pause|close)/.test(funcName)
        && !/\w+Sync$/.test(funcName);
};

const readFile = function(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
};

const writeFile = function(dist, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dist, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getPageData = function(url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res.body);
    });
  });
};

const getApiList = function(url) {
  return getPageData(url)
    .then(body => {
      const $ = cheerio.load(body);
      let apiList = [];
      $('ul.summary > li')
        .each((_, li) => {
          const name = $(li).data('name');
          let items = [];
          $(li).children('ul.articles').children('li').each((_, item) => {
            items.push({
              name: $(item).data('name'),
              url: `${ApiDocUrl}${$(item).data('path')}`
            });
          });
          apiList.push({
            name,
            items
          });
        });

      return apiList;
    });
};

const getApiContent = function(api) {
  const {url, name} = api;
  return getPageData(url)
    .then(body => {
      const $ = cheerio.load(body);
      let apis = [];

      if (name === '地图组件控制') {
        apis = [{
          url,
          name: 'createMapContext',
          description: '创建并返回 map 上下文 mapContext 对象',
          params: [{
            name: 'mapId',
            type: 'string',
            required: true,
            description: '地图表示，传入定义在 <map/> 的 map-id'
          }]
        }];
      } else if (name === '绘图') {
        apis = [{
          url,
          name: 'createCanvasContext',
          description: '创建 canvas 绘图上下文（指定 canvasId）.Tip: 需要指定 canvasId，该绘图上下文只作用于对应的 <canvas/>',
          params: [{
            name: 'canvasId',
            type: 'string',
            required: true,
            description: '画布表示，传入定义在 <canvas/> 的 canvas-id'
          }]
        }, {
          url,
          name: 'canvasToTempFilePath',
          description: '把当前画布的内容导出生成图片，并返回文件路径',
          params: [{
            name: 'canvasId',
            type: 'string',
            required: true,
            description: '画布表示，传入定义在 <canvas/> 的 canvas-id'
          }]
        }];
      } else {
        $('section.markdown-section').find('h3')
          .filter((_, item)=> {
            return $(item).text().startsWith('wx');
          }).each((_, item) => {
            let params = [];
            $(item).text().replace(/\(([^)]+)\)/, (str, paramStr) => {
              paramStr.split(',').forEach((type, index) => {
                params[index] = {type, keys: []};
                let table = $(item).nextAll().filter((_, next) => {
                  return $(next).is('table') && _ <= 4;
                }).first();
                if (table && table.is('table')) {
                  table.find('tbody tr').each((_, item) => {
                    const tds = $(item).find('td');
                    // 参数	类型	必填	默认值	说明	最低版本
                    // 参数	类型	必填	说明
                    // 参数	类型	必填	说明	最低版本
                    console.log(tds.length, tds.eq(0).text(), tds.eq(1).text(), tds.eq(2).text(), tds.eq(3).text()); // eslint-disable-line
                    params[index].keys.push({
                      name: tds.eq(0).text(),
                      type: tds.eq(1).text(),
                      required: tds.eq(2).text(),
                      description: tds.length === 4 ? tds.eq(3).text() :
                        tds.length === 5 ? `${tds.eq(3).text()}${tds.eq(4).text() ? `。最低版本号：${tds.eq(4).text()}` : ''}` :
                          tds.length === 6 ? `默认值：${tds.eq(3).text() || '无'}，描述：${tds.eq(4).text()}${tds.eq(5).text() ? `。最低版本号：${tds.eq(5).text()}` : ''}` : ''
                    });
                  });
                }
              });
            });

            apis.push({
              url,
              name: $(item).text().replace(/\(.*\)$/, ''),
              description: $(item).next('p').text().indexOf('参数说明') === -1 ? $(item).next('p').text() : '',
              params
            });
          });
      }

      return apis;
    });
};

const getDefinitions = function(apiList) {
  let list = [];
  let dts = 'declare var wx: {';
    
  apiList.forEach(cat => {
    dts += `
    // # ${cat.name} # 
    `;

    cat.items.forEach(item => {
      item.apis.forEach((api) => {
        const funcName = api.name.replace(/^wx\./, '');
        if (list.indexOf(funcName) !== -1) {
          return;
        }
        list.push(funcName);
        if (api.description) {
          dts += `
    /**
     * ${api.description}
     */`;
        }
        dts += `
    ${funcName}(`;
        api.params.forEach((param, index) => {
          if (param.type === 'OBJECT') {
            dts += 'obj: {';
            param.keys.forEach((key, index) => {
              dts += `
        /**
         * ${key.description}
         */
        ${key.name}${key.required === '是' ? '' : '?'}: `;
              const types = key.type.split(/、|\//);
              if (types.length > 1) {
                dts += types.map(t => Types[t.toLowerCase()] || 'any').join(' | ');
              } else {
                dts += Types[key.type.toLowerCase()] || 'any';
              }
              dts += ';';
            });

            dts += `
    }`;

          } else if (param.type === 'CALLBACK') {
            dts += 'callback: Function';
          } else if (param.type === 'KEY') {
            dts += 'key: string';
          } else if (param.type === 'DATA') {
            dts += 'data: any';
          } else {
            dts += `${param.name || param.type}: string`;
          }
          if (api.params.length > 1 && index < api.params.length) {
            dts += ', ';
          }
        });

        let returnType = 'void';
        if (funcName === 'createCanvasContext') {
          returnType = 'ICanvasContext';
        } else if (funcName === 'createAnimation') {
          returnType = 'IAnimation';
        } else if (funcName === 'createAudioContext') {
          returnType = 'IAudioContext';
        } else if (funcName === 'createVideoContext') {
          returnType = 'IVideoContext';
        } else if (funcName === 'createMapContext') {
          returnType = 'IMapContext';
        }
        dts += `): ${returnType};
                    `;
      });
    });

  });

  dts += `
}`;
  return dts;
};

const getPromisifiedDefinitions = function(apiList) {
  let list = [];
  let dts = 'declare var wx: {';
    
  apiList.forEach(cat => {
    dts += `
    // # ${cat.name} # 
    `;

    cat.items.forEach(item => {
      item.apis.forEach((api) => {
        const funcName = api.name.replace(/^wx\./, '');
        if (list.indexOf(funcName) !== -1) {
          return;
        }
        list.push(funcName);
        if (api.description) {
          dts += `
    /**
     * ${api.description}
     */`;
        }
        dts += `
    ${funcName}(`;
        let returnType = 'void';
        const promised = isFunctionNeedToBePromisified(funcName);
        if (promised) {
          returnType = 'Promise<any>';
        }
        api.params.forEach((param, index) => {
          if (param.type === 'OBJECT') {
            if (param.keys.map(key => key.name).sort().join(',') === 'complete,fail,success') {
              return;
            }
            dts += 'obj: {';
            param.keys.forEach((key, index) => {
              if (promised && /^(success|fail|complete)$/.test(key.name)) {
                return;
              }
              dts += `
        /**
         * ${key.description}
         */
        ${key.name}${key.required === '是' ? '' : '?'}: `;
              const types = key.type.split(/、|\//);
              if (types.length > 1) {
                dts += types.map(t => Types[t.toLowerCase()] || 'any').join(' | ');
              } else {
                dts += Types[key.type.toLowerCase()] || 'any';
              }
              dts += ';';
            });

            dts += `
    }`;

          } else if (param.type === 'CALLBACK') {
            dts += 'callback: Function';
          } else if (param.type === 'KEY') {
            dts += 'key: string';
          } else if (param.type === 'DATA') {
            dts += 'data: any';
          }
          if (api.params.length > 1 && index < api.params.length) {
            dts += ', ';
          }
        });

        if (funcName === 'createCanvasContext') {
          returnType = 'ICanvasContext';
        } else if (funcName === 'createAnimation') {
          returnType = 'IAnimation';
        } else if (funcName === 'createAudioContext') {
          returnType = 'IAudioContext';
        } else if (funcName === 'createVideoContext') {
          returnType = 'IVideoContext';
        }
        dts += `): ${returnType};
                    `;
      });
    });

  });

  dts += `
}`;
  return dts;
};

getApiList(ApiDocUrl)
  .then(apiList => {
    // apiList.splice(1);
    return Promise.all(apiList.map(category => {
      return Promise.all(category.items.map(item => {
        return getApiContent(item)
          .then(apis => {
            return Object.assign({}, item, {apis});
          });
      }))
        .then(list => {
          return Object.assign({}, category, {items: list});
        });
    }));
  })
  .then(apiList => {
    return [getDefinitions(apiList), getPromisifiedDefinitions(apiList)];
  })
  .then(([dts, pdts]) => {
    return readFile('./bin/lib/definitions.tpl')
      .then(data => {
        data = `// generate time:${new Date().toLocaleString()} \n${data}`;
        dts = dts.replace(/### wx\./g, '');
        pdts = pdts.replace(/### wx\./g, '');
        // return Promise.all([writeFile('./wx.d.ts', data + dts), writeFile('./wxPromise.d.ts', data + pdts)]);
        return writeFile('./wxPromise.d.ts', data + pdts);
      });
  })
  .then(() => {
    console.log('done'); // eslint-disable-line
  })
  .catch(err => {
    console.log(err); // eslint-disable-line
  });
