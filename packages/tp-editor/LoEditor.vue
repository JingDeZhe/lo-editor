<template>
	<div class="editor">
		<div class="float-modal" @click="resetFloats" v-show="showFloatModal"></div>
		<div
			class="mode-edit"
			@click="isPreview = false"
			v-if="mode === 'VIEW' || isPreview"
		>
			<icon icon-class="edit"></icon>
		</div>
		<div class="editor-tools">
			<editor-menu-bar
				:editor="editor"
				v-slot="{ commands, isActive }"
				v-if="mode != 'VIEW' && !isPreview"
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
						class="float-parent menubar__button"
						@click="toggleFloat('fontFamily')"
					>
						<abbr :title="i18n.editor.fontFamily">
							<icon icon-class="font-family" />
						</abbr>
						<div class="float select-menu" v-if="floats.fontFamily">
							<div
								class="menu-item"
								@click="commands.fontFamily({ fontFamily: 'initial' })"
								style="font-family: initial"
							>
								默认
							</div>
							<div
								class="menu-item"
								@click="commands.fontFamily({ fontFamily: 'SimSun' })"
								style="font-family: SimSun"
							>
								宋体
							</div>
							<div
								class="menu-item"
								@click="commands.fontFamily({ fontFamily: 'FangSong' })"
								style="font-family: FangSong"
							>
								仿宋
							</div>
							<div
								class="menu-item"
								@click="commands.fontFamily({ fontFamily: 'SimHei' })"
								style="font-family: SimHei"
							>
								黑体
							</div>
							<div
								class="menu-item"
								@click="commands.fontFamily({ fontFamily: 'KaiTi' })"
								style="font-family: KaiTi"
							>
								楷体
							</div>
						</div>
					</button>
					<button
						class="float-parent menubar__button"
						@click="toggleFloat('fontSize')"
					>
						<abbr :title="i18n.editor.fontSize">
							<icon icon-class="font-size" />
						</abbr>
						<div class="float select-menu" v-if="floats.fontSize">
							<div
								class="menu-item"
								:class="{
									'is-active': isActive.fontSize({ fontSize: 'initial' }),
								}"
								@click="commands.fontSize({ fontSize: 'initial' })"
								style="font-family: initial"
							>
								默认
							</div>
							<div
								v-for="size in fontSizes"
								:key="size"
								class="menu-item"
								:class="{ 'is-active': isActive.fontSize({ fontSize: size }) }"
								@click="commands.fontSize({ fontSize: size })"
								:style="{ 'font-size': size }"
							>
								{{ size }}
							</div>
						</div>
					</button>

					<button
						class="menubar__button float-parent"
						@click="toggleFloat('fontColor')"
					>
						<abbr :title="i18n.editor.fontColor">
							<icon icon-class="font-color"></icon>
						</abbr>
						<div class="float color-panel" v-if="floats.fontColor">
							<div
								class="color-piece"
								style="background: none"
								@click="changeFontColor(commands, 'initial')"
							>
								<icon icon-class="close"></icon>
							</div>
							<div
								class="color-piece"
								v-for="color in fontColors"
								:key="color"
								:style="{ background: color }"
								@click="changeFontColor(commands, color)"
							></div>
						</div>
					</button>
					<button
						class="menubar__button float-parent"
						@click="toggleFloat('bkgColor')"
					>
						<abbr :title="i18n.editor.bgColor">
							<icon icon-class="background"></icon>
						</abbr>
						<div class="float color-panel" v-if="floats.bkgColor">
							<div
								class="color-piece"
								style="background: none"
								@click="changeBkgColor(commands, 'none')"
							>
								<icon icon-class="close"></icon>
							</div>
							<div
								class="color-piece"
								v-for="color in bgColors"
								:key="color"
								:style="{ background: color }"
								@click="changeBkgColor(commands, color)"
							></div>
						</div>
					</button>
					<button
						class="menubar__button"
						:class="{
							'is-active': isActive.paragraph({ textAlign: 'left' }),
						}"
						@click="commands.paragraph({ textAlign: 'left' })"
					>
						<abbr :title="i18n.editor.alignLeft">
							<icon icon-class="align-left"></icon>
						</abbr>
					</button>
					<button
						class="menubar__button"
						:class="{
							'is-active': isActive.paragraph({ textAlign: 'center' }),
						}"
						@click="commands.paragraph({ textAlign: 'center' })"
					>
						<abbr :title="i18n.editor.alignCenter">
							<icon icon-class="align-center"></icon>
						</abbr>
					</button>
					<button
						class="menubar__button"
						:class="{
							'is-active': isActive.paragraph({ textAlign: 'right' }),
						}"
						@click="commands.paragraph({ textAlign: 'right' })"
					>
						<abbr :title="i18n.editor.alignRight">
							<icon icon-class="align-right"></icon>
						</abbr>
					</button>
					<button
						class="menubar__button"
						:class="{
							'is-active': isActive.paragraph({ textAlign: 'justify' }),
						}"
						@click="commands.paragraph({ textAlign: 'justify' })"
					>
						<abbr :title="i18n.editor.alignJustify">
							<icon icon-class="align-justify"></icon>
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
							class="menubar__button float-parent"
							@click="toggleFloat('deleteTable')"
						>
							<abbr :title="i18n.editor.deleteTable">
								<icon icon-class="表格删除" />
							</abbr>
							<div
								class="select-menu table-delete float"
								v-if="floats.deleteTable"
							>
								<div class="menu-item" @click="commands.deleteRow">
									<icon icon-class="删除行" />
									<span class="desc">{{ i18n.editor.deleteRow }}</span>
								</div>
								<div class="menu-item" @click="commands.deleteColumn">
									<icon icon-class="删除列" />
									<span class="desc">{{ i18n.editor.deleteCol }}</span>
								</div>
								<div class="menu-item" @click="commands.deleteTable">
									<icon icon-class="表格删除" />
									<span class="desc">{{ i18n.editor.deleteTable }}</span>
								</div>
							</div>
						</button>
					</span>
					<span class="divide"></span>
					<label for="image-upload">
						<abbr :title="i18n.editor.insertImage">
							<icon icon-class="图片" />
						</abbr>
					</label>
					<button class="menubar__button" @click="toInsertURL('iframe')">
						<abbr :title="i18n.editor.insertIframe">
							<icon icon-class="iframe" />
						</abbr>
					</button>
					<button class="menubar__button" @click="toInsertURL('video')">
						<abbr :title="i18n.editor.insertVedio">
							<icon icon-class="vedio"></icon>
						</abbr>
					</button>
          <label for="vedio-upload">
						<abbr :title="i18n.editor.insertVedio">
							<icon icon-class="vedio-local" />
						</abbr>
					</label>
					<div class="divide"></div>
					<button class="menubar__button" @click="isPreview = true">
						<abbr :title="i18n.editor.preview">
							<icon icon-class="eye"></icon>
						</abbr>
					</button>
					<input
						type="file"
						accept=".png, .jpg, .jpeg"
						id="image-upload"
						@change="insertLocalImage()"
						hidden
					/>
					<input
						type="file"
						accept=".mp4, .ogg, .webm"
						id="vedio-upload"
						@change="insertLocalVedio()"
						hidden
					/>
				</div>
			</editor-menu-bar>
		</div>
		<editor-menu-bubble
			class="menububble"
			:editor="editor"
			@hide="hideLinkMenu"
			v-if="enableLink && mode !== 'VIEW' && !isPreview"
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
import Vedio from "./tpEditor/Vedio";
import Strike from "./tpEditor/Strike";
import FontSize from "./tpEditor/marks/FontSize";
import FontFamily from "./tpEditor/marks/FontFamily";
import FontColor from "./tpEditor/marks/FontColor";
import BkgColor from "./tpEditor/marks/BkgColor";
import Paragraph from "./tpEditor/marks/Paragraph";

export default {
	name: "lo-editor",
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
		enableLink: {
			type: Boolean,
			default() {
				return false;
			},
		},
		fontSizes: {
			type: Array,
			default() {
				return ["18px", "24px", "30px"];
			},
		},
		fontColors: {
			type: Array,
			default() {
				return [
					"#0b1013",
					"#0f2540",
					"#08192d",
					"#005caf",
					"#0b346e",
					"#7b90d2",
					"#261e47",
					"#113285",
					"#4e4f97",
					"#211e55",
					"#6a4c9c",
					"#3c2f41",
					"#3f2b36",
					"#562e37",
					"#134857",
					"#126e82",
					"#0eb0c9",
					"#9b1e64",
					"#ec2d7a",
					"#cf4813",
					"#64483d",
					"#732e12",
					"#ef632b",
					"#c8adc4",
					"#de7897",
					"#f1c4cd",
					"#f8ebe6",
				];
			},
		},
		bgColors: {
			type: Array,
			default() {
				return [
					"#f7f4ed",
					"#e4dfd7",
					"#dad4cb",
					"#dfecd5",
					"#cad3c3",
					"#c6dfc8",
					"#9abeaf",
					"#737c7b",
					"#7cabb1",
					"#b9dec9",
					"#93d5dc",
					"#5e7987",
					"#c3d7df",
					"#8fb2c9",
					"#93b5cf",
					"#7a7374",
					"#a7a8bd",
					"#e0c8d1",
					"#c8adc4",
					"#de7897",
					"#f1c4cd",
					"#f8ebe6",
					"#eea2a4",
					"#cf4813",
					"#64483d",
					"#732e12",
					"#ef632b",
				];
			},
		},
		i18n: {
			type: Object,
			default() {
				return {
					editor: {
						fontFamily: "font family",
						fontSize: "font size",
						fontColor: "font color",
						bgColor: "background color",
						alignLeft: "align left",
						alignCenter: "align center",
						alignRight: "align-right",
						alignJustify: "align justify",
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
						insertVedio: "insert vedio",
						preview: "preview",
						edit: "edit",
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
			isPreview: false,
			floats: {
				deleteTable: false,
				fontColor: false,
				fontFamily: false,
				fontSize: false,
				bkgColor: false,
				textAlign: false,
			},
			showFloatModal: false,
			linkMenuIsActive: false,
			linkUrl: "",
			fontSize: "initial",
			fontFamily: "initial",
			fontColor: "#000000",
			bkgColor: "none",
			// editor
			editor: new Editor({
				autoFocus: true,
				extensions: [
					new Paragraph(),
					new FontSize(),
					new FontFamily(),
					new FontColor(),
					new BkgColor(),
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
					new Vedio(),
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
					editable: this.mode === "VIEW" || this.isPreview ? false : true,
				});
				this.editor.setContent(this.content);
			},
			immediate: true,
		},
		isPreview(val) {
			this.editor.setOptions({
				editable: !val,
			});
		},
	},
	methods: {
		setContent(content) {
			this.editor.setContent(content);
		},
		resetFloats() {
			Object.keys(this.floats).forEach((key) => {
				this.floats[key] = false;
			});
			this.showFloatModal = false;
		},
		toggleFloat(name) {
			const tmp = this.floats[name];
			Object.keys(this.floats).forEach((key) => {
				this.floats[key] = false;
			});
			this.floats[name] = !tmp;
			this.showFloatModal = !tmp;
		},
		changeFontSize(commands) {
			commands.fontSize({ fontSize: this.fontSize });
		},
		changeFontFamily(commands) {
			commands.fontFamily({ fontFamily: this.fontFamily });
		},
		changeFontColor(commands, color) {
			this.fontColor = color;
			commands.fontColor({ fontColor: this.fontColor });
		},
		changeBkgColor(commands, color) {
			this.bkgColor = color;
			commands.bkgColor({ bkgColor: this.bkgColor });
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
				this.$emit("insertImage", file, this.insertImage.bind(this));
				input.value = "";
			}
		},
		insertLocalVedio() {
			const that = this;
			let input = document.querySelector("#vedio-upload");
			let file = input.files[0];
			if (file) {
				this.$emit("insertVedio", file, this.insertVideo.bind(this));
				input.value = "";
			}
		},
		toInsertURL(type) {
			if (this.$prompt) {
				this.$prompt("Input URL", "Iframe", {
					confirmButtonText: "Confirm",
					cancelButtonText: "Close",
				}).then(({ value }) => {
					this.toInsertEmbed(type, value);
				});
			} else {
				let value = prompt("Input URL");
				this.toInsertEmbed(type, value);
			}
		},
		toInsertEmbed(type, url) {
			if (!url) return;
			switch (type) {
				case "iframe":
					this.insertIframe(url);
					break;
				case "video":
					this.insertVideo(url);
					break;
				default:
					break;
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
		insertVideo(src, height = 500, width = "100%") {
			if (typeof width === "number") {
				width = width + "px";
			}
			this.editor.commands.video({
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
	.float-modal {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10;
	}
	.mode-edit {
		position: absolute;
		right: 15px;
		top: 10px;
		width: 25px;
		height: 25px;
		z-index: 200;
		padding: 5px;
		cursor: pointer;
		.svg-icon {
			width: 100%;
			height: 100%;
		}
	}
	.editor-tools {
		position: sticky;
		top: -25px;
		padding: 0 20px;
		background-color: #fefefe;
		z-index: 10;
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
		margin: 4px;
		&:hover {
			background-color: $grey;
		}
	}
	.is-active {
		background-color: $grey;
	}

	.float-parent {
		position: relative;
	}

	.float {
		position: absolute;
		top: 40px;
		left: 0;
		z-index: 30;
		border-radius: 5px;
		background-color: #fefefe;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		overflow-x: hidden;
		overflow-y: auto;
		border-top: 2px solid rgb(201, 201, 201);
	}
	.select-menu {
		min-width: 100px;
		text-align: left;
		font-size: 18px;
		padding: 10px 0;
		.menu-item {
			padding: 5px 10px;
			&:hover {
				background-color: $grey;
			}
		}
	}

	.table-delete {
		width: max-content;
		.desc {
			margin-left: 10px;
			vertical-align: super;
		}
	}
}

.color-panel {
	display: flex;
	flex-wrap: wrap;
	width: 220px;
	max-height: 500px;
	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: rgb(182, 182, 182);
		border-radius: 2px;
	}
	.color-piece {
		width: 20px;
		height: 20px;
		border-radius: 3px;
		margin: 5px;
		.svg-icon {
			width: 12px;
			height: 20px;
			vertical-align: middle;
		}
		&:hover {
			transform: translateY(-2px);
		}
	}
}

.editor__content {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 10px 0;
	word-break: break-all;
	font-size: 17px !important;
	.ProseMirror {
		outline: none !important;
		padding: 10px 20px;
		min-height: 500px;
		flex: 1;
		overflow-y: auto;
		&::-webkit-scrollbar {
			width: 6px;
		}
		&::-webkit-scrollbar-thumb {
			background-color: rgb(218, 218, 218);
			border-radius: 2px;
		}
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