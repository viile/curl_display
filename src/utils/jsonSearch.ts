/**
 * 给 JSON 树视图用的搜索工具。
 *
 * 对解析后的 JSON 做递归遍历，命中规则：
 *   - 对象 key：忽略大小写包含 query
 *   - 基本值（string / number / boolean / null）：忽略大小写包含 query
 *   - 数组下标本身不参与匹配（噪音太大，比如搜 "1" 会命中 1/10/11/12...）
 *
 * 返回：
 *   - matches: 命中节点列表，每项带 path 和稳定的 pathKey
 *   - expandedPaths: 需要自动展开的祖先节点路径集合（含 match 自身），
 *     用于让 JsonTreeView 显示出每条命中
 *
 * 命中数量软上限避免 query 过宽时 walk 失控（默认 1000）。
 *
 * 所有 API 都支持 `regex: true`，此时 query 作为 JS 正则表达式编译（默认 'gi'/'i'）。
 * 非法正则会被视作"无匹配"，调用方可用 `isValidRegex` 单独探测以便 UI 提示。
 */

export type JsonPath = ReadonlyArray<string | number>;

export interface JsonSearchMatch {
  path: (string | number)[];
  /** path 的稳定字符串形式，用作 Set/Map key */
  pathKey: string;
  /** 命中位置：对象的 key 还是叶子值 */
  hit: 'key' | 'value';
}

export interface JsonSearchResult {
  matches: JsonSearchMatch[];
  /** 应被展开的容器节点 pathKey 集合（含每个 match 自身路径） */
  expandedPaths: Set<string>;
  /** query 是否被截断（命中数到达上限） */
  truncated: boolean;
}

/**
 * JSON 搜索的"匹配目标"：
 *   - 'both'：对象 key + 基本值（默认）
 *   - 'key' ：只命中对象 key
 *   - 'value'：只命中基本值
 *
 * 数组下标永远不参与匹配，与此选项无关（参见 searchJson 注释）。
 */
export type SearchTarget = 'both' | 'key' | 'value';

/** 把路径序列化成稳定 key，例如 ["a", 0, "b"] → ".a[0].b"，根路径 → "" */
export function pathToKey(path: JsonPath): string {
  let out = '';
  for (const seg of path) {
    out += typeof seg === 'number' ? `[${seg}]` : `.${seg}`;
  }
  return out;
}

const EMPTY_RESULT: JsonSearchResult = {
  matches: [],
  expandedPaths: new Set<string>(),
  truncated: false,
};

/** 判定一段字符串是否能编译为合法正则（regex 模式 UI 提示用） */
export function isValidRegex(query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  try {
    new RegExp(q);
    return true;
  } catch {
    return false;
  }
}

/**
 * 构造一个 (str) => boolean 的匹配器：
 *   - regex=true：编译 RegExp（'i' 标志），失败返回 null（=无匹配）
 *   - regex=false：忽略大小写包含
 *
 * 内部用 `.test` 时要重置 lastIndex 才能复用同一个 RegExp 做 N 次独立测试，
 * 所以只在不带 'g' 标志时使用。
 */
function buildPredicate(
  q: string,
  regex: boolean
): ((s: string) => boolean) | null {
  if (regex) {
    try {
      const re = new RegExp(q, 'i');
      return (s: string) => re.test(s);
    } catch {
      return null;
    }
  }
  const lowerQ = q.toLowerCase();
  return (s: string) => s.toLowerCase().includes(lowerQ);
}

export function searchJson(
  root: unknown,
  query: string,
  options?: { maxMatches?: number; regex?: boolean; target?: SearchTarget }
): JsonSearchResult {
  const q = query.trim();
  if (!q) return EMPTY_RESULT;
  const built = buildPredicate(q, !!options?.regex);
  if (!built) return EMPTY_RESULT;
  // 显式收窄到非空，避免内部 visit/递归闭包丢失 narrowing
  const predicate: (s: string) => boolean = built;
  const target: SearchTarget = options?.target ?? 'both';
  const matchKey = target !== 'value';
  const matchValue = target !== 'key';

  const maxMatches = options?.maxMatches ?? 1000;
  const matches: JsonSearchMatch[] = [];
  const expandedPaths = new Set<string>();
  let truncated = false;

  /** 命中后把祖先（含自身）全部加入展开集 */
  function expandAlong(path: JsonPath) {
    for (let i = 0; i <= path.length; i++) {
      expandedPaths.add(pathToKey(path.slice(0, i)));
    }
  }

  function primitiveToString(v: unknown): string {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    if (typeof v === 'string') return v;
    return String(v);
  }

  function visit(node: unknown, path: (string | number)[]): boolean {
    if (matches.length >= maxMatches) {
      truncated = true;
      return false;
    }

    if (node === null || typeof node !== 'object') {
      if (matchValue && predicate(primitiveToString(node))) {
        matches.push({ path: [...path], pathKey: pathToKey(path), hit: 'value' });
        expandAlong(path);
      }
      return true;
    }

    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        if (matches.length >= maxMatches) {
          truncated = true;
          return false;
        }
        path.push(i);
        visit(node[i], path);
        path.pop();
      }
      return true;
    }

    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (matches.length >= maxMatches) {
        truncated = true;
        return false;
      }
      if (matchKey && predicate(k)) {
        const childPath = [...path, k];
        matches.push({ path: childPath, pathKey: pathToKey(childPath), hit: 'key' });
        expandAlong(childPath);
      }
      path.push(k);
      visit(v, path);
      path.pop();
    }
    return true;
  }

  visit(root, []);
  return { matches, expandedPaths, truncated };
}

/** 文本搜索的单次命中：在原始 text 中 [start, end) 区间 */
export interface TextMatch {
  start: number;
  end: number;
}

export interface TextSearchResult {
  matches: TextMatch[];
  /** 是否被 maxMatches 截断 */
  truncated: boolean;
}

const EMPTY_TEXT_RESULT: TextSearchResult = { matches: [], truncated: false };

/**
 * 在长文本里找全部非重叠匹配位置，忽略大小写。
 *
 * 文本/原始响应模式用这个函数定位高亮，配合 `renderTextWithHighlights` 把命中区间包成 <mark>。
 * 上限避免 query 太通用（如单字符）时数组爆炸；UI 上以 "X+" 形式显示截断。
 *
 * regex=true 时把 query 编译成 /gi 正则，零宽匹配会被强行步进 1 个字符避免死循环。
 * 非法正则返回空结果（调用方应另行用 `isValidRegex` 判定，给出 UI 提示）。
 */
export function findTextMatches(
  text: string,
  query: string,
  options?: { maxMatches?: number; regex?: boolean }
): TextSearchResult {
  const q = query.trim();
  if (!q || !text) return EMPTY_TEXT_RESULT;
  const max = options?.maxMatches ?? 5000;
  const out: TextMatch[] = [];
  let truncated = false;

  if (options?.regex) {
    let re: RegExp;
    try {
      re = new RegExp(q, 'gi');
    } catch {
      return EMPTY_TEXT_RESULT;
    }
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      out.push({ start, end });
      if (out.length >= max) {
        truncated = true;
        break;
      }
      // 零宽匹配（如 ^、\b、空 lookahead）会原地踏步，必须人为推进
      if (end === start) re.lastIndex = start + 1;
    }
    return { matches: out, truncated };
  }

  const lower = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const j = lower.indexOf(lowerQ, i);
    if (j === -1) break;
    out.push({ start: j, end: j + q.length });
    if (out.length >= max) {
      truncated = true;
      break;
    }
    // 非重叠：跳过本次命中
    i = j + q.length;
  }
  return { matches: out, truncated };
}

/** HTML 转义，避免 v-html 拼接出 XSS */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

/**
 * 把文本中所有 query 命中包成 <mark class="search-hit">；当前命中额外加 `current-hit` 类，
 * 方便父组件用 querySelector 找到这个 mark 并 scrollIntoView。
 *
 * 与 `splitByQuery` 的区别：本函数直接产出 HTML 字符串（给 v-html 用），适合长文本一次性渲染；
 * 而 splitByQuery 返回段数组（给 v-for 用），适合短片段。
 */
export function renderTextWithHighlights(
  text: string,
  query: string,
  currentIndex: number,
  options?: { regex?: boolean }
): string {
  if (!text) return '';
  if (!query.trim()) return escapeHtml(text);
  const { matches } = findTextMatches(text, query, { regex: options?.regex });
  if (!matches.length) return escapeHtml(text);
  let html = '';
  let pos = 0;
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (m.start > pos) html += escapeHtml(text.slice(pos, m.start));
    const cls = i === currentIndex ? 'search-hit current-hit' : 'search-hit';
    html += `<mark class="${cls}" data-match-idx="${i}">${escapeHtml(
      text.slice(m.start, m.end)
    )}</mark>`;
    pos = m.end;
  }
  if (pos < text.length) html += escapeHtml(text.slice(pos));
  return html;
}

/**
 * 把一段文本按 query 拆成 [{ text, match }] 序列，便于 v-for 渲染高亮，
 * 而不依赖 v-html（避免 XSS 与作用域样式失效）。
 *
 * 大小写不敏感，但段内保留原文大小写。regex=true 时按 /gi 正则切分，零宽匹配会步进 1 字符。
 * 非法正则当作"无匹配"返回原文整段。
 */
export function splitByQuery(
  text: string,
  query: string,
  options?: { regex?: boolean }
): Array<{ text: string; match: boolean }> {
  const q = query.trim();
  if (!q) return [{ text, match: false }];

  if (options?.regex) {
    let re: RegExp;
    try {
      re = new RegExp(q, 'gi');
    } catch {
      return [{ text, match: false }];
    }
    const out: Array<{ text: string; match: boolean }> = [];
    let pos = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (start > pos) out.push({ text: text.slice(pos, start), match: false });
      if (end > start) {
        out.push({ text: text.slice(start, end), match: true });
        pos = end;
      } else {
        // 零宽匹配：不产生高亮段，强制步进一格
        re.lastIndex = start + 1;
      }
    }
    if (pos < text.length) out.push({ text: text.slice(pos), match: false });
    return out;
  }

  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  const out: Array<{ text: string; match: boolean }> = [];
  let i = 0;
  while (i < text.length) {
    const idx = lowerText.indexOf(lowerQ, i);
    if (idx === -1) {
      out.push({ text: text.slice(i), match: false });
      break;
    }
    if (idx > i) out.push({ text: text.slice(i, idx), match: false });
    out.push({ text: text.slice(idx, idx + q.length), match: true });
    i = idx + q.length;
  }
  return out;
}
