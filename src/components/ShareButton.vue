<script setup lang="ts">
/**
 * 头部分享按钮。
 *
 * 点击后弹出 popover，内容：
 *   - 标题 / 副标题
 *   - 200×200 QR 码（编码 DESKTOP_DOWNLOAD_URL）
 *   - URL 只读输入框 + 复制按钮
 *   - 如果浏览器支持 navigator.share（移动端为主），追加 "Share via…" 按钮
 *
 * QR 用 npm `qrcode` 异步生成成 data URL，避免阻塞首屏。
 * 切换深浅色主题时 QR 需要重新渲染（前景色变化），通过观察 useTheme 完成。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Share, DocumentCopy, Connection, ArrowDown } from '@element-plus/icons-vue';
import QRCode from 'qrcode';
import { DESKTOP_DOWNLOAD_URL } from '../config/links';
import { useTheme } from '../composables/useTheme';

const { t } = useI18n();
const { effective: effectiveTheme } = useTheme();

const visible = ref(false);
const qrDataUrl = ref<string>('');
const qrError = ref<string>('');

const url = DESKTOP_DOWNLOAD_URL;

const canNativeShare = computed(
  () => typeof navigator !== 'undefined' && typeof navigator.share === 'function'
);

async function renderQr() {
  qrError.value = '';
  try {
    qrDataUrl.value = await QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        // 深色主题下用浅色前景，否则黑色
        dark: effectiveTheme.value === 'dark' ? '#e8e6f0' : '#181a20',
        light: '#00000000',
      },
    });
  } catch (e: any) {
    qrError.value = e?.message || String(e);
    qrDataUrl.value = '';
  }
}

// 仅在首次打开时生成；主题切换后若 popover 还开着，重新生成
watch(visible, (v) => {
  if (v) renderQr();
});
watch(effectiveTheme, () => {
  if (visible.value) renderQr();
});

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(url);
    ElMessage.success(t('share.copied'));
  } catch {
    // 兜底：选中输入框内容
    const input = document.getElementById('share-url-input') as HTMLInputElement | null;
    input?.select();
    ElMessage.warning(t('messages.copyFailed'));
  }
}

async function handleNativeShare() {
  if (!canNativeShare.value) return;
  try {
    await navigator.share({
      title: t('share.title'),
      text: t('share.subtitle'),
      url,
    });
  } catch {
    /* 用户取消或浏览器拒绝，静默 */
  }
}
</script>

<template>
  <el-popover
    v-model:visible="visible"
    trigger="click"
    placement="bottom-end"
    :width="280"
    popper-class="share-popover"
    :show-arrow="false"
  >
    <template #reference>
      <button type="button" class="hdr-btn" :title="t('share.title')">
        <el-icon class="hdr-btn-icon"><Share /></el-icon>
        <span class="hdr-btn-label">{{ t('share.button') }}</span>
        <el-icon class="hdr-btn-caret"><ArrowDown /></el-icon>
      </button>
    </template>

    <div class="share-panel" dir="ltr">
      <div class="sp-head">
        <div class="sp-title">{{ t('share.title') }}</div>
        <div class="sp-sub">{{ t('share.subtitle') }}</div>
      </div>

      <div class="qr-wrap">
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR" class="qr-img" />
        <div v-else-if="qrError" class="qr-err">{{ qrError }}</div>
        <div v-else class="qr-skeleton" />
        <div class="qr-hint">{{ t('share.qrHint') }}</div>
      </div>

      <div class="url-row">
        <input
          id="share-url-input"
          class="url-input"
          type="text"
          readonly
          :value="url"
          @focus="($event.target as HTMLInputElement).select()"
        />
        <button type="button" class="copy-btn" :title="t('share.copy')" @click="handleCopy">
          <el-icon><DocumentCopy /></el-icon>
        </button>
      </div>

      <div class="actions">
        <a class="action-btn primary" :href="url" target="_blank" rel="noopener">
          {{ t('share.openLink') }}
        </a>
        <button
          v-if="canNativeShare"
          type="button"
          class="action-btn"
          @click="handleNativeShare"
        >
          <el-icon :size="14"><Connection /></el-icon>
          <span>{{ t('share.nativeShare') }}</span>
        </button>
      </div>
    </div>
  </el-popover>
</template>

<style scoped>
.share-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sp-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sp-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
}
.sp-sub {
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.4;
}

.qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.qr-img {
  width: 180px;
  height: 180px;
  display: block;
  image-rendering: pixelated;
}
.qr-skeleton {
  width: 180px;
  height: 180px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--panel-2) 0%,
    var(--hover) 50%,
    var(--panel-2) 100%
  );
  background-size: 200% 100%;
  animation: qr-shimmer 1.2s ease-in-out infinite;
}
@keyframes qr-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
.qr-err {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  color: var(--danger);
  font-size: 11px;
}
.qr-hint {
  font-size: 11px;
  color: var(--text-dim);
}

.url-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
}
.url-input {
  flex: 1;
  min-width: 0;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-family: var(--mono);
  font-size: 11px;
  padding: 6px 9px;
  outline: none;
  text-overflow: ellipsis;
}
.url-input:focus {
  border-color: var(--accent);
}
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-dim);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.12s, border-color 0.12s, background 0.12s;
}
.copy-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--hover);
}

.actions {
  display: flex;
  gap: 6px;
}
.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.12s, background 0.12s, color 0.12s;
}
.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--hover);
}
.action-btn.primary {
  background: linear-gradient(90deg, var(--brand-from), var(--brand-to));
  border-color: transparent;
  color: #fff;
  font-weight: 500;
}
.action-btn.primary:hover {
  filter: brightness(1.08);
  color: #fff;
}
</style>

<style>
.share-popover.el-popper {
  background: var(--panel-2) !important;
  border: 1px solid var(--border) !important;
  padding: 12px !important;
  border-radius: 10px !important;
  box-shadow: var(--shadow-strong) !important;
}
</style>
