#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var parallel = require('run-parallel')

var archive

var workshops = 'workshops'
fs.readdir(workshops, function (err, dirs) {
	if (err) throw err

	var tasks = []
	for (var i in dirs) tasks.push(getReadChallengesTask(dirs[i]))

	parallel(tasks, function (terr, result) {
		if (terr) throw terr

		writeArchive()
	})
})

function getReadChallengesTask (workshop) {
	return function (callback) {
		fs.readdir(path.join(workshops, workshop), function (err, dirs) {
			if (err) throw err

			var tasks = []
			for (var i in dirs)	tasks.push(getReadSolutionsTask(workshop, dirs[i]))

			parallel(tasks, function (terr, result) {
				if (terr) throw terr

				callback(null, result)
			})
		})
	}
}

function getReadSolutionsTask (workshop, challenge) {
	return function (callback) {
		fs.readdir(path.join(workshops, workshop, challenge), function (err, files) {
			if (err) throw err

			for (var i in files) {
				var file = files[i]				
				addArchive(workshop, challenge, file.substring(0, file.length - 3))
			}

			callback(null, files)
		})
	}
}

function addArchive (workshop, challenge, solution) {
	archive = archive || {}
	var works = archive.hasOwnProperty('workshops') ? archive['workshops'] : {}
	var users = archive.hasOwnProperty('users') ? archive['users'] : []

	var work = works.hasOwnProperty(workshop) ? works[workshop] : {}
	var chall = work[challenge] ? work[challenge] : []

	chall.push(solution)
	if (users.indexOf(solution) === -1) users.push(solution)
	work[challenge] = chall
	works[workshop] = work

	archive['workshops'] = works
	archive['users'] = users
}

function writeArchive () {
	archive = JSON.stringify(archive, null, 2) + '\n'
	fs.writeFile(path.join('disk', 'archive.json'), archive, function (err) {
	    if (err) throw err
	    console.log('build answers sucessfully')
	 })
}
