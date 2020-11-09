import { Node, Plugin } from 'tiptap'

export default class Image extends Node {

  get name() {
    return 'image'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
        height: {
          default: null,
        },
        width: {
          default: null
        }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
            height: dom.getAttribute('height'),
            width: dom.getAttribute('width'),
          }),
        },
      ],
      toDOM: node => ['img', node.attrs],
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

  get plugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            if (!(event.clipboardData && event.clipboardData.items)) {
              return;
            }
            let items = Array.from(event.clipboardData.items);
            if (!items) {
              return;
            }
            event.preventDefault();

            const that = window.editor;
            items.forEach((item) => {
              if (item.type.indexOf("image") !== -1) {
                const file = item.getAsFile();
                if (file) {
                  that.$emit("insertImage", file, that.insertImage.bind(that));
                }
              }
            })
          },
          handleDOMEvents: {
            drop(view, event) {
              const hasFiles = event.dataTransfer
                && event.dataTransfer.files
                && event.dataTransfer.files.length

              if (!hasFiles) {
                return
              }

              const images = Array
                .from(event.dataTransfer.files)
                .filter(file => (/image/i).test(file.type))

              if (images.length === 0) {
                return
              }

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
              const that = window.editor;

              function insertImage(src, height, width) {
                if (typeof width === "number") {
                  width = width + "px";
                }
                const node = schema.nodes.image.create({
                  src: src,
                  height: height ? height + "px" : null,
                  width: width ? width : null,
                })
                const transaction = view.state.tr.insert(coordinates.pos, node)
                view.dispatch(transaction)
              }

              images.forEach(image => {
                that.$emit("insertImage", image, insertImage.bind(that));
              })
            },
          },
        },
      }),
    ]
  }
}
