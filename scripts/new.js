#!/usr/bin/env node

var workshop = process.argv.length > 2 ? process.argv[2] : 'learnyounode'
var challenge = process.argv.length > 3 ? process.argv[3] : '01'
if (challenge.length < 2) challenge = '0' + challenge
var username
if (process.argv.length > 4) {
  username = process.argv[4]
} else {
  username = require('../utils').parseJsonFile('config/local.json')
  if (username.hasOwnProperty('username')) {
    username = username['username']
  } else {
    throw new Error('username does not exits')
  }
}

var fs = require('fs')
var path = require('path')

var workPath = path.join('workshops', workshop)
var chalPath = path.join(workPath, challenge)
var file = path.join(chalPath, username + '.js')

fs.stat(file, function (err, stat) {
  if (err) {
    create()
  } else {
    console.log('File already exists. Do you want to replace, YES(Y) or NO(N)?')
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    var yes = false
    process.stdin.on('data', function (text) {
      text = text.toLowerCase().substring(0, text.length - 1)
      yes = (text === 'y' || text === 'yes')
      process.stdin.destroy()
    }).on('close', function () {
      if (yes) create()
    })
  }
})

function create () {
  fs.stat(workPath, function (err, stat) {
    if (err) {
      fs.mkdir(workPath, function (err) {
        if (err) throw err
        createPath()
      })
    } else {
      createPath()
    }
  })
}

function createPath () {
  fs.stat(chalPath, function (err, stat) {
    if (err) {
      fs.mkdir(chalPath, function (err) {
        if (err) throw err
        createFile()
      })
    } else {
      createFile()
    }
  })
}

function createFile () {
  fs.writeFile(file, '// TODO your solution\n', function (err) {
    if (err) throw err
    console.log('Created %s.js in %s/%s', username, workshop, challenge)
  })
}
