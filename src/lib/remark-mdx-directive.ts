import { mdxjs } from 'micromark-extension-mdxjs'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { directive } from 'micromark-extension-directive'
import { directiveFromMarkdown } from 'mdast-util-directive'
import * as unified from 'unified'

export default function remarkMdxDirective(this: unified.Processor) {
  this.Parser = function (doc: string) {
    return fromMarkdown(doc, 'utf-8', {
      extensions: [mdxjs(), directive()],
      mdastExtensions: [mdxFromMarkdown(), directiveFromMarkdown()],
    })
  }
}
