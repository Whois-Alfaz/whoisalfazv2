import { type SchemaTypeDefinition } from 'sanity'

import post from './schemas/post'
import category from './schemas/category'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, category],
}
