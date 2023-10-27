import path from 'node:path'
import { DirectiveComponent } from './config-schema.js'
import { toPascalCase } from './utils/string.js'

const getAutoImportedName = (pathname: string) => {
  const name = path.basename(pathname, '.astro')
  return `AutoImported_${toPascalCase(name)}`
}

export const getAutoImportedNameMap = (
  components: DirectiveComponent[]
): Record<string, string> => {
  return components.reduce((acc, component) => {
    const importedName = getAutoImportedName(component.path)

    const curr = [component.name].flat().reduce((acc, name) => {
      return {
        ...acc,
        [name]: importedName,
      }
    }, {})

    return { ...acc, ...curr }
  }, {})
}

export const getAutoImportList = (components: DirectiveComponent[]) => {
  return components.reduce((acc, component) => {
    return {
      ...acc,
      [`./${component.path}`]: [
        ['default', getAutoImportedName(component.path)],
      ],
    }
  }, {})
}
