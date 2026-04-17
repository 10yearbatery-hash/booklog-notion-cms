import 'server-only'

import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

export const notion = new Client({
  auth: env.NOTION_API_KEY,
})

export const DATABASE_ID = env.NOTION_DATABASE_ID
