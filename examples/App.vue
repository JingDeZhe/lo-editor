<template>
	<div id="app">
		<lo-editor
			v-model="content"
			class="lo-editor"
			@insertImage="insertImage"
			@insertVedio="insertVedio"
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
			fontColors: [
				"#0b1013",
				"#0f2540",
				"#08192d",
				"#005caf",
				"#0b346e",
				"#7b90d2",
			],
		};
	},
	methods: {
		insertImage(file, setImage) {
			// 模拟后台返回图片链接
			// setImage(url, height, width): 在编辑器内部插入href为url的图片，后面两个参数可选
			const reader = new FileReader();
			reader.onload = function (evt) {
				setImage(evt.target.result);
			};
			reader.readAsDataURL(file);
		},
		insertVedio(file, setVedio) {
			// 与Image一样
			// 模拟后台输入
			setVedio("https://www.w3school.com.cn/i/movie.ogg");
		},
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
