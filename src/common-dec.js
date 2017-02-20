/* globals validate, resources */

'use strict'

chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeWebRequest.onMessage.addListener(function(details) {
		console.log(details)
	})

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

	var filters = flattenObject(resources),
		url = chrome.runtime.getURL('data/resources/'),
		keys = Object.keys(filters),
		rules = new Array(keys.length),
		regex1 = /vrsn/g

	for (var i = 0; i < keys.length; i++) {
		var rule = {
			id: 'local' + i,
			conditions: new Array(1),
			actions: []
		}

		var source = keys[i],
			dest = filters[keys[i]]

		if (source.indexOf('vrsn') !== -1) {
			var sourceSplit = source.split('vrsn')[0]

			rule.conditions[0] = new chrome.declarativeWebRequest.RequestMatcher({
				url: { urlContains: sourceSplit },
				resourceType: ['script', 'xmlhttprequest'],
				stages: ['onBeforeRequest']
			})

			rule.actions[0] = new chrome.declarativeWebRequest.RedirectByRegEx({
				from: '[^\d]*((([0-9]){1,2}.){1,3}[0-9]{1,2})[^\d]*',
				to: url + dest.replace(regex1, '\$2\$3\$1')
			})
			/*rule.actions[1] = new chrome.declarativeWebRequest.SendMessageToExtension({
				message: 'https://' + source.replace(regex1, '1.11.3') + 'min.js' +
					url + dest.replace(regex1, '\$1')
			})*/
		} else {
			rule.conditions[0] = new chrome.declarativeWebRequest.RequestMatcher({
				url: { urlContains: source },
				resourceType: ['script', 'xmlhttprequest'],
				stages: ['onBeforeRequest']
			})

			rule.actions[0] = new chrome.declarativeWebRequest.RedirectRequest({
				redirectUrl: url + dest
			})
			/*rule.actions[1] = new chrome.declarativeWebRequest.SendMessageToExtension({
				message: source
			})*/
		}

		rules[i] = rule
	}

	chrome.declarativeWebRequest.onRequest.getRules(null, function(oldRules) {
		var str = new Array(oldRules.length)
		for (var x = 0; x < oldRules.length; x++) {
			str[x] = oldRules[x].id
		}
		chrome.declarativeWebRequest.onRequest.removeRules(str)
		chrome.declarativeWebRequest.onRequest.addRules(rules)
	})
})
