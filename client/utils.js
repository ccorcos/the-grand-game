armyValue = function(army, param) { // param = 'defense' or 'cost' or 'attack'
    accumulator = 0
    suppliedAndUnsupplied = _.keys(army) // ['supplied', 'unsupplied']
    suppliedAndUnsupplied.forEach(function(suppliedOrUnsupplied) {
        unitNames = _.keys(army[suppliedOrUnsupplied]) // ['infantry', 'armor', ...]
        unitNames.forEach(function(unitName) {
            numberOfUnits = army[suppliedOrUnsupplied][unitName]
            unitStrength = unitStrengths[suppliedOrUnsupplied][unitName][param]
            accumulator += numberOfUnits * unitStrength
        })
    })
    return accumulator
}

armyKills = function(army, param) { // param = 'defense' or 'cost' or 'attack'
    kills = 0
    suppliedAndUnsupplied = _.keys(army) // ['supplied', 'unsupplied']
    suppliedAndUnsupplied.forEach(function(suppliedOrUnsupplied) {
        unitNames = _.keys(army[suppliedOrUnsupplied]) // ['infantry', 'armor', ...]
        unitNames.forEach(function(unitName) {

            killStrength = unitStrengths[suppliedOrUnsupplied][unitName][param]
            killProb = killStrength / 6

            numberOfUnits = army[suppliedOrUnsupplied][unitName]

            for (var i = 0; i < numberOfUnits; i++) {
                binarySample(killProb) ? kills += 1 : null
            }
        })
    })
    return kills
}

binarySample = function(frac) {
    randomSample = Math.random()
    return randomSample < frac
}

attackSuccess = function(attack, defense) {
    sum = attack + defense
    frac = attack / sum
    return binarySample(frac) // attack wins if true
}


armyToList = function(army) {
    armyList = []
    suppliedAndUnsupplied = _.keys(army) // ['supplied', 'unsupplied']
    suppliedAndUnsupplied.forEach(function(suppliedOrUnsupplied) {
        unitNames = _.keys(army[suppliedOrUnsupplied]) // ['infantry', 'armor', ...]
        unitNames.forEach(function(unitName) {
            numberOfUnits = army[suppliedOrUnsupplied][unitName]
            for (var i = 0; i < numberOfUnits; i++) {
                armyList.push([suppliedOrUnsupplied, unitName].join(' '))
            }
        })
    })
    return armyList
}

emptyArmy = function() {
    army = {
        supplied: {},
        unsupplied: {}
    }
    s = ['supplied', 'unsupplied']
    s.forEach(function(supply, index, array) {
        unitTypes.forEach(function(unitType, index, array) {
            army[supply][unitType] = 0
        })
    })
    return army
}

listToArmy = function(list) {
    army = emptyArmy()
    list.forEach(function(unit, index, array) {
        keys = unit.split(' ')
        army[keys[0]][keys[1]] += 1
    })
    return army
}

removeOneFromList = function(list, value) {
    list.splice(_.indexOf(list, value), 1)
}

removeOneEachFromList = function(list, values) {
    values.forEach(function(value, index, array) {
        list.splice(_.indexOf(list, value), 1)
    })
}

mergeSuppliedAndUnsupplied = function(army) {
    merged = {}

    unitTypes.forEach(function(unitType, index, array) {
        merged[unitType] = army.supplied[unitType] + army.unsupplied[unitType]
    })

    return merged
}

UI.registerHelper('sessionVar', function(string) {
    return Session.get(string)
})


UI.registerHelper('keyValue', function(context, options) {
    var result = [];
    _.each(context, function(value, key, list) {
        result.push({
            key: key,
            value: value
        });
    })
    return result;
});