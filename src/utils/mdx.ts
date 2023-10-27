import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'

export interface MakeComponentNodeArgs {
  name: string
  attributes?: Record<string, string | boolean | number | undefined | null>
  children: any[]
}

export function makeComponentNode({
  name,
  attributes = {},
  children,
}: MakeComponentNodeArgs): MdxJsxFlowElement {
  return {
    type: 'mdxJsxFlowElement',
    name,
    attributes: Object.entries(attributes)
      .filter(([_k, v]) => v !== false && Boolean(v))
      .map(([name, value]) => ({
        type: 'mdxJsxAttribute',
        name,
        value: value as MdxJsxAttribute['value'],
      })),
    children,
  }
}
