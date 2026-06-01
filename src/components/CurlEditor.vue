<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { CaretRight, Brush, Delete, DocumentCopy, Loading } from '@element-plus/icons-vue';
import { formatCurl, minifyCurl } from '../utils/curl';
import HistoryMenu from './HistoryMenu.vue';
import EngineSwitcher from './EngineSwitcher.vue';
import type { HistoryItem } from '../composables/useHistory';

const props = defineProps<{
  modelValue: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'run'): void;
  (e: 'clear'): void;
  (e: 'pick-history', item: HistoryItem): void;
}>();

const { t } = useI18n();
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const lineCount = computed(() => value.value.split('\n').length);
const charCount = computed(() => value.value.length);

const isMac = computed(() => {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
});
const kbdRun = computed(() => (isMac.value ? '⌘↵' : 'Ctrl+↵'));
const kbdFormat = computed(() => (isMac.value ? '⌘⇧F' : 'Ctrl+Shift+F'));

function handleFormat() {
  try {
    value.value = formatCurl(value.value);
    ElMessage.success(t('messages.formatted'));
  } catch (e: any) {
    ElMessage.error(t('messages.formatFailed', { msg: e?.message || e }));
  }
}

function handleMinify() {
  try {
    value.value = minifyCurl(value.value);
  } catch (e: any) {
    ElMessage.error(t('messages.minifyFailed', { msg: e?.message || e }));
  }
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(value.value);
    ElMessage.success(t('messages.copied'));
  } catch {
    ElMessage.warning(t('messages.copyFailed'));
  }
}

function handleClear() {
  value.value = '';
  emit('clear');
  textareaRef.value?.focus();
}

function handleKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    emit('run');
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
    e.preventDefault();
    handleFormat();
    return;
  }
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
          {{ t('editor.run') }} <span class="kbd">{{ kbdRun }}</span>
        </el-button>
        <el-button :icon="Brush" @click="handleFormat">
          {{ t('editor.format') }} <span class="kbd">{{ kbdFormat }}</span>
        </el-button>
        <el-button :icon="DocumentCopy" plain @click="handleMinify">
          {{ t('editor.minify') }}
        </el-button>
        <HistoryMenu
          :current-command="value"
          @pick="(item) => emit('pick-history', item)"
        />
      </div>
      <div class="toolbar-right">
        <EngineSwitcher />
        <el-button :icon="DocumentCopy" link @click="handleCopy">
          {{ t('editor.copy') }}
        </el-button>
        <el-button :icon="Delete" link type="danger" @click="handleClear">
          {{ t('editor.clear') }}
        </el-button>
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
        :placeholder="t('editor.placeholder')"
        @keydown="handleKeyDown"
      />
    </div>

    <div class="statusbar">
      <span>{{ t('editor.statusLines', { n: lineCount }) }}</span>
      <span class="dot">·</span>
      <span>{{ t('editor.statusChars', { n: charCount }) }}</span>
      <span class="spacer" />
      <span class="hint">{{
        t('editor.statusHint', { run: kbdRun, format: kbdFormat })
      }}</span>
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
  background: var(--kbd-bg);
  border-radius: 4px;
  color: var(--kbd-text);
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
  color: var(--text-faint);
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
  color: var(--text-faint);
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
  color: var(--text-mute);
}
</style>
