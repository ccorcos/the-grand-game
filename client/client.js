attackSuccess = function(attack, defense) {
    sum = attack + defense
    frac = attack / sum
    randomSample = Math.random()
    return randomSample < frac // attack wins if true
}

computeBattle = function(battle) {
    // console.log(battle)
    // attacking/defending, supplied/unsupplied

    // total defensive strength, total attacking strength, (TODO: modifiers), call attackSuccess

    defensiveStrength = armyValue(battle.defending, 'defense')
    attackingStrength = armyValue(battle.attacking, 'attack')

    success = attackSuccess(attackingStrength, defensiveStrength)

    console.log(success)

    // return false to prevent POST request
    return false
}


AutoForm.hooks({
    battle: {
        onSubmit: computeBattle
    }
});


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