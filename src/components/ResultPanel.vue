<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentCopy, Download, Loading } from '@element-plus/icons-vue';
import type { ExecuteResult } from '../api/execute';

const props = defineProps<{
  result: ExecuteResult | null;
  loading?: boolean;
}>();

const activeTab = ref<'body' | 'headers' | 'raw'>('body');

watch(
  () => props.result,
  () => {
    activeTab.value = 'body';
  }
);

const statusTone = computed<'success' | 'warning' | 'danger' | 'info'>(() => {
  const code = props.result?.statusCode;
  if (!code) return 'info';
  if (code >= 200 && code < 300) return 'success';
  if (code >= 300 && code < 400) return 'info';
  if (code >= 400 && code < 500) return 'warning';
  return 'danger';
});

const isJson = computed(() => {
  const ct = props.result?.contentType || '';
  if (ct.includes('application/json')) return true;
  const body = props.result?.body?.trim() || '';
  return (
    (body.startsWith('{') && body.endsWith('}')) ||
    (body.startsWith('[') && body.endsWith(']'))
  );
});

const prettyBody = computed(() => {
  const body = props.result?.body ?? '';
  if (!body) return '';
  if (isJson.value) {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  }
  return body;
});

function formatSize(bytes: number | null | undefined): string {
  if (bytes == null) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function copyBody() {
  if (!props.result) return;
  try {
    await navigator.clipboard.writeText(prettyBody.value);
    ElMessage.success('响应体已复制');
  } catch {
    ElMessage.warning('复制失败');
  }
}

function downloadBody() {
  if (!props.result) return;
  const blob = new Blob([props.result.body], {
    type: props.result.contentType || 'text/plain',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ext = isJson.value ? 'json' : 'txt';
  a.download = `response-${Date.now()}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 简易 JSON 语法高亮 */
function highlightJson(json: string): string {
  if (!json) return '';
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'tok-num';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'tok-key' : 'tok-str';
      } else if (/true|false/.test(match)) {
        cls = 'tok-bool';
      } else if (/null/.test(match)) {
        cls = 'tok-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

const highlightedBody = computed(() => {
  if (!isJson.value) return '';
  return highlightJson(prettyBody.value);
});
</script>

<template>
  <div class="result-root">
    <div v-if="!result && !loading" class="empty">
      <div class="empty-icon">⌁</div>
      <div class="empty-title">还没有结果</div>
      <div class="empty-sub">在左侧编辑 curl 命令，点击「执行」或按 ⌘↵</div>
    </div>

    <div v-else-if="loading && !result" class="empty">
      <el-icon class="is-loading" :size="24"><Loading /></el-icon>
      <div class="empty-sub" style="margin-top: 10px">正在执行...</div>
    </div>

    <template v-else-if="result">
      <div class="result-header">
        <div class="status-row">
          <el-tag :type="statusTone" effect="dark" round size="large">
            <template v-if="result.statusCode">
              {{ result.statusCode }}
            </template>
            <template v-else>
              {{ result.ok ? 'OK' : 'ERROR' }}
            </template>
          </el-tag>
          <div class="url" :title="result.url || ''">
            {{ result.url || '—' }}
          </div>
        </div>

        <div class="meta-row">
          <div class="meta-item">
            <span class="meta-label">耗时</span>
            <span class="meta-value">{{
              result.timeMs != null ? result.timeMs + ' ms' : '-'
            }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">大小</span>
            <span class="meta-value">{{ formatSize(result.sizeBytes) }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">类型</span>
            <span class="meta-value mono">{{ result.contentType || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">退出</span>
            <span class="meta-value">{{ result.exitCode ?? '-' }}</span>
          </div>
        </div>

        <div v-if="result.error" class="error-block">
          <div class="error-title">执行错误</div>
          <pre>{{ result.error }}{{ result.hint ? '\n' + result.hint : '' }}</pre>
        </div>
        <div v-if="result.stderr" class="error-block stderr">
          <div class="error-title">stderr</div>
          <pre>{{ result.stderr }}</pre>
        </div>
      </div>

      <div class="tab-row">
        <button
          class="tab"
          :class="{ active: activeTab === 'body' }"
          @click="activeTab = 'body'"
        >
          响应体
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'headers' }"
          @click="activeTab = 'headers'"
        >
          响应头
          <span class="badge" v-if="result.headers.length">
            {{ result.headers.reduce((acc, b) => acc + b.headers.length, 0) }}
          </span>
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'raw' }"
          @click="activeTab = 'raw'"
        >
          原始
        </button>

        <div class="tab-actions">
          <el-button :icon="DocumentCopy" link @click="copyBody">复制</el-button>
          <el-button :icon="Download" link @click="downloadBody">下载</el-button>
        </div>
      </div>

      <div class="tab-body">
        <template v-if="activeTab === 'body'">
          <div v-if="!result.body" class="muted">（空响应体）</div>
          <pre v-else-if="isJson" class="code" v-html="highlightedBody" />
          <pre v-else class="code">{{ prettyBody }}</pre>
        </template>

        <template v-else-if="activeTab === 'headers'">
          <div v-if="!result.headers.length" class="muted">（无响应头）</div>
          <div v-else class="headers-list">
            <div
              v-for="(block, bi) in result.headers"
              :key="bi"
              class="header-block"
            >
              <div class="status-line">{{ block.statusLine }}</div>
              <table class="header-table">
                <tbody>
                  <tr v-for="(h, hi) in block.headers" :key="hi">
                    <td class="h-name">{{ h.name }}</td>
                    <td class="h-value">{{ h.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <template v-else>
          <pre class="code">{{ result.body }}</pre>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.result-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--panel);
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
}
.empty-icon {
  font-size: 56px;
  opacity: 0.3;
}
.empty-title {
  margin-top: 8px;
  font-size: 16px;
  color: var(--text);
}
.empty-sub {
  margin-top: 4px;
  font-size: 13px;
}

.result-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--panel-2);
}
.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.url {
  flex: 1;
  min-width: 0;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta-row {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.meta-item {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.meta-label {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.meta-value {
  font-size: 13px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta-value.mono {
  font-family: var(--mono);
}

.error-block {
  margin-top: 12px;
  border: 1px solid rgba(255, 93, 108, 0.4);
  background: rgba(255, 93, 108, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
}
.error-block.stderr {
  border-color: rgba(255, 180, 84, 0.35);
  background: rgba(255, 180, 84, 0.06);
}
.error-title {
  font-size: 12px;
  color: var(--danger);
  font-weight: 600;
  margin-bottom: 6px;
}
.error-block.stderr .error-title {
  color: var(--warn);
}
.error-block pre {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.tab-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  background: var(--panel-2);
  padding: 0 8px;
}
.tab {
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 13px;
  padding: 10px 14px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tab:hover {
  color: var(--text);
}
.tab.active {
  color: var(--text);
}
.tab.active::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  border-radius: 2px;
}
.badge {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1px 6px;
}
.tab-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
  padding-right: 6px;
}

.tab-body {
  flex: 1;
  overflow: auto;
  padding: 14px 16px;
  background: var(--panel);
}
.muted {
  color: var(--text-dim);
  font-size: 13px;
}
.code {
  margin: 0;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}

.headers-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.header-block {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.status-line {
  padding: 8px 12px;
  background: var(--panel-2);
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}
.header-table {
  width: 100%;
  border-collapse: collapse;
}
.header-table td {
  padding: 6px 12px;
  font-family: var(--mono);
  font-size: 12px;
  vertical-align: top;
  border-bottom: 1px solid var(--border);
  word-break: break-all;
}
.header-table tr:last-child td {
  border-bottom: none;
}
.h-name {
  color: var(--accent);
  width: 28%;
  white-space: nowrap;
  padding-right: 12px !important;
}
.h-value {
  color: var(--text);
}

/* JSON 高亮配色 */
:deep(.tok-key) {
  color: #7fb4ff;
}
:deep(.tok-str) {
  color: #2bd9b1;
}
:deep(.tok-num) {
  color: #ffb454;
}
:deep(.tok-bool) {
  color: #ff7eb6;
}
:deep(.tok-null) {
  color: #9aa3b2;
  font-style: italic;
}
</style>
