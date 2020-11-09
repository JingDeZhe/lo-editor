# lo-editor
一个简单的富文本编辑组件，基于Vue下富文本编辑器Tiptap。

# install
```js
npm install --save lo-editor
```

# use
```js
import Vue from 'vue'
import LoEditor from 'lo-editor';
Vue.use(LoEditor)
```

```html
<lo-editor
  v-model="content"
  class="lo-editor"
  @insertImage="insertImage"
  @insertVedio="insertVedio"
></lo-editor>
```

```js
data(){
  return {
    content: ''
  }
},
methods:{
  insertImage(file, setImage){
    setImage('url')
  },
  insertVedio(file, setVedio){
    setVedio('url')
  }
}
```
