<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import CurlEditor from './components/CurlEditor.vue';
import ResultPanel from './components/ResultPanel.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import ShareButton from './components/ShareButton.vue';
import ConsentBanner from './components/ConsentBanner.vue';
import { executeCurl, type ExecuteResult, type EngineType } from './api/execute';
import { currentElementLocale } from './i18n';
import { useHistory, type HistoryItem } from './composables/useHistory';
import { useEngine } from './composables/useEngine';
import { useSeo } from './composables/useSeo';
import { openExternal } from './utils/openExternal';

const CURL_DOCS_URL = 'https://curl.se/';

const { t } = useI18n();
// 跟随 locale 动态刷新 <title> / <meta description> / OG 等 SEO 标签
useSeo();

const DEFAULT_CURL = `curl https://httpbin.org/get \\
  -H 'Accept: application/json' \\
  -H 'User-Agent: curl-display/1.0'`;

const command = ref<string>(DEFAULT_CURL);
const loading = ref(false);
const result = ref<ExecuteResult | null>(null);

const history = useHistory();
const { engine, setEngine } = useEngine();
/** 防止编程式 set command 触发 watch 时再次覆盖 result */
let suppressSync = false;

async function runWith(eng: EngineType) {
  loading.value = true;
  try {
    const r = await executeCurl(command.value, eng);
    result.value = r;
    if (!r.ok && r.error) {
      ElMessage.error(r.error);
    }
    history.record(command.value, r);
  } catch (e: any) {
    ElMessage.error(t('messages.requestFailed', { msg: e?.message || e }));
    const failed: ExecuteResult = {
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
      engine: eng,
    };
    result.value = failed;
    history.record(command.value, failed);
  } finally {
    loading.value = false;
  }
}

async function handleRun() {
  if (!command.value.trim()) {
    ElMessage.warning(t('messages.emptyCommand'));
    return;
  }
  await runWith(engine.value);
}

async function handleRetryWithServer() {
  setEngine('server');
  await runWith('server');
}

function handleClear() {
  result.value = null;
}

function handlePickHistory(item: HistoryItem) {
  suppressSync = true;
  command.value = item.command;
  result.value = item.result ?? null;
  // 下一 tick 解除抑制，避免后续手动编辑被吞
  setTimeout(() => {
    suppressSync = false;
  }, 0);
}

// 监听命令变化：若与历史中某条完全一致，则自动加载对应结果。
// 这样用户在多个常用 curl 之间切换/粘贴时，结果面板也会跟着切。
watch(command, (val) => {
  if (suppressSync) return;
  const match = history.findByCommand(val);
  if (match && match.result) {
    result.value = match.result;
  }
});
</script>

<template>
  <el-config-provider :locale="currentElementLocale">
    <div class="app-shell">
      <header class="app-header">
        <div class="brand">
          <span class="brand-icon">🛠️</span>
          <span class="brand-title">{{ t('app.title') }}</span>
          <span class="brand-sub">{{ t('app.subtitle') }}</span>
        </div>
        <div class="header-meta">
          <a
            class="repo-link"
            :href="CURL_DOCS_URL"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="openExternal(CURL_DOCS_URL)"
            >{{ t('app.docsLink') }} ↗</a
          >
          <ShareButton />
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      <main class="app-main">
        <section class="pane pane-left">
          <CurlEditor
            v-model="command"
            :loading="loading"
            @run="handleRun"
            @clear="handleClear"
            @pick-history="handlePickHistory"
          />
        </section>

        <div class="divider" />

        <section class="pane pane-right">
          <ResultPanel
            :result="result"
            :loading="loading"
            @retry-with-server="handleRetryWithServer"
          />
        </section>
      </main>

      <ConsentBanner />
    </div>
  </el-config-provider>
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
  background: linear-gradient(180deg, var(--header-from) 0%, var(--header-to) 100%);
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
  background: linear-gradient(90deg, var(--brand-from), var(--brand-to));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.brand-sub {
  color: var(--text-dim);
  font-size: 12px;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 14px;
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
