import { Node } from 'tiptap'

export default class Vedio extends Node {

  get name() {
    return 'video'
  }

  get schema() {
    return {
      inline: false,
      attrs: {
        src: {},
        height: {
          default: null,
        },
        width: {
          default: null,
        }
      },
      group: 'block',
      draggable: true,
      parseDOM: [
        {
          tag: 'video[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src'),
            height: dom.getAttribute('height'),
            width: dom.getAttribute('width'),
          }),
        },
      ],
      toDOM: node => ['video', {
        src: node.attrs.src,
        height: node.attrs.height,
        width: node.attrs.width,
        frameborder: 0,
        allowfullscreen: 'true',
        controls: 'controls'
      }],
    }
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }
}
