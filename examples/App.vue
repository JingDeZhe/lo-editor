<template>
	<div id="app">
		<lo-editor
			v-model="content"
			class="lo-editor"
		></lo-editor>
	</div>
</template>

<script>
export default {
	name: "App",
	data() {
		return {
			content: "",
			fontSizes: ["10px", "20px", "30px", "40px", "50px"],
			fontColors: ["#0b1013","#0f2540","#08192d","#005caf","#0b346e","#7b90d2"],
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
