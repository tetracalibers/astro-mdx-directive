export const toPascalCase = (str: string) => {
  let result = str

  // if kebab-case
  if (str.includes('-')) {
    result = result
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  }

  // if snake_case
  if (str.includes('_')) {
    result = result
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  }

  // capitalize first letter
  return result[0].toUpperCase() + result.slice(1)
}
