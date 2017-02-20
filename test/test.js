/* globals callback */

'use strict'

console.group('first call')
var test = callback({
	frameId: 0,
	method: 'GET',
	parentFrameId: -1,
	requestId: '1515',
	tabId: 84,
	timeStamp: 1487580258227.792,
	type: 'script',
	url: 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'
})
if (test.redirectUrl === 'data/resources/jquery/1.11.3/jquery.min.js.dec') {
	console.info('success')
} else {
	console.error('failed', test)
}
console.groupEnd()

console.group('second call')
var test2 = callback({
	frameId: 0,
	method: 'GET',
	parentFrameId: -1,
	requestId: '1515',
	tabId: 84,
	timeStamp: 1487580258227.792,
	type: 'script',
	url: 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'
})
if (test2.redirectUrl === 'data/resources/jquery/1.11.3/jquery.min.js.dec') {
	console.info('success')
} else {
	console.error('failed', test2)
}
console.groupEnd()
