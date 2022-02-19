import XRegExp, { ReplacementDetail } from 'xregexp';

const escapeMents: ReplacementDetail[] = [[/\t/g, '&nbsp;&nbsp;']];

export function wrapText(text) {
  return XRegExp.replaceEach(text, [[/\t/g, '  ']]);
}

export function wrapTextToHtml(text, removeTags = false) {
  if (!text) return text;
  return window.sanitizeHtml.sanitizeHtml(
    XRegExp.replaceEach(text, [
      [/‘‘(.*?)’’/g, '<font color="orange">$1</font>'],
      [/““(.*?)””/g, '<font color="red">$1</font>'],
      ...escapeMents,
    ]),
    {
      allowedTags: removeTags ? [] : window.sanitizeHtml.defaults.allowedTags.concat(['font']),
      allowedAttributes: {
        font: ['color'],
        span: ['style'],
      },
      allowedStyles: {
        '*': {
          // Match HEX and RGB
          color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
          'text-align': [/^left$/, /^right$/, /^center$/],
          // Match any number with px, em, or %
          'font-size': [/^\d+(?:px|em|%)$/],
        },
      },
    }
  );
}

export function isCanWrapText(text) {
  return XRegExp.test(text, /‘‘(.*?)’’|““(.*?)””/g);
}
