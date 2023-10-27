import { DirectiveComponentList } from './config-schema'

export const getAutoImportedName = (name: string | string[]) => {
  const prefix = 'AutoImported__'
  return Array.isArray(name) ? prefix + name.join('_') : prefix + name
}

export const getAutoImportList = (components: DirectiveComponentList) => {
  return Object.values(components)
    .flat()
    .reduce((acc, component) => {
      return {
        ...acc,
        [`./${component.path}`]: [
          ['default', getAutoImportedName(component.name)],
        ],
      }
    }, {})
}
