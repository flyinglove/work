function runPromise(callback) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			callback()
			resolve()
		}, 10)
	})
}
var a, b, c
runPromise(function() {
	a = 'hello'
}).then(() => runPromise(function() {
	b = 'lagou'
})).then(() => runPromise(function() {
	c = 'I love U'
	console.log(a,  b, c)
}))