import type { AstroIntegration } from 'astro'
import AutoImport from 'astro-auto-import'
import remarkMdxDirective from './lib/remark-mdx-directive.js'
import { InitConfig, initDirectives } from './directive-to-component.js'
import { getAutoImportList, getAutoImportedNameMap } from './auto-import.js'
import {
  getComponentsFromConfig,
  type DirectiveComponentList,
} from './config-schema.js'

interface Options {
  directives: DirectiveComponentList
}

function registComponentDirective(initConfig: InitConfig): AstroIntegration {
  const remarkDirectiveToComponent = initDirectives(initConfig)
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
  const { directives } = options
  const components = getComponentsFromConfig(directives)
  const importedNameMap = getAutoImportedNameMap(components)
  return [
    AutoImport({ imports: [getAutoImportList(components)] }),
    registComponentDirective({ directives, importedNameMap }),
  ]
}

export type { DirectiveComponentList }
