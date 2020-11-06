import { Mark } from 'tiptap';
import { markInputRule, markPasteRule, updateMark, removeMark } from 'tiptap-commands';

export default class BkgColor extends Mark {
  get name() {
    return 'bkgColor';
  }

  get schema() {
    return {
      attrs: { bkgColor: { default: 'none' } },
      parseDOM: [{
        style: 'background',
        getAttrs: value => { bkgColor: value },
      }],
      toDOM: mark => ['span', { style: `background: ${mark.attrs.bkgColor}` }, 0],
    };
  }

  commands({ type }) {
    return attrs => {
      if ((attrs.bkgColor) && (attrs.bkgColor != 'none')) {
        return updateMark(type, attrs);
      }
      return removeMark(type);
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }

  pasteRules({ type }) {
    return [markPasteRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }
}