import { Mark } from 'tiptap';
import { markInputRule, markPasteRule, updateMark, removeMark, toggleMark } from 'tiptap-commands';

export default class FontFamily extends Mark {
  get name() {
    return 'fontFamily';
  }

  get schema() {
    return {
      attrs: { fontFamily: { default: 'initial' } },
      parseDOM: [{
        style: 'font-family',
        getAttrs: value => { fontFamily: value },
      }],
      toDOM: mark => ['span', { style: `font-family: ${mark.attrs.fontFamily}` }, 0],
    };
  }

  commands({ type }) {
    return attrs => {
      if ((attrs.fontFamily) && (attrs.fontFamily != 'initial')) {
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