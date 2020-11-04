<template>
  <div id="app">
    <tp-editor v-model="content"></tp-editor>
  </div>
</template>

<script>
import TpEditor from './components/TpEditor.vue'

export default {
  name: 'App',
  components: {
    TpEditor
  },
  data(){
    return {
      content: '',
    }
  }
}
</script>

<style lang="scss">
html, body{
  margin: 0;
  padding: 0;
}
</style>
