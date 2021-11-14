#!/usr/bin/env node
//@ts-nocheck
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const { DB_HOST, DB_PORT } = require('./config');

yargs(hideBin(process.argv))
  .command('serve [port]', 'start the server', (yargs) => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000
      })
  }, (argv) => {
    if (argv.verbose) console.info(`start server on :${argv.port}`)
    serve(argv.port)
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv;

  DB_HOST;
  DB_PORT