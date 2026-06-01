<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CaretRight, Brush, Delete, DocumentCopy, Loading } from '@element-plus/icons-vue';
import { formatCurl, minifyCurl } from '../utils/curl';

const props = defineProps<{
  modelValue: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'run'): void;
  (e: 'clear'): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const lineCount = computed(() => value.value.split('\n').length);
const charCount = computed(() => value.value.length);

function handleFormat() {
  try {
    value.value = formatCurl(value.value);
    ElMessage.success('已格式化');
  } catch (e: any) {
    ElMessage.error(`格式化失败：${e?.message || e}`);
  }
}

function handleMinify() {
  try {
    value.value = minifyCurl(value.value);
  } catch (e: any) {
    ElMessage.error(`压缩失败：${e?.message || e}`);
  }
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(value.value);
    ElMessage.success('已复制到剪贴板');
  } catch {
    ElMessage.warning('复制失败，请手动复制');
  }
}

function handleClear() {
  value.value = '';
  emit('clear');
  textareaRef.value?.focus();
}

function handleKeyDown(e: KeyboardEvent) {
  // Cmd/Ctrl + Enter 执行
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    emit('run');
    return;
  }
  // Cmd/Ctrl + Shift + F 格式化
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
    e.preventDefault();
    handleFormat();
    return;
  }
  // Tab -> 插入两个空格
  if (e.key === 'Tab') {
    e.preventDefault();
    const ta = e.target as HTMLTextAreaElement;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const v = value.value;
    value.value = v.slice(0, start) + '  ' + v.slice(end);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + 2;
    });
  }
}
</script>

<template>
  <div class="editor-root">
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button
          type="primary"
          :icon="props.loading ? Loading : CaretRight"
          :loading="props.loading"
          @click="emit('run')"
        >
          执行 <span class="kbd">⌘↵</span>
        </el-button>
        <el-button :icon="Brush" @click="handleFormat">
          格式化 <span class="kbd">⌘⇧F</span>
        </el-button>
        <el-button :icon="DocumentCopy" plain @click="handleMinify">压缩</el-button>
      </div>
      <div class="toolbar-right">
        <el-button :icon="DocumentCopy" link @click="handleCopy">复制</el-button>
        <el-button :icon="Delete" link type="danger" @click="handleClear">清空</el-button>
      </div>
    </div>

    <div class="editor-body">
      <pre class="line-numbers" aria-hidden="true">{{
        Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')
      }}</pre>
      <textarea
        ref="textareaRef"
        v-model="value"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="off"
        class="editor"
        placeholder="在此粘贴或输入 curl 命令...\n\n示例：\ncurl https://httpbin.org/post -X POST -H 'Content-Type: application/json' -d '{&quot;a&quot;:1}'"
        @keydown="handleKeyDown"
      />
    </div>

    <div class="statusbar">
      <span>{{ lineCount }} 行</span>
      <span class="dot">·</span>
      <span>{{ charCount }} 字符</span>
      <span class="spacer" />
      <span class="hint">Tab = 2 空格 · ⌘↵ 执行 · ⌘⇧F 格式化</span>
    </div>
  </div>
</template>

<style scoped>
.editor-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--panel);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--panel-2);
  gap: 8px;
  flex-wrap: wrap;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.kbd {
  display: inline-block;
  margin-left: 6px;
  font-family: var(--mono);
  font-size: 11px;
  padding: 1px 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.85);
}

.editor-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: var(--panel);
}

.line-numbers {
  margin: 0;
  padding: 14px 8px 14px 14px;
  text-align: right;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: #545b6e;
  user-select: none;
  background: var(--panel);
  border-right: 1px solid var(--border);
  white-space: pre;
  overflow: hidden;
  min-width: 48px;
}

.editor {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: var(--panel);
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  padding: 14px;
  caret-color: var(--accent);
  tab-size: 2;
}
.editor::placeholder {
  color: #4a5066;
  white-space: pre-wrap;
}

.statusbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-top: 1px solid var(--border);
  background: var(--panel-2);
  color: var(--text-dim);
  font-size: 12px;
  font-family: var(--mono);
}
.dot {
  opacity: 0.5;
}
.spacer {
  flex: 1;
}
.hint {
  font-family: var(--mono);
  font-size: 11px;
  color: #6c7388;
}
</style>
