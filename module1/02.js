const fp = require('lodash/fp')
const cars = [
    {
        name: 'Ferrari FF', horsepower: 660, dollar_value: 700000, in_stock: true
    },
    {
        name: 'Spyker C12 Zagato', horsepower: 650, dollar_value: 648000, in_stock: false
    },
    {
        name: 'Jaguar XKR-S', horsepower: 550, dollar_value: 132000, in_stock: false
    },
    {
        name: 'Audi R8', horsepower: 525, dollar_value: 114200, in_stock: false
    },
    {
        name: 'Aston Martin One-77', horsepower: 750, dollar_value: 1850000, in_stock: true
    },
    {
        name: 'Pagani Huayra', horsepower: 700, dollar_value: 1300000, in_stock: false
    }
]

// 1
const isLastInStock = fp.flowRight(fp.prop('in_stock'), fp.last)
console.log(isLastInStock(cars))

// 2
const findFirstCarName = fp.flowRight(fp.prop('name'), fp.first)
console.log(findFirstCarName(cars))

// 3

let _average = function(xs) {
    return fp.reduce(fp.add, 0, xs) / xs.length
}
const averageDollarValueRefactor = fp.compose(_average, fp.map(car => car.dollar_value))
console.log(averageDollarValueRefactor(cars))

// 4
let _underscore = fp.replace(/\W+/g, '_')
const sanitizeNames =  fp.flowRight(fp.map(fp.flowRight(_underscore ,fp.toLower)))
console.log(sanitizeNames(['Hello World']))