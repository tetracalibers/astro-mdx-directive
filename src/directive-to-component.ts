import { h } from 'hastscript'
import { visit } from 'unist-util-visit'
import { makeComponentNode } from './utils/mdx.js'
import type {
  DirectiveComponent,
  DirectiveComponentList,
  DirectiveLabelPropsConf,
} from './config-schema.js'
import type { Directives } from 'mdast-util-directive'
import { remove } from 'unist-util-remove'
import type { Root } from 'mdast'
import {
  isParentNode,
  isDirectiveLabelNode,
  isLiteralNode,
  isDirectiveNode,
} from './utils/is-node.js'
import { trimWord } from './utils/typesafe.js'

const toPropsDirectiveLabel = (
  directiveLabelProps: DirectiveLabelPropsConf,
  node: Directives
): Record<string, string> => {
  let value: string | undefined = undefined

  remove(node, (child) => {
    if (!isParentNode(child)) {
      return false
    }

    const { children } = child

    if (children.length > 1) {
      if (isDirectiveLabelNode(children[0]) && isLiteralNode(children[0])) {
        value = children[0].value
        return true
      }
    }

    if (children.length === 1) {
      if (isLiteralNode(children[0])) {
        value = children[0].value
        return true
      }
    }

    return false
  })

  if (!value) {
    return {}
  }

  if (typeof directiveLabelProps === 'string') {
    return {
      [directiveLabelProps]: value,
    }
  }

  if (typeof directiveLabelProps === 'function') {
    return directiveLabelProps(value)
  }

  return {}
}

const parseUseAsProps = (
  component: DirectiveComponent,
  node: Directives
): Record<string, string> => {
  let props = {}

  if (!component.useAsProps) {
    return props
  }

  const { useAsProps } = component

  if (useAsProps.directiveLabel) {
    props = {
      ...props,
      ...toPropsDirectiveLabel(useAsProps.directiveLabel, node),
    }
  }

  if (hasOwn(useAsProps, 'tagName')) {
    const { tagName } = useAsProps

    if (typeof tagName === 'string') {
      props = {
        ...props,
        [tagName]: node.name,
      }
    }
  }

  return props
}

export interface InitConfig {
  directives: DirectiveComponentList
  importedNameMap: Record<string, string>
}

export const initDirectives = ({ directives, importedNameMap }: InitConfig) => {
  return function remarkDirectiveToComponent() {
    return function (tree: Root) {
      visit(tree, function (_node, index, parent) {
        if (!parent) return
        if (index === null) return
        if (!isDirectiveNode(_node)) return

        const node: Directives = _node

        const directiveType = trimWord(node.type, 'Directive')

        const thisDirectiveComponents = directives[directiveType]
        if (!thisDirectiveComponents) return

        const component = thisDirectiveComponents.find(({ name }) =>
          [name].flat().includes(node.name)
        )

        if (component) {
          // MDXコンポーネントとして処理

          const props = parseUseAsProps(component, node)

          // @ts-ignore
          parent.children[index] = makeComponentNode({
            ...node,
            name: importedNameMap[node.name],
            attributes: { ...node.attributes, ...props },
          })
        } else {
          // HTML要素として処理

          const hast = h(node.name, node.attributes || {})

          node.data = {
            ...node.data,
            hName: hast.tagName,
            hProperties: hast.properties,
          }
        }
      })
    }
  }
}
