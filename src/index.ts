#!/usr/bin/env node

import { createApplicationServer } from './server';

createApplicationServer().then((server) => {
  if (server == null) return;
  
  server.listen();
});