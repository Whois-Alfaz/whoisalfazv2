import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { markdownSchema } from 'sanity-plugin-markdown'

import { schema } from './sanity/schema'
import { projectId, dataset } from './sanity/env'

export default defineConfig({
  basePath: '/studio',
  projectId: projectId || '',
  dataset,
  title: 'Automation Hub CMS',
  schema,
  plugins: [
    structureTool(),
    markdownSchema(),
  ],
})
