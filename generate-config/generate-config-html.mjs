#!/usr/bin/env node
import Config from './config.mjs'

const config = Config()
console.log(`
<html>
  <head>
    <meta charset="utf-8">
    <script>window.config=${JSON.stringify(config)}</script>
  </head>
</html>
`)
