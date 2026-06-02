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

export function searchJson(
  root: unknown,
  query: string,
  options?: { maxMatches?: number }
): JsonSearchResult {
  const q = query.trim().toLowerCase();
  if (!q) return EMPTY_RESULT;

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
      if (primitiveToString(node).toLowerCase().includes(q)) {
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
      if (k.toLowerCase().includes(q)) {
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

/**
 * 把一段文本按 query 拆成 [{ text, match }] 序列，便于 v-for 渲染高亮，
 * 而不依赖 v-html（避免 XSS 与作用域样式失效）。
 *
 * 大小写不敏感，但段内保留原文大小写。
 */
export function splitByQuery(
  text: string,
  query: string
): Array<{ text: string; match: boolean }> {
  const q = query.trim();
  if (!q) return [{ text, match: false }];
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
