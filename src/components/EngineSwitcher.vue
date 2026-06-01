<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Connection, Monitor, ArrowDown, Check } from '@element-plus/icons-vue';
import { useEngine } from '../composables/useEngine';
import type { EngineType } from '../api/execute';

const { t } = useI18n();
const { engine, setEngine } = useEngine();

interface Option {
  key: EngineType;
  labelKey: string;
  subtitleKey: string;
  icon: typeof Monitor;
}

const OPTIONS: Option[] = [
  { key: 'browser', labelKey: 'engine.browser', subtitleKey: 'engine.browserHint', icon: Monitor },
  { key: 'server', labelKey: 'engine.server', subtitleKey: 'engine.serverHint', icon: Connection },
];

const current = computed(() => OPTIONS.find((o) => o.key === engine.value) ?? OPTIONS[0]);

function handlePick(cmd: string | number | object) {
  setEngine(cmd as EngineType);
}
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-start" @command="handlePick">
    <button class="engine-trigger" type="button" :title="t('engine.title')">
      <el-icon :size="14"><component :is="current.icon" /></el-icon>
      <span class="label">{{ t(current.labelKey) }}</span>
      <el-icon class="caret" :size="12"><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="opt in OPTIONS" :key="opt.key" :command="opt.key">
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
</style>
