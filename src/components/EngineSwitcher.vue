<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Connection, Monitor, Cpu, ArrowDown, Check } from '@element-plus/icons-vue';
import { useEngine } from '../composables/useEngine';
import type { EngineType } from '../api/execute';

const { t } = useI18n();
const { engine, setEngine, isTauri } = useEngine();

interface Option {
  key: EngineType;
  labelKey: string;
  subtitleKey: string;
  icon: typeof Monitor;
}

const BROWSER_OPTIONS: Option[] = [
  { key: 'browser', labelKey: 'engine.browser', subtitleKey: 'engine.browserHint', icon: Monitor },
  { key: 'server', labelKey: 'engine.server', subtitleKey: 'engine.serverHint', icon: Connection },
];

const current = computed(
  () => BROWSER_OPTIONS.find((o) => o.key === engine.value) ?? BROWSER_OPTIONS[0]
);

function handlePick(cmd: string | number | object) {
  setEngine(cmd as EngineType);
}
</script>

<template>
  <!-- 在 Tauri 桌面壳内：固定 desktop 引擎，显示静态徽章，不可切换 -->
  <div v-if="isTauri" class="engine-badge" :title="t('engine.desktopHint')">
    <el-icon :size="14"><Cpu /></el-icon>
    <span class="label">{{ t('engine.desktop') }}</span>
  </div>

  <!-- 浏览器内：browser / server 二选一 -->
  <el-dropdown v-else trigger="click" placement="bottom-start" @command="handlePick">
    <button class="engine-trigger" type="button" :title="t('engine.title')">
      <el-icon :size="14"><component :is="current.icon" /></el-icon>
      <span class="label">{{ t(current.labelKey) }}</span>
      <el-icon class="caret" :size="12"><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="opt in BROWSER_OPTIONS" :key="opt.key" :command="opt.key">
          <div class="opt-row">
            <el-icon class="opt-icon" :size="14">
              <component :is="opt.icon" />
            </el-icon>
            <div class="opt-text">
              <div class="opt-label">{{ t(opt.labelKey) }}</div>
              <div class="opt-sub">{{ t(opt.subtitleKey) }}</div>
            </div>
            <el-icon v-if="opt.key === engine" class="opt-check" :size="14">
              <Check />
            </el-icon>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.engine-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s;
}
.engine-trigger:hover {
  background: var(--hover);
  border-color: var(--border-strong);
}
.engine-trigger:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.label {
  font-weight: 600;
  letter-spacing: 0.2px;
}
.caret {
  color: var(--text-dim);
}

.opt-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
}
.opt-icon {
  color: var(--accent);
}
.opt-text {
  flex: 1;
  min-width: 0;
}
.opt-label {
  font-weight: 600;
  color: var(--text);
  font-size: 13px;
  line-height: 1.2;
}
.opt-sub {
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 2px;
  line-height: 1.3;
}
.opt-check {
  color: var(--accent-2);
}

.engine-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(
    135deg,
    var(--brand-from, var(--accent)) 0%,
    var(--brand-to, var(--accent-2)) 100%
  );
  color: #fff;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: default;
  user-select: none;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}
</style>
