// Promise有三中状态， PENDING, RESOLVE, REJECT
const PENDING = 'PENDING'
const RESOLVED =  'RESOLVED'
const REJECTED = 'REJECTED'

class MyPromise  {
	constructor(executor){
		//  实例化Promise时需要传入的构造器函数， 结束resolve, reject两个参数，用来改变promise的状态
		try {
			executor(this.resolve, this.reject)
		} catch(e) {
			this.reject(e)
		}
	}
	status = PENDING
	value = undefined
	reason = undefined
	successCallbackArr = []
	failCallbackArr = []
	// 把promise状态改成resolve, 并记录返回值，如果有没有执行的成功回调需要执行
	resolve = (value) => {
		if (this.status !== PENDING) {
			return
		}
		this.value = value
		this.status = RESOLVED
		while(this.successCallbackArr.length) {
			this.successCallbackArr.shift()(this.value)
		}
	}
	// 把promise状态改成reject，记录异常原因， 如果有没有执行的异常回调需要执行
	reject = (reason) => {
		if (this.status !== PENDING) {
			return
		}
		this.reason = reason
		this.status = REJECTED
		while(this.failCallbackArr.length) {
			this.failCallbackArr.shift()(this.reason)
		}
	}
	// 两个参数，  成功回调和失败回调
	// 1个返回值， 类型时mypromise
	// 成功，失败 回调如果返回值不是promise, 需要包装成promise, 如果是promise, 需要把promise的结果返回
	// then不能返回自身所在的promise,  否则会循环调用
	// promise构造器的代码执行异常， 结果会传给失败回调
	// 上一个then中的异常也会传给下一个then的failcallback
	// then中如果没做处理， 则结果会往下传递， 可以在下一个then中捕获， 
	then(successCallback, failCallback) {
		successCallback = successCallback ? successCallback : value => value
		failCallback = failCallback ? failCallback : reason => throw reason
		let p2 = new MyPromise((resolve,  reject) => {
			if (this.status === RESOLVED) {
				setTimeout(() => {
					try {
						let r = successCallback(this.value, resolve, reject)
						// 函数对前取不到p2, 只有在下一个事件循环中才能取到
						return resolvePromise(p2, r, resolve, reject)
					}catch(e) {
						reject(e)
					}
				}, 0)
			} else if (this.status === REJECTED) {
				setTimeout(() => {
					try {
						let r = failCallback(this.reason)
						return resolvePromise(p2, r, resolve, reject)
					}catch(e) {
						reject(e)
					}
				}, 0)
			} else {
				this.successCallbackArr.push(() => {
					try {
						let r = successCallback(this.value)
						return resolvePromise(p2, r, resolve, reject)
					}catch(e) {
						reject(e)
					}
				})
				this.failCallbackArr.push(() => {
					try {
						let r = failCallback(this.reason)
						return resolvePromise(p2, r, resolve, reject)
					}catch(e) {
						reject(e)
					}
				})
			}
		})
		return p2
	}
	finally(fn) {
		return this.then((value) => {
			return MyPromise.resolve(fn()).then(() => value)
		}, (reason) => {
			return MyPromise.resolve(fn()).then(() => throw reason)
		})
	}
	catch(fn) {
		this.then(undefined, fn)
	}
	static all(arr) {
		let result = []
		let index = 0
		function addData(key, value, resolve) {
			result[key] = value
			index++
			// 等待所有arr中的方法都执行完成，包含异步方法， 之后再resolve
			if (index === arr.length) {
				resolve(result)
			}
		}
		return new MyPromise((resolve,  reject) => {
			for (let i = 0; i < arr.length; i++) {
				let current = arr[i]
				if (current instanceof MyPromise) {
					current.then(value => addData(i, value, resolve), reject)
				} else {
					addData(i,  current, resolve)
				}
			}
		})
	}
	static race(arr) {
		return new MyPromise((resolve, reject) => {
			for (let i = 0; i < arr.length; i++) {
				let  current =  arr[i]
				if (current instanceof MyPromise) {
					current.then(resolve, reject)
				} else {
					resolve(current)
				}
			}
		})
	}
	static resolve(value) {
		if (value instanceof MyPromise) {
			return value
		}
		return new MyPromise(resolve => resolve(value))
	}
	static reject(value) {
		if (value instanceof MyPromise) {
			return value
		}
		return new MyPromise((resolve, reject) => reject(value))
	}
}
function resolvePromise(x, value, resolve, reject) {
	if (x === value) {
		reject(new TypeError('circular promise'))
	}
	if (value instanceof MyPromise) {
		return value.then(resolve, reject)
	}
	return resolve(value)
}

export default MyPromise