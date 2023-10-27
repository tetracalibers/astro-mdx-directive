// clone from https://github.com/type-challenges/type-challenges/issues/3721
type Split<S extends string, SEP extends string> = string extends S
  ? string[]
  : S extends `${infer A}${SEP}${infer B}`
  ? [A, ...(B extends '' ? [] : Split<B, SEP>)]
  : SEP extends ''
  ? []
  : [S]

export const removeStart = <SOURCE extends string, TARGET extends string>(
  source: SOURCE,
  target: TARGET
): Split<SOURCE, TARGET>[0] => {
  if (source.startsWith(target)) {
    return source.slice(target.length)
  }
  return source
}

export const hasOwn = <OBJECT extends object, PROPERTY_NAME extends string>(
  obj: OBJECT,
  property: PROPERTY_NAME
): obj is OBJECT & { [P in PROPERTY_NAME]: unknown } => {
  return Object.hasOwn(obj, property)
}
