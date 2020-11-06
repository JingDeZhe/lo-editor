import { Mark } from 'tiptap';
import { markInputRule, markPasteRule, updateMark, removeMark } from 'tiptap-commands';

export default class FontColor extends Mark {
  get name() {
    return 'fontColor';
  }

  get schema() {
    return {
      attrs: { fontColor: { default: 'initial' } },
      parseDOM: [{
        style: 'color',
        getAttrs: value => { fontColor: value },
      }],
      toDOM: mark => ['span', { style: `color: ${mark.attrs.fontColor}` }, 0],
    };
  }

  commands({ type }) {
    return attrs => {
      if ((attrs.fontColor) && (attrs.fontColor != 'initial')) {
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