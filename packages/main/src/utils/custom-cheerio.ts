const { load } = require('@yongteng/cheerio/lib/slim');
const { select } = require('@yongteng/cheerio');
import { Cheerio, CheerioAPI, Element } from '@yongteng/cheerio';

select.filters.gt2 = (next, rule, { adapter, equals }) => {
  return function nthChild(elem) {
    const siblings = adapter.getSiblings(elem);
    let pos = 0;

    for (let i = 0; i < siblings.length; i++) {
      if (equals(elem, siblings[i])) break;
      pos++;
    }
    return pos > Number(rule) + 1 && next(elem);
  };
};

export default {
  load: function (...args) {
    const func = load(...args) as any;

    const find = func.prototype.find;

    func.prototype.find = function (selectorOrHaystack?: string | Cheerio<Element> | Element) {
      if (typeof selectorOrHaystack === 'string') {
        selectorOrHaystack = selectorOrHaystack.replace(/:gt(\(\d?\))/g, ':gt2$1');
      }

      return find.bind(this)(selectorOrHaystack);
    };

    const newFunc = function (...args2) {
      if (typeof args2[0] === 'string') {
        args2[0] = args2[0].replace(/:gt(\(\d?\))/g, ':gt2$1');
      }
      return func(...args2);
    };

    Object.assign(newFunc, func);

    return newFunc;
  },
} as CheerioAPI;
