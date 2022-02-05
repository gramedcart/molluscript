const {run} = require("./index")
const { program } = require('commander')
const { readFileSync } = require("fs")

function runner(arg){
    const code = readFileSync(arg)
    run(code)
}

program
    .command('run <index>')
    .description('run')
    .action(runner)

program.parse()