<script setup lang="ts">
/**
 * curl 解码视图。
 *
 * 用 element-plus dialog 弹出，把当前 curl 命令里的 url query / headers /
 * cookies / -d / --data-binary / -F 全部解析并以「原值 → 解码值」表格形式呈现。
 *
 * 解码失败（命令不合法）时回退展示错误信息，不阻断用户继续编辑。
 */
import { computed, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { DocumentCopy, Document } from '@element-plus/icons-vue';
import {
  decodeCurl,
  isDecodedEmpty,
  type DecodedCurl,
  type DecodedDataPart,
} from '../utils/curlDecode';

const props = defineProps<{
  modelValue: boolean;
  command: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const { t } = useI18n();

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const decoded = ref<DecodedCurl | null>(null);
const parseError = ref<string>('');

watch(
  () => [props.modelValue, props.command] as const,
  ([open, cmd]) => {
    if (!open) return;
    parseError.value = '';
    decoded.value = null;
    try {
      decoded.value = decodeCurl(cmd);
    } catch (e: any) {
      parseError.value = e?.message || String(e);
    }
  },
  { immediate: true }
);

const empty = computed(() => !!decoded.value && isDecodedEmpty(decoded.value));

const methodTone = computed<'success' | 'warning' | 'danger' | 'info' | 'primary'>(() => {
  const m = decoded.value?.method;
  if (!m) return 'info';
  if (m === 'GET') return 'success';
  if (m === 'POST') return 'primary';
  if (m === 'PUT' || m === 'PATCH') return 'warning';
  if (m === 'DELETE') return 'danger';
  return 'info';
});

function partLabel(p: DecodedDataPart): string {
  if (p.kind === 'json') return p.flag + ' · JSON';
  if (p.kind === 'text') return p.flag + ' · ' + t('decode.kindText');
  return p.flag;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success(t('decode.copied'));
  } catch {
    ElMessage.warning(t('messages.copyFailed'));
  }
}

function buildAllText(d: DecodedCurl): string {
  const lines: string[] = [];
  lines.push(`# ${d.method} ${d.url?.full || ''}`);
  if (d.url && d.url.query.length) {
    lines.push('');
    lines.push(`## ${t('decode.sectionQuery')}`);
    for (const kv of d.url.query) {
      lines.push(`${kv.key} = ${kv.decodedValue}`);
    }
  }
  if (d.headers.length) {
    lines.push('');
    lines.push(`## ${t('decode.sectionHeaders')}`);
    for (const h of d.headers) lines.push(`${h.name}: ${h.value}`);
  }
  if (d.cookies.length) {
    lines.push('');
    lines.push(`## ${t('decode.sectionCookies')}`);
    for (const c of d.cookies) lines.push(`${c.key} = ${c.decodedValue}`);
  }
  if (d.forms.length) {
    lines.push('');
    lines.push(`## ${t('decode.sectionForm')}`);
    for (const f of d.forms) lines.push(`${f.key} = ${f.decodedValue}`);
  }
  d.dataParts.forEach((p, idx) => {
    lines.push('');
    lines.push(`## ${t('decode.sectionData')} #${idx + 1} (${partLabel(p)})`);
    if (p.pairs) {
      for (const kv of p.pairs) lines.push(`${kv.key} = ${kv.decodedValue}`);
    } else if (p.kind === 'json' && p.prettyJson) {
      lines.push(p.prettyJson);
    } else {
      lines.push(p.raw);
    }
  });
  return lines.join('\n');
}

async function copyAll() {
  if (!decoded.value) return;
  await copyText(buildAllText(decoded.value));
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="t('decode.title')"
    width="780px"
    align-center
    append-to-body
    destroy-on-close
    class="decode-dialog"
  >
    <div v-if="parseError" class="parse-error">
      <div class="err-title">{{ t('decode.parseErrorTitle') }}</div>
      <pre class="err-body">{{ parseError }}</pre>
    </div>

    <div v-else-if="decoded" class="decode-body">
      <div class="summary-row">
        <el-tag :type="methodTone" effect="dark" round size="default">
          {{ decoded.method }}
        </el-tag>
        <div class="url-cell" :title="decoded.url?.full || ''">
          {{ decoded.url?.full || '—' }}
        </div>
        <el-button
          size="small"
          :icon="DocumentCopy"
          plain
          :disabled="!decoded.url?.full"
          @click="copyText(decoded.url!.full)"
        >
          {{ t('decode.copyUrl') }}
        </el-button>
      </div>

      <div v-if="empty" class="empty-decode">
        <el-icon :size="24" class="empty-decode-icon"><Document /></el-icon>
        <div>{{ t('decode.empty') }}</div>
      </div>

      <template v-else>
        <!-- URL query -->
        <section v-if="decoded.url && decoded.url.query.length" class="decode-section">
          <div class="sec-head">
            <span class="sec-title">{{ t('decode.sectionQuery') }}</span>
            <span class="sec-count">{{ decoded.url.query.length }}</span>
          </div>
          <el-table :data="decoded.url.query" stripe size="small" class="kv-table">
            <el-table-column prop="key" :label="t('decode.colKey')" width="200">
              <template #default="{ row }">
                <span class="kv-key">{{ row.key }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('decode.colRaw')" min-width="180">
              <template #default="{ row }">
                <span class="kv-raw">{{ row.rawValue || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('decode.colDecoded')" min-width="200">
              <template #default="{ row }">
                <span class="kv-decoded" :class="{ 'is-changed': row.changed }">
                  {{ row.decodedValue || '—' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Headers -->
        <section v-if="decoded.headers.length" class="decode-section">
          <div class="sec-head">
            <span class="sec-title">{{ t('decode.sectionHeaders') }}</span>
            <span class="sec-count">{{ decoded.headers.length }}</span>
          </div>
          <el-table :data="decoded.headers" stripe size="small" class="kv-table">
            <el-table-column prop="name" :label="t('decode.colHeaderName')" width="220">
              <template #default="{ row }">
                <span class="kv-key">{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="value" :label="t('decode.colHeaderValue')">
              <template #default="{ row }">
                <span class="kv-decoded">{{ row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Cookies -->
        <section v-if="decoded.cookies.length" class="decode-section">
          <div class="sec-head">
            <span class="sec-title">{{ t('decode.sectionCookies') }}</span>
            <span class="sec-count">{{ decoded.cookies.length }}</span>
          </div>
          <el-table :data="decoded.cookies" stripe size="small" class="kv-table">
            <el-table-column prop="key" :label="t('decode.colKey')" width="200" />
            <el-table-column :label="t('decode.colRaw')" min-width="180">
              <template #default="{ row }">
                <span class="kv-raw">{{ row.rawValue || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('decode.colDecoded')" min-width="200">
              <template #default="{ row }">
                <span class="kv-decoded" :class="{ 'is-changed': row.changed }">
                  {{ row.decodedValue || '—' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- Multipart form -->
        <section v-if="decoded.forms.length" class="decode-section">
          <div class="sec-head">
            <span class="sec-title">{{ t('decode.sectionForm') }}</span>
            <span class="sec-count">{{ decoded.forms.length }}</span>
          </div>
          <el-table :data="decoded.forms" stripe size="small" class="kv-table">
            <el-table-column prop="key" :label="t('decode.colKey')" width="200" />
            <el-table-column prop="decodedValue" :label="t('decode.colValue')" />
          </el-table>
        </section>

        <!-- Data parts -->
        <section
          v-for="(part, idx) in decoded.dataParts"
          :key="idx"
          class="decode-section"
        >
          <div class="sec-head">
            <span class="sec-title">
              {{ t('decode.sectionData') }}
              <span class="part-flag">{{ partLabel(part) }}</span>
            </span>
            <span v-if="part.pairs" class="sec-count">{{ part.pairs.length }}</span>
            <el-button
              size="small"
              link
              :icon="DocumentCopy"
              @click="copyText(part.raw)"
            >
              {{ t('decode.copyRaw') }}
            </el-button>
          </div>

          <el-table
            v-if="part.pairs && part.pairs.length"
            :data="part.pairs"
            stripe
            size="small"
            class="kv-table"
          >
            <el-table-column prop="key" :label="t('decode.colKey')" width="200">
              <template #default="{ row }">
                <span class="kv-key">{{ row.key }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('decode.colRaw')" min-width="180">
              <template #default="{ row }">
                <span class="kv-raw">{{ row.rawValue || '—' }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('decode.colDecoded')" min-width="200">
              <template #default="{ row }">
                <span class="kv-decoded" :class="{ 'is-changed': row.changed }">
                  {{ row.decodedValue || '—' }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <pre v-else-if="part.kind === 'json' && part.prettyJson" class="raw-pre">{{
            part.prettyJson
          }}</pre>

          <pre v-else class="raw-pre">{{ part.raw }}</pre>
        </section>

        <div v-if="decoded.warnings.length" class="warn-row">
          <div class="warn-title">{{ t('decode.warningsTitle') }}</div>
          <ul>
            <li v-for="(w, i) in decoded.warnings" :key="i">{{ w }}</li>
          </ul>
        </div>
      </template>
    </div>

    <template #footer>
      <div class="footer-row">
        <el-button :disabled="!decoded || empty" :icon="DocumentCopy" @click="copyAll">
          {{ t('decode.copyAll') }}
        </el-button>
        <el-button type="primary" @click="visible = false">
          {{ t('decode.close') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.decode-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 70vh;
  overflow: auto;
  padding-right: 4px;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.url-cell {
  flex: 1;
  min-width: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-decode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 12px;
  color: var(--text-dim);
  font-size: 13px;
}
.empty-decode-icon {
  opacity: 0.5;
}

.decode-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sec-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.sec-title {
  font-weight: 600;
  color: var(--text);
  text-transform: none;
  letter-spacing: 0;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.part-flag {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  background: var(--kbd-bg);
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: none;
  letter-spacing: 0;
}
.sec-count {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-dim);
  background: var(--kbd-bg);
  padding: 1px 6px;
  border-radius: 8px;
  margin-right: auto;
}

.kv-table {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.kv-key {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
  word-break: break-all;
}
.kv-raw {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-dim);
  word-break: break-all;
}
.kv-decoded {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  word-break: break-all;
}
.kv-decoded.is-changed {
  color: var(--tok-str);
}

.raw-pre {
  margin: 0;
  padding: 10px 12px;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.55;
  color: var(--text);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 240px;
  overflow: auto;
}

.parse-error {
  border: 1px solid rgba(214, 57, 72, 0.35);
  background: rgba(214, 57, 72, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
}
.err-title {
  color: var(--danger);
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 6px;
}
.err-body {
  margin: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  white-space: pre-wrap;
}

.warn-row {
  border: 1px solid rgba(194, 112, 10, 0.3);
  background: rgba(194, 112, 10, 0.06);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--text);
}
.warn-title {
  color: var(--warn);
  font-weight: 600;
  margin-bottom: 4px;
}
.warn-row ul {
  margin: 0;
  padding-left: 18px;
}

.footer-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

<style>
/* dialog 全局微调，使其与项目整体暗/亮主题更协调 */
.decode-dialog.el-dialog {
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-strong);
}
.decode-dialog .el-dialog__header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  margin-right: 0;
}
.decode-dialog .el-dialog__title {
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
}
.decode-dialog .el-dialog__body {
  padding: 16px 18px;
}
.decode-dialog .el-dialog__footer {
  padding: 12px 18px;
  border-top: 1px solid var(--border);
}
.decode-dialog .el-table,
.decode-dialog .el-table tr,
.decode-dialog .el-table th.el-table__cell,
.decode-dialog .el-table td.el-table__cell {
  background: var(--panel);
  color: var(--text);
  border-color: var(--border) !important;
}
.decode-dialog .el-table th.el-table__cell {
  background: var(--panel-2);
  color: var(--text-dim);
  font-weight: 600;
  font-size: 12px;
}
.decode-dialog .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: var(--panel-2);
}
.decode-dialog .el-table__inner-wrapper::before {
  background-color: var(--border);
}
</style>
