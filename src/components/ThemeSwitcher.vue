<script setup lang="ts">
import { computed, h, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { Sunny, Moon, Monitor, ArrowDown, Check } from '@element-plus/icons-vue';
import { useTheme, type ThemeMode } from '../composables/useTheme';

const { t } = useI18n();
const { mode, effective, setMode } = useTheme();

interface ThemeOption {
  key: ThemeMode;
  labelKey: string;
  icon: Component;
}

const OPTIONS: ThemeOption[] = [
  { key: 'light', labelKey: 'theme.light', icon: Sunny },
  { key: 'dark', labelKey: 'theme.dark', icon: Moon },
  { key: 'auto', labelKey: 'theme.auto', icon: Monitor },
];

const current = computed(() => OPTIONS.find((o) => o.key === mode.value) ?? OPTIONS[0]);

/** Trigger 上展示当前模式图标；auto 模式下显示电脑图标，旁边附小 light/dark 表示当前生效 */
const triggerIcon = computed<Component>(() => current.value.icon);

function handleSelect(cmd: string | number | object) {
  setMode(cmd as ThemeMode);
}

// Element Plus dropdown 接受 Component 作为 icon 插槽，这里用渲染函数避开模板限制
const RenderIcon = (icon: Component) => h(icon);
</script>

<template>
  <el-dropdown trigger="click" placement="bottom-end" @command="handleSelect">
    <button class="theme-trigger" type="button" :title="t('theme.title')">
      <el-icon :size="14">
        <component :is="triggerIcon" />
      </el-icon>
      <span v-if="mode === 'auto'" class="badge">
        {{ effective === 'dark' ? '·D' : '·L' }}
      </span>
      <el-icon class="caret" :size="12"><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="opt in OPTIONS"
          :key="opt.key"
          :command="opt.key"
        >
          <el-icon class="opt-icon" :size="14">
            <component :is="opt.icon" />
          </el-icon>
          <span class="opt-label">{{ t(opt.labelKey) }}</span>
          <el-icon v-if="opt.key === mode" class="opt-check" :size="14"><Check /></el-icon>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.theme-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--panel-2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 5px 9px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.15s, border-color 0.15s;
}
.theme-trigger:hover {
  background: var(--hover);
  border-color: var(--border-strong);
}
.theme-trigger:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.badge {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-dim);
  font-weight: 700;
  letter-spacing: 0.4px;
}
.caret {
  color: var(--text-dim);
}

.opt-icon {
  margin-right: 8px;
}
.opt-label {
  margin-right: 8px;
  min-width: 60px;
}
.opt-check {
  margin-left: auto;
  color: var(--accent-2);
}
</style>
