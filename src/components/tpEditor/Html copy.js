import { Node } from 'tiptap'

export default class Html extends Node {

  get name() {
    return 'html'
  }

  get schema() {
    return {
      attrs: {
        content: {
          default: null,
        },
        id: {
          default: null
        }
      },
      group: 'block',
      selectable: false,
      toDOM: node => ['p']
    };
  }

  get view() {
    return {
      props: ['node'],
      computed: {
        content: {
          get() {
            return this.node.attrs.content
          }
        },
        id: {
          get() {
            return this.node.attrs.id
          }
        },
      },
      render: function (createElement) {
        return createElement('p', {
          attrs: {
            class: 'html-snippet',
            id: this.id,
          },
          domProps: {
            innerHTML: this.content
          }
        })
      }
    }
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const node = type.create(attrs)
      const transaction = state.tr.replaceSelectionWith(node)
      dispatch(transaction)
    }
  }
}

