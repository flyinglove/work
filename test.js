import MyPromise from './04.js'

// let promise = new MyPromise((resolve, reject) => {
// 	resolve('resolve')
// 	// reject('reject')
// 	// setTimeout(() => {
// 	// 	resolve('async resolve')
// 	// }, 3000)
// 	// setTimeout(() => {
// 	// 	reject('async reject')
// 	// },  3000)
// })

// var p1 = promise.then(value => p1)

// // p1.then(value => console.log('resolve', value), reason => console.log('reason', reason))


// // const p2 = new MyPromise((resolve, reject) => {
// // 	resolve('p2')
// // })

// p1.then(value => p1).then(value => console.log('tewst', value), err => console.log('err', err))


function p1() {
	return new MyPromise((resolve, reject) => {
		// setTimeout(() => {
		// 	resolve('async resolve')
		// }, 2000)
		setTimeout(() => {
			reject('async reject')
		},  1000)
	})
}
// MyPromise.all(['a', 'b', p1()]).then(value => console.log(value), reason => reason)

// MyPromise.resolve(19).then(value => console.log(value))


function p2() {
	return new MyPromise((resolve, reject) => {
		// setTimeout(() => {
			// resolve('p2 resolve')
		// }, 3000)
		// setTimeout(() => {
			reject('P2 reject')
			return p1()
		// },  3000)
	})
}

p2().finally(() => {
	console.log('finally')
	return p1()
}).then(value => console.log(value), reason => console.log(reason)).catch(err => console.log('err', err))

MyPromise.race([p1(), p2()]).then(value =>  console.log('race', value), err => console.log('race reject', err))