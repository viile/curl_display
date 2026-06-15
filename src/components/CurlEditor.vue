<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import {
  CaretRight,
  Brush,
  Delete,
  DocumentCopy,
  Loading,
  Key,
  VideoPause,
} from '@element-plus/icons-vue';
import { formatCurl, minifyCurl } from '../utils/curl';
import HistoryMenu from './HistoryMenu.vue';
import EngineSwitcher from './EngineSwitcher.vue';
import CurlDecoder from './CurlDecoder.vue';
import type { HistoryItem } from '../composables/useHistory';

const props = defineProps<{
  modelValue: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'run'): void;
  (e: 'stop'): void;
  (e: 'clear'): void;
  (e: 'pick-history', item: HistoryItem): void;
}>();

const { t } = useI18n();
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const decoderVisible = ref(false);

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

function handleDecode() {
  if (!value.value.trim()) {
    ElMessage.warning(t('messages.emptyCommand'));
    return;
  }
  decoderVisible.value = true;
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
    if (props.loading) return; // 防抖：loading 期间忽略快捷键
    emit('run');
    return;
  }
  if (e.key === 'Escape' && props.loading) {
    e.preventDefault();
    emit('stop');
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
  <div class="editor-root" :class="{ 'is-loading': props.loading }">
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="run-group" :class="{ 'is-loading': props.loading }">
          <el-button
            type="primary"
            class="run-btn"
            :class="{ 'is-running': props.loading }"
            :icon="props.loading ? Loading : CaretRight"
            :loading="props.loading"
            :disabled="props.loading"
            @click="emit('run')"
          >
            {{ props.loading ? t('editor.running') : t('editor.run') }}
            <span class="kbd">{{ kbdRun }}</span>
          </el-button>
          <el-button
            v-if="props.loading"
            type="danger"
            class="stop-btn"
            :icon="VideoPause"
            @click="emit('stop')"
          >
            {{ t('editor.stop') }}
            <span class="kbd">Esc</span>
          </el-button>
        </div>
        <el-button :icon="Brush" @click="handleFormat">
          {{ t('editor.format') }} <span class="kbd">{{ kbdFormat }}</span>
        </el-button>
        <el-button :icon="DocumentCopy" plain @click="handleMinify">
          {{ t('editor.minify') }}
        </el-button>
        <el-button :icon="Key" plain @click="handleDecode">
          {{ t('editor.decode') }}
        </el-button>
        <HistoryMenu
          :current-command="value"
          @pick="(item) => emit('pick-history', item)"
        />
        <HistoryMenu
          mode="favorites"
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
      <div v-if="props.loading" class="progress-bar" aria-hidden="true">
        <span class="progress-bar-track" />
      </div>
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

    <CurlDecoder v-model="decoderVisible" :command="value" />
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
  row-gap: 8px;
  flex-wrap: wrap;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
  row-gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  min-width: 0;
}
/* 当窄屏导致 toolbar-right 折行时，仍把它推到右侧，
   避免和 space-between 在单行情况下冲突：单行时 space-between 自然分隔，
   折行成单独一行时 margin-left:auto 起作用，使其贴右。 */
.toolbar-right {
  margin-left: auto;
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

/* Run / Stop 按钮组 */
.run-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.run-btn {
  position: relative;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
}
/* loading 中的 Run 按钮：脉冲光晕，颜色变冷，更醒目地表明"在跑" */
.run-btn.is-running {
  animation: run-pulse 1.4s ease-in-out infinite;
}
@keyframes run-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.55);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(64, 158, 255, 0);
  }
}
/* Stop 按钮：滑入动画，引导用户注意 */
.stop-btn {
  animation: stop-slide-in 0.2s ease-out;
}
@keyframes stop-slide-in {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.editor-body {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: var(--panel);
}

/* 顶部细长进度条：indeterminate 来回滑动，是最醒目的「正在执行」信号 */
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(64, 158, 255, 0.12);
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
}
.progress-bar-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent, #409eff),
    var(--accent-2, #79bbff),
    transparent
  );
  animation: progress-slide 1.1s ease-in-out infinite;
  border-radius: 3px;
}
@keyframes progress-slide {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
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
