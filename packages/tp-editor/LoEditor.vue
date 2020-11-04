<template>
	<div class="editor">
		<div class="editor-tools">
			<editor-menu-bar
				:editor="editor"
				v-slot="{ commands, isActive }"
				v-if="mode != 'VIEW'"
			>
				<div class="menubar">
					<button @click="commands.undo">
						<abbr :title="i18n.editor.undo">
							<icon icon-class="撤销" />
						</abbr>
					</button>
					<button @click="commands.redo">
						<abbr :title="i18n.editor.redo">
							<icon icon-class="恢复" />
						</abbr>
					</button>

					<span class="divide"></span>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.bold() }"
						@click="commands.bold"
					>
						<abbr :title="i18n.editor.bold">
							<icon icon-class="加粗" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.italic() }"
						@click="commands.italic"
					>
						<abbr :title="i18n.editor.italic">
							<icon icon-class="斜体" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.underline() }"
						@click="commands.underline"
					>
						<abbr :title="i18n.editor.underLine">
							<icon icon-class="下划线" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.strike() }"
						@click="commands.strike"
					>
						<abbr :title="i18n.editor.deleteLine">
							<icon icon-class="删除线" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.heading({ level: 1 }) }"
						@click="commands.heading({ level: 1 })"
					>
						<abbr :title="i18n.editor.header1">
							<icon icon-class="标题一" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.heading({ level: 2 }) }"
						@click="commands.heading({ level: 2 })"
					>
						<abbr :title="i18n.editor.header2">
							<icon icon-class="标题二" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.heading({ level: 3 }) }"
						@click="commands.heading({ level: 3 })"
					>
						<abbr :title="i18n.editor.header3">
							<icon icon-class="标题三" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.bullet_list() }"
						@click="commands.bullet_list"
					>
						<abbr :title="i18n.editor.listUnOrdered">
							<icon icon-class="无序列表" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.ordered_list() }"
						@click="commands.ordered_list"
					>
						<abbr :title="i18n.editor.listOrdered">
							<icon icon-class="有序列表" />
						</abbr>
					</button>

					<button
						class="menubar__button"
						:class="{ 'is-active': isActive.blockquote() }"
						@click="commands.blockquote"
					>
						<abbr :title="i18n.editor.quote">
							<icon icon-class="引用" />
						</abbr>
					</button>

					<button class="menubar__button" @click="commands.horizontal_rule">
						<abbr :title="i18n.editor.breakLine">
							<icon icon-class="分割线" />
						</abbr>
					</button>
					<span class="divide"></span>
					<button
						class="menubar__button"
						@click="
							commands.createTable({
								rowsCount: 3,
								colsCount: 3,
								withHeaderRow: false,
							})
						"
					>
						<abbr :title="i18n.editor.table">
							<icon icon-class="表格" />
						</abbr>
					</button>

					<span v-if="isActive.table()">
						<button class="menubar__button" @click="commands.addColumnBefore">
							<abbr :title="i18n.editor.insertColLeft">
								<icon icon-class="列左" />
							</abbr>
						</button>
						<button class="menubar__button" @click="commands.addColumnAfter">
							<abbr :title="i18n.editor.insertColRight">
								<icon icon-class="列右" />
							</abbr>
						</button>
						<button class="menubar__button" @click="commands.addRowBefore">
							<abbr :title="i18n.editor.insertRowUp">
								<icon icon-class="行上" />
							</abbr>
						</button>
						<button class="menubar__button" @click="commands.addRowAfter">
							<abbr :title="i18n.editor.insertRowBottom">
								<icon icon-class="行下" />
							</abbr>
						</button>
						<button
							class="menubar__button table-delete"
							@click="showTableFloat = !showTableFloat"
						>
							<abbr :title="i18n.editor.deleteTable">
								<icon icon-class="表格删除" />
							</abbr>
							<div class="float" v-if="showTableFloat">
								<button class="menubar__button" @click="commands.deleteRow">
									<icon icon-class="删除行" />
									<span class="desc">{{ i18n.editor.deleteRow }}</span>
								</button>
								<button class="menubar__button" @click="commands.deleteColumn">
									<icon icon-class="删除列" />
									<span class="desc">{{ i18n.editor.deleteCol }}</span>
								</button>
								<button class="menubar__button" @click="commands.deleteTable">
									<icon icon-class="表格删除" />
									<span class="desc">{{ i18n.editor.deleteTable }}</span>
								</button>
							</div>
						</button>
					</span>
					<span class="divide"></span>
					<label for="image-upload">
						<abbr :title="i18n.editor.insertImage">
							<icon icon-class="图片" />
						</abbr>
					</label>
					<button class="menubar__button" @click="toInsertIframe">
						<abbr :title="i18n.editor.insertIframe">
							<icon icon-class="iframe" />
						</abbr>
					</button>
					<input
						type="file"
						accept=".png, .jpg, .jpeg"
						id="image-upload"
						@change="insertLocalImage()"
						hidden
					/>
				</div>
			</editor-menu-bar>
		</div>
		<editor-menu-bubble
			class="menububble"
			:editor="editor"
			@hide="hideLinkMenu"
			v-if="mode !== 'VIEW'"
			v-slot="{ commands, isActive, getMarkAttrs, menu }"
		>
			<div
				class="menububble"
				:class="{ 'is-active': menu.isActive }"
				:style="`left: ${menu.left + 30}px; bottom: ${menu.bottom}px;`"
			>
				<form
					class="menububble__form"
					v-if="linkMenuIsActive"
					@submit.prevent="setLinkUrl(commands.link, linkUrl)"
				>
					<input
						class="menububble__input"
						type="text"
						v-model="linkUrl"
						placeholder="https://"
						ref="linkInput"
						@keydown.esc="hideLinkMenu"
					/>
					<button
						class="menububble__button"
						@click="setLinkUrl(commands.link, null)"
						type="button"
					>
						<icon icon-class="remove" />
					</button>
				</form>

				<template v-else>
					<button
						class="menububble__button"
						@click="showLinkMenu(getMarkAttrs('link'))"
						:class="{ 'is-active': isActive.link() }"
					>
						<span>{{ isActive.link() ? "Update Link" : "Add Link" }}</span>
						<icon icon-class="link" />
					</button>
				</template>
			</div>
		</editor-menu-bubble>
		<div
			class="note-content"
			ref="noteContent"
			@drop="handleEditorDrop($event)"
		>
			<editor-content class="editor__content" :editor="editor" />
		</div>
	</div>
</template>

<script>
import '../../examples/icons';

import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from "tiptap";
import {
	Blockquote,
	HardBreak,
	Heading,
	HorizontalRule,
	OrderedList,
	BulletList,
	ListItem,
	Link,
	Bold,
	Italic,
	Table,
	TableHeader,
	TableCell,
	TableRow,
	// Strike,
	Underline,
	History,
	Mention,
} from "tiptap-extensions";
import Image from "./tpEditor/Image";
import Iframe from "./tpEditor/Iframe";
import Strike from "./tpEditor/Strike";

export default {
  name: 'lo-editor',
	components: {
		EditorContent,
		EditorMenuBar,
		EditorMenuBubble,
	},
	model: {
		event: "updateContent",
		prop: "content",
	},
	props: {
		id: String,
		content: String,
		mode: String,
		i18n: {
			type: Object,
			default() {
				return {
					editor: {
						undo: "undo",
						redo: "redo",
						bold: "bold",
						italic: "italic",
						underLine: "under line",
						deleteLine: "delete line",
						header1: "header 1",
						header2: "header 2",
						header3: "header 3",
						listUnOrdered: "unordered list",
						listOrdered: "ordered list",
						quote: "quote",
						breakLine: "break line",
						table: "table",
						insertColLeft: "insert column on the left",
						insertColRight: "insert column on the right",
						insertRowUp: "Insert row above",
						insertRowBottom: "Insert row below",
						deleteTable: "delete table",
						deleteRow: "delete row",
						deleteCol: "delete column",
						insertImage: "insert image",
						insertIframe: "insert iframe",
					},
				};
			},
		},
	},
	mounted() {
		window.editor = this;
	},
	data() {
		return {
			showTableFloat: false,
			linkMenuIsActive: false,
			linkUrl: "",
			// editor
			editor: new Editor({
				autoFocus: true,
				extensions: [
					new Blockquote(),
					new BulletList(),
					new HardBreak(),
					new Heading({ levels: [1, 2, 3] }),
					new HorizontalRule(),
					new ListItem(),
					new OrderedList(),
					new Image(),
					new Bold(),
					new Italic(),
					new Strike(),
					new Underline(),
					new History(),
					new Table({
						resizable: true,
					}),
					new TableHeader(),
					new TableCell(),
					new TableRow(),
					new Iframe(),
					new Link(),
				],
				onUpdate: ({ getHTML }) => {
					this.$emit("updateContent", getHTML());
				},
				content: this.content,
			}),
		};
	},
	watch: {
		mode: {
			handler() {
				this.editor.setOptions({
					editable: this.mode === "VIEW" ? false : true,
				});
				this.editor.setContent(this.content);
			},
			immediate: true,
		},
	},
	methods: {
		setContent(content) {
			this.editor.setContent(content);
		},
		handleEditorDrop(e) {
			e.preventDefault();
		},
		showLinkMenu(attrs) {
			this.linkUrl = attrs.href;
			this.linkMenuIsActive = true;
			this.$nextTick(() => {
				this.$refs.linkInput.focus();
			});
		},
		hideLinkMenu() {
			this.linkUrl = null;
			this.linkMenuIsActive = false;
		},
		setLinkUrl(command, url) {
			command({ href: url });
			this.hideLinkMenu();
		},
		insertLocalImage() {
			const that = this;
			let input = document.querySelector("#image-upload");
			let file = input.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function (evt) {
					that.insertImage(evt.target.result);
					input.value = null;
				};
				reader.readAsDataURL(file);
			}
		},
		toInsertIframe() {
			if (this.$prompt) {
				this.$prompt("Input URL", "Iframe", {
					confirmButtonText: "Confirm",
					cancelButtonText: "Close",
				}).then(({ value }) => {
					if (url) this.insertIframe(value);
				});
			} else {
				let url = prompt("Input URL");
				if (url) this.insertIframe(url);
			}
		},
		// 自定义插入
		insertImage(src, height, width) {
			if (typeof width === "number") {
				width = width + "px";
			}
			this.editor.commands.image({
				src: src,
				height: height ? height + "px" : null,
				width: width ? width : null,
			});
		},
		insertIframe(src, height = 500, width = "100%") {
			if (typeof width === "number") {
				width = width + "px";
			}
			this.editor.commands.iframe({
				src: src,
				height: height ? height + "px" : null,
				width: width ? width : null,
			});
		},
	},
};
</script>

<style lang="scss">
// 颜色
$black: #303030;
$white: #fefefe;
$grey: #eeeeee;
$pre-size: 1rem;
$code-size: 0.9em;

// 基础样式
p {
	margin: 0.6em 0;
}

// 菜单栏
.editor {
	font-size: 16px;
	display: flex;
	flex-direction: column;
	position: relative;
	.editor-tools {
		position: sticky;
		top: -25px;
		padding: 0 20px;
		background-color: #fefefe;
		z-index: 9;
		button {
			outline: none;
		}
		.svg-icon {
			width: 25px;
			height: 25px;
		}
		.menubar {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding: 15px 0;
			border-bottom: 1px solid rgb(192, 192, 192);
		}
		.break {
			display: flex;
			align-items: center;
		}
	}
	.note-content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
}

.menubar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: 3px 0;
	flex-shrink: 0;
	.divide {
		background-color: #5786f3;
		margin: 0 10px;
		width: 2px;
		height: 1.3em;
	}
	button,
	label[for*="upload"] {
		font-weight: bold;
		border: none;
		padding: 2px 4px;
		background-color: #fefefe;
		margin: 0 4px;
		&:hover {
			background-color: $grey;
		}
	}
	.is-active {
		background-color: $grey;
	}

	.table-delete {
		position: relative;
		> div {
			margin: 0;
		}
		> .float {
			position: absolute;
			width: max-content;
			z-index: 10;
			padding: 10px;
			border-radius: 5px;
			top: 40px;
			left: 50%;
			transform: translateX(-50%);
			background-color: #fefefe;
			box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
			button {
				width: 100%;
				text-align: left;
				padding: 4px 8px;
				display: block;
			}
			.desc {
				font-family: "Microsoft YaHei";
				font-size: 16px;
				font-weight: lighter;
				margin-left: 3px;
			}
		}
	}
}

.editor__content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	padding: 20px 40px;
	word-break: break-all;
	font-size: 17px !important;
	.ProseMirror {
		outline: none !important;
	}
	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: rgb(218, 218, 218);
		border-radius: 2px;
	}
	> div {
		padding: 10px 20px;
		border-radius: 6px;
		min-height: 500px;
		flex-grow: 1;
	}
	.title {
		border-bottom: 2px solid rgb(36, 27, 27);
	}
	img {
		max-width: 100%;
		display: block;
	}
	img.ProseMirror-selectednode {
		outline: solid rgba(#3672fc, 0.5) 2px;
	}
	blockquote {
		margin-left: 20px;
		padding-left: 20px;
		border-left: solid 5px rgb(165, 165, 165);
	}
	table {
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		overflow: hidden;

		td,
		th {
			min-width: 1em;
			border: 2px solid $grey;
			padding: 3px 5px;
			vertical-align: top;
			box-sizing: border-box;
			position: relative;
			> * {
				margin-top: 0;
				margin-bottom: 0;
			}
		}

		th {
			font-weight: bold;
			text-align: left;
		}

		.selectedCell:after {
			z-index: 2;
			position: absolute;
			content: "";
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: rgba(200, 200, 255, 0.4);
			pointer-events: none;
		}

		.column-resize-handle {
			position: absolute;
			right: -2px;
			top: 0;
			bottom: 0;
			width: 4px;
			z-index: 20;
			background-color: #adf;
			pointer-events: none;
		}
	}
}

// 编辑器
pre {
	padding: 0.7rem 1rem;
	border-radius: 5px;
	background: $black;
	color: $white;
	overflow-x: auto;

	code {
		font-family: Consolas;
		font-size: $code-size;
		display: block;
	}
}

.menububble {
	position: absolute;
	display: -webkit-box;
	display: flex;
	z-index: 20;
	background: #000;
	border-radius: 5px;
	padding: 0.3rem;
	margin-bottom: 0.5rem;
	-webkit-transform: translateX(-50%);
	transform: translateX(-50%);
	visibility: hidden;
	opacity: 0;
	-webkit-transition: opacity 0.2s, visibility 0.2s;
	transition: opacity 0.2s, visibility 0.2s;
}

.menububble .icon {
	position: relative;
	display: inline-block;
	vertical-align: middle;
	width: 0.8rem;
	height: 0.8rem;
	margin: 0 0.3rem;
	top: -0.05rem;
	fill: currentColor;
}

.menububble.is-active {
	opacity: 1;
	visibility: visible;
}

.menububble__button {
	display: -webkit-inline-box;
	display: inline-flex;
	background: transparent;
	border: 0;
	color: #fff;
	padding: 0.2rem 0.5rem;
	margin-right: 0.2rem;
	border-radius: 3px;
	cursor: pointer;
}

.menububble__button:last-child {
	margin-right: 0;
}

.menububble__button:hover {
	background-color: hsla(0, 0%, 100%, 0.1);
}

.menububble__button.is-active {
	background-color: hsla(0, 0%, 100%, 0.2);
}

.menububble__form {
	display: -webkit-box;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
}

.menububble__input {
	font: inherit;
	border: none;
	background: transparent;
	color: #fff;
}
</style>