# astro-mdx-directive

Astro Integration for MDX-enhanced directive notation

- Astro components can be described as directives in MDX files
- Attributes can be easily specified in HTML tags using directive notation

ref: [syntax of directives](https://github.com/micromark/micromark-extension-directive#syntax)

## example

### astro.config.mjs

```js
/** @type {import('astro-mdx-directive').DirectiveComponentList} */
const directives = {
  // :::Name[label]{props}\n children \n:::
  container: [
    {
      name: "NavSection",
      path: "src/components/section/NavSection.astro",
    },
    {
      name: "Callout",
      path: "src/components/english/Callout.astro",
      useAsProps: {
        directiveLabel: 'ja'
      }
    }
  ],
  // ::Name[label]{props}
  leaf: [
    {
      name: "InlineSection",
      path: "src/components/section/InlineSection.astro",
    },
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
  ],
  // :Name[label]{props}
  text: [
    {
      name: ["S", "V", "O", "C", "C1", "C2", "F"],
      path: "src/components/english/WordType.astro",
      useAsProps: {
        tagName: 'type'
      }
    }
  ],
};

import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import mdxDirective from "astro-mdx-directive"

// https://astro.build/config
export default defineConfig({
  /** @type {import('astro').AstroUserConfig} */
  markdown: {
    remarkPlugins: [remarkBreaks]
  },
  integrations: [
    mdxDirective({ directives }),
    mdx()
  ]
})
```