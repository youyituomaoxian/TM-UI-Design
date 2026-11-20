/*
 * utils.ts — shadcn 惯例的 cn() 工具（vendored 极简版）
 * 离线约束：不引入 clsx / tailwind-merge 外部依赖，实现同签名的类名合并。
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const i of inputs) {
    if (!i && i !== 0) continue;
    if (typeof i === 'string' || typeof i === 'number') out.push(String(i));
    else if (Array.isArray(i)) {
      const inner = cn(...i);
      if (inner) out.push(inner);
    } else if (typeof i === 'object') {
      for (const [k, v] of Object.entries(i)) if (v) out.push(k);
    }
  }
  return out.join(' ');
}
