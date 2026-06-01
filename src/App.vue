<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import CurlEditor from './components/CurlEditor.vue';
import ResultPanel from './components/ResultPanel.vue';
import { executeCurl, type ExecuteResult } from './api/execute';

const DEFAULT_CURL = `curl https://httpbin.org/get \\
  -H 'Accept: application/json' \\
  -H 'User-Agent: curl-display/1.0'`;

const command = ref<string>(DEFAULT_CURL);
const loading = ref(false);
const result = ref<ExecuteResult | null>(null);

async function handleRun() {
  if (!command.value.trim()) {
    ElMessage.warning('请输入 curl 命令');
    return;
  }
  loading.value = true;
  try {
    const r = await executeCurl(command.value);
    result.value = r;
    if (!r.ok && r.error) {
      ElMessage.error(r.error);
    }
  } catch (e: any) {
    ElMessage.error(`请求失败：${e?.message || e}`);
    result.value = {
      ok: false,
      exitCode: null,
      stderr: '',
      statusCode: null,
      timeMs: null,
      sizeBytes: null,
      url: null,
      contentType: null,
      headers: [],
      body: '',
      error: e?.message || String(e),
    };
  } finally {
    loading.value = false;
  }
}

function handleClear() {
  result.value = null;
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <span class="brand-icon">🛠️</span>
        <span class="brand-title">cURL Runner</span>
        <span class="brand-sub">本地执行 · 格式化 · 结果可视化</span>
      </div>
      <div class="header-meta">
        <a
          class="repo-link"
          href="https://curl.se/docs/manpage.html"
          target="_blank"
          rel="noreferrer"
          >curl 文档 ↗</a
        >
      </div>
    </header>

    <main class="app-main">
      <section class="pane pane-left">
        <CurlEditor
          v-model="command"
          :loading="loading"
          @run="handleRun"
          @clear="handleClear"
        />
      </section>

      <div class="divider" />

      <section class="pane pane-right">
        <ResultPanel :result="result" :loading="loading" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, #181c27 0%, #11131a 100%);
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.brand-icon {
  font-size: 18px;
}
.brand-title {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.3px;
  background: linear-gradient(90deg, #7c5cff, #2bd9b1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.brand-sub {
  color: var(--text-dim);
  font-size: 12px;
}

.repo-link {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 12px;
}
.repo-link:hover {
  color: var(--text);
}

.app-main {
  flex: 1;
  display: flex;
  min-height: 0;
}

.pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.divider {
  width: 1px;
  background: var(--border);
}
</style>
