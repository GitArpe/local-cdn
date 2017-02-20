/* globals validate, resources */

'use strict'

var filters = Object.keys(resources)
	.map(host => Object.keys(resources[host])
		.map(path => host + path))
	.reduce((a, b) => a.concat(b))
	.map(url => '*://' + url + '*')

function flattenObject(ob) {
	var toReturn = Object.create(null)

	for (var i in ob) {
		if (typeof ob[i] === 'object') {
			var flatObject = flattenObject(ob[i])
			for (var x in flatObject) {
				toReturn[i + x] = flatObject[x]
			}
		} else {
			toReturn[i] = ob[i]
		}
	}

	return toReturn
}

var regex1 = /[-[\]{}()*+?.,\\^$|#\s\/]/g,
	regex2 = /vrsn/g,
	regex3 = /(?:\d{1,2}\.){1,3}\d{1,2}/

var listsMap = new Map(),
	matchesMap = new Map(),
	url = chrome.runtime.getURL('data/resources/')

function callback(data) {
	var hostname = new URL(data.url)
		.hostname,
		obj = null,
		list = null,
		matches = null

	if (listsMap.has(hostname)) {
		list = listsMap.get(hostname)
		matches = matchesMap.get(hostname)
	} else {
		obj = resources[hostname]
		if (!obj) return data

		list = flattenObject(obj)
		matches = Object.keys(list)
			.filter((str) => {
				str = str.replace(regex1, '\\$&')
				str = str.replace(regex2, '(?:\\d{1,2}\\.){1,3}\\d{1,2}')
				return (new RegExp(str))
					.test(data.url)
			})
		listsMap.set(hostname, list)
		matchesMap.set(hostname, matches)
	}

	if (matches.length) {
		var version = regex3.exec(data.url)[0]
		var path = list[matches[0]].replace(regex2, version)

		if (validate(path)) {
			return {
				redirectUrl: url + path
			}
		}
	}

	return data
}

chrome.webRequest.onBeforeRequest.addListener(callback, {
	urls: filters,
	types: ['script', 'xmlhttprequest']
}, ['blocking'])
