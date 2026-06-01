/**
 * 检测当前是否运行在 Tauri 桌面壳内。
 *
 * Tauri 2 在 window 上挂 `__TAURI_INTERNALS__`（含 invoke），
 * 旧版用 `__TAURI__`。两者任一存在即判为桌面运行时。
 *
 * 这是一次性快照，无需做成响应式。
 */
const win = typeof window !== 'undefined' ? (window as any) : undefined;

export const IS_TAURI: boolean = !!(
  win && (win.__TAURI_INTERNALS__ || win.__TAURI__)
);
