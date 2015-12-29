'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const proc = require('child_process')
const fs = require('fs')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
const terminfo = () => proc.spawn('infocmp', ['-1L'])

const extractTerm = str => str.split('\n')[1].split('|')[0]

const assignSplit = (ob, split) => ob[split[0]] = split[1]

const assign = ob => str => {
  switch (true) {
    case str.includes('#'): return assignSplit(ob, str.split('#'))
    case str.includes('='): return assignSplit(ob, str.split('='))
    default: ob[str] = true
  }
}

const arify = buf => buf
  .toString()
  .split(',\n')

function parse(buf) {
  const ar = arify(buf)
  const ob = Object.assign({}, {term: extractTerm(ar[0])})
  ar.slice(1, -1)
    .map(str => str.trim())
    .map(str => str.replace('\\E', '\u001b'))
    .map(assign(ob))
  return ob
}

terminfo().stdout.on('data', data => console.log(parse(data)))

//----------------------------------------------------------
// exports
//----------------------------------------------------------
// module.exports =
