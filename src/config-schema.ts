export type DirectiveLabelPropsConf =
  | string
  | (<PROPS_VALUE>(text: string) => Record<string, PROPS_VALUE>)

type UseAsProps = {
  directiveLabel?: DirectiveLabelPropsConf
}

type DirectiveComponentSingle = {
  name: string
  path: string
  useAsProps?: UseAsProps
}

type DirectiveComponentMultiple = {
  name: string[]
  path: string
  useAsProps: UseAsProps & {
    tagName: string
  }
}

export type DirectiveComponent =
  | DirectiveComponentSingle
  | DirectiveComponentMultiple

export type DirectiveComponentList = {
  container?: DirectiveComponent[]
  leaf?: DirectiveComponent[]
  text?: DirectiveComponent[]
}

export const getComponentsFromConfig = (config: DirectiveComponentList) => {
  return Object.values(config).flat()
}
