<template>
	<div id="app">
		<lo-editor v-model="content" class="lo-editor"></lo-editor>
	</div>
</template>

<script>
export default {
	name: "App",
	data() {
		return {
			content: "<p>dsdsd</p>",
		};
	},
};
</script>

<style lang="scss">
html,
body {
	margin: 0;
	padding: 0;
}
#app {
	padding: 20px;
}
.lo-editor {
	border-radius: 3px;
	box-shadow: 0 0 5px #30303040;
	overflow: hidden;
	max-height: 80vh;
}
</style>
