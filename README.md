# astro-mdx-directive

Astro Integration for MDX-enhanced directive notation

## features

- Astro components can be described as directives in MDX files
- Components registered as directives are automatically imported
- Attributes can be easily specified in HTML tags using directive notation

## install

```
npm install astro-mdx-directive
```

or

```
yarn add astro-mdx-directive
```

...etc.

## setting

```js
/** @type {import('astro-mdx-directive').DirectiveComponentList} */
const directives = {
  // :::Name[label]{props}\n children \n:::
  container: [
    {
      name: "BlockWithChildren",
      path: "src/components/block-with-children.astro"
    }
  ],
  // ::Name[label]{props}
  leaf: [
    {
      name: 'Block',
      path: 'src/components/block.astro'
    }
  ],
  // :Name[label]{props}
  text: [
    {
      name: 'Inline',
      path: "src/components/inline.astro"
    }
  ]
};

import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import mdxDirective from "astro-mdx-directive"

// https://astro.build/config
export default defineConfig({
  /** @type {import('astro').AstroUserConfig} */
  integrations: [
    mdxDirective({ directives }),
    mdx()
  ]
})
```

### WARNING

#### Must be specified before `@astrojs/mdx` integration

DON'T:
```js
export default defineConfig({
  integrations: [
    mdx(),
    mdxDirective({ directives })
  ]
})
```

OK:
```js
export default defineConfig({
  integrations: [
    mdxDirective({ directives }),
    mdx()
  ]
})
```

#### `remarkPlugins` must be specified in the `markdown` option

DON'T:
```js
export default defineConfig({
  integrations: [
    mdxDirective({ directives }),
    mdx({
      remarkPlugins: [remarkToc],
      optimize: true
    })
  ]
})
```

OK:
```js
export default defineConfig({
  integrations: [
    mdxDirective({ directives }),
    mdx({
      optimize: true
    })
  ],
  markdown: {
    remarkPlugins: [remarkToc]
  }
})
```

#### Do not specify `extendMarkdownConfig: false`

DON'T:
```js
export default defineConfig({
  integrations: [
    mdxDirective({ directives }),
    mdx({
      extendMarkdownConfig: false
    })
  ]
})
```

## recipes

### Pass props in braces

- The props enclosed in curly brackets(`{}`) are automatically passed to the component.

usage in MDX:
```mdx
:::MediumSection{icon="circle" iconSize="L"}

### hogehoge

- list item 1
- list item 2
- list item 3

:::
```

config:
```js
/** @type {import('astro-mdx-directive').DirectiveComponentList} */
const directives = {
  container: [
    {
      name: "MediumSection",
      path: "src/components/section/MediumSection.astro",
    }
  ]
};
```

src/components/section/MediumSection.astro:
```js
const { icon, iconSize = "M" } = Astro.props;
```

### Pass label as props

- If you want to pass text enclosed in square brackets(`[]`) as props to the component, specify the props name in the `useAsProps.directiveLabel` option.

usage in MDX:
```mdx
::WithIcon[Astro]{icon="astro"}
```

config:
```js
/** @type {import('astro-mdx-directive').DirectiveComponentList} */
const directives = {
  leaf: [
    {
      name: 'WithIcon',
      path: 'src/components/WithIcon.astro',
      useAsProps: {
        directiveLabel: 'title'
      }
    }
  ]
};
```

src/components/WithIcon.astro:
```js
const { icon, title } = Astro.props;
```

### Convert label and pass as props

- If you want to process the text enclosed in square brackets(`[]`) and pass it to the component as props, you can specify a function for the `useAsProps.directiveLabel` option.

using in MDX:
```mdx
::word[apple|りんご]
```

config:
```js
/** @type {import('astro-mdx-directive').DirectiveComponentList} */
const directives = {
  leaf: [
    {
      name: 'Word',
      path: 'src/components/english/Word.astro',
      useAsProps: {
        directiveLabel: (text) => {
          const [en, ja] = text.split("|")
          return { en, ja }
        }
      }
    }
  ]
};
```

src/components/english/Word.astro:
```js
const { en, ja } = Astro.props;
```

### Provide multiple patterns of directives in a single component

- Multiple types of directives can be defined for a single component by making the `name` option an array.
- To tell the component which directives are being used as props, specify the props name in the `useAsProps.tagName` option.

usage in MDX:
```mdx
:S[I] :V[have] :O[a pen].
```

config:
```js
/** @type {import('astro-mdx-directive').DirectiveComponentList} */
const directives = {
  text: [
    {
      name: ["S", "V", "O", "C"],
      path: "src/components/english/WordType.astro",
      useAsProps: {
        tagName: 'type'
      }
    }
  ]
};
```

src/components/english/WordType.astro:
```ts
interface Props {
  type: "S" | "V" | "O" | "C"
}

const { type } = Astro.props
```

### Use HTML tags as directives

- No configuration in `astro.config.mjs` is required.

```mdx
:::main{#readme}

Lorem:br
ipsum.

::hr{.red}

A :i[lovely] language know as :abbr[HTML]{title="HyperText Markup Language"}.

:::
```

This is the same as writing:

```html
<main id="readme">
  <p>Lorem<br>ipsum.</p>
  <hr class="red">
  <p>A <i>lovely</i> language know as <abbr title="HyperText Markup Language">HTML</abbr>.</p>
</main>
```

## more information

- [micromark-extension-directive#syntax](https://github.com/micromark/micromark-extension-directive#syntax)
