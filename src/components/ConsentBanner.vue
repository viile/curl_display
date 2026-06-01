<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Lock, Close } from '@element-plus/icons-vue';
import { useConsent } from '../composables/useConsent';

const { t } = useI18n();
const { isUnknown, accept, decline } = useConsent();
</script>

<template>
  <Transition name="consent">
    <div v-if="isUnknown" class="consent-banner" role="dialog" aria-live="polite">
      <div class="consent-icon" aria-hidden="true">
        <el-icon><Lock /></el-icon>
      </div>
      <div class="consent-text">
        <div class="consent-title">{{ t('consent.title') }}</div>
        <div class="consent-msg">{{ t('consent.message') }}</div>
      </div>
      <div class="consent-actions">
        <el-button size="small" plain @click="decline">
          {{ t('consent.decline') }}
        </el-button>
        <el-button size="small" type="primary" @click="accept">
          {{ t('consent.accept') }}
        </el-button>
        <button
          type="button"
          class="consent-close"
          :title="t('consent.decline')"
          @click="decline"
        >
          <el-icon><Close /></el-icon>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.consent-banner {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 2000;
  max-width: min(720px, calc(100vw - 32px));
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px 12px 16px;
  background: var(--panel-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-strong);
  color: var(--text);
}

.consent-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--hover-strong), var(--active));
  border-radius: 9px;
  color: var(--accent);
  font-size: 18px;
}

.consent-text {
  flex: 1;
  min-width: 0;
}
.consent-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
}
.consent-msg {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.5;
}

.consent-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.consent-close {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  border-radius: 6px;
  margin-left: 2px;
}
.consent-close:hover {
  color: var(--text);
  background: var(--hover);
}

.consent-enter-active,
.consent-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@media (max-width: 600px) {
  .consent-banner {
    flex-direction: column;
    align-items: stretch;
    text-align: left;
  }
  .consent-actions {
    justify-content: flex-end;
  }
}
</style>
