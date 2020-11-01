const fp = require('lodash/fp')
const { Maybe, Container } = require('./support')

let maybe = Maybe.of([5, 6, 1])
// 1
let ex1 = () => {
	return maybe.map(fp.flowRight(fp.map(item  => item  + 1)))
}
console.log(ex1())

// 2
let xs = Container.of(['do', 'ray',  'me', 'fa', 'so', 'la', 'ti', 'do'])
let ex2 = () => {
	return xs.map(fp.flowRight(fp.first))._value
}
console.log(ex2())

// 3
let safeProp = fp.curry(function(x, o) {
	return Maybe.of(o[x])
})
let user = {id: 2, name: 'Albert'}
let ex3 = () => {
	return fp.first(Container.of(user).map(item => item.name)._value)
}
console.log(ex3())

// 4
let ex4 = (value) =>  {
	return Maybe.of(value).map(parseInt)._value
}
console.log('ex4',  ex4('5'))
console.log('ex4',  ex4(null))