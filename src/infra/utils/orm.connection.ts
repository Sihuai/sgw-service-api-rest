import { context } from '@arangodb/locals'
import { createRoutes } from 'type-arango'
import createRouter from '@arangodb/foxx/router'

// Import entities and collections before creating routes
import * as _Collections from '../../domain/models';

context.use(
  createRoutes(
      createRouter()
  )
);