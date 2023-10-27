import type { Directives } from 'mdast-util-directive'
import type { Parent, Literal } from 'mdast'
import type { Node } from 'unist'
import { hasOwn } from './typesafe.js'

export const isDirectiveNode = (node: Node): node is Directives => {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  )
}

export const isParentNode = (node: Node): node is Parent => {
  return 'children' in node
}

export const isLiteralNode = (node: Node): node is Literal => {
  return 'value' in node
}

export const isDirectiveLabelNode = (node: Node): boolean => {
  if (!node.data) {
    return false
  }
  if (hasOwn(node.data, 'directiveLabel')) {
    const { directiveLabel } = node.data

    if (typeof directiveLabel !== 'boolean') {
      return false
    }

    return directiveLabel
  }
  return false
}
