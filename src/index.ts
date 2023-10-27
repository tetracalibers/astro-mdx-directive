import type { AstroIntegration } from 'astro'
import AutoImport from 'astro-auto-import'
import remarkMdxDirective from './lib/remark-mdx-directive'
import { initDirectives } from './directive-to-component'
import { getAutoImportList } from './auto-import'
import type { DirectiveComponentList } from './config-schema'

interface Options {
  directives: DirectiveComponentList
}

function registComponentDirective({ directives }: Options): AstroIntegration {
  const remarkDirectiveToComponent = initDirectives(directives)
  return {
    name: 'astro-mdx-directive',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkMdxDirective, remarkDirectiveToComponent],
          },
        })
      },
    },
  }
}

export default function useComponentDirective(options: Options) {
  return [
    AutoImport({ imports: [getAutoImportList(options.directives)] }),
    registComponentDirective(options),
  ]
}

export type { DirectiveComponentList }
