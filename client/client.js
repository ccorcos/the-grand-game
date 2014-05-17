computeBattle = function(battle) {
    // console.log(battle)
    // attacking/defending, supplied/unsupplied

    // total defensive strength, total attacking strength, (TODO: modifiers), call attackSuccess

    // console.log('battle begins')
    // console.log(battle)

    data = {}

    _.extend(data, computeWin(battle))
    _.extend(data, computeCasualties(battle))

    // console.log(data)
    return data
}

AutoForm.hooks({
    battle: {
        onSubmit: function(battle) {
            try {
                data = computeBattle(battle)
                Session.set("battleOutcomeData", data)
                Router.go('battleOutcome')
            } catch (err) {
                console.log(err.stack)
            }
            // return false to prevent POST request
            return false;
        }
    }
});

// Template.battleForm.events({
//     'click div.fight': function(event, template) {

//     }
// })

computeWin = function(battle) {
    defensiveStrength = armyValue(battle.defending, 'defense')
    attackingStrength = armyValue(battle.attacking, 'attack')
    // console.log('defensive strength:', defensiveStrength)
    // console.log('attacking strength:', attackingStrength)

    success = attackSuccess(attackingStrength, defensiveStrength)
    data = {}
    data.winner = success ? "ATTACK WINS" : "DEFENSE WINS"
    if (success) {
        data.odds = attackingStrength / (defensiveStrength + attackingStrength) * 100
    } else {
        data.odds = defensiveStrength / (defensiveStrength + attackingStrength) * 100
    }
    // success ? console.log("the attack succeeded") : console.log("the defense succeeded")
    return data
}

computeCasualties = function(battle) {
    // each unit does a 50% roll to possibly kill twice (after everyone has attacked once. if this unit dies, he kill again)
    // remembers that offense and defense have different kill scores (out of 6)
    // sum up kills for each army

    // for each army
    // for each unit
    // random roll based on defense or attack value out of 6
    // sum the kills
    // 
    // then randomly select and remove units from each army based on kills
    // 
    // each army
    // each unit
    // 50% roll to attack again
    // everything again. - recursive.

    defendingArmyList = armyToList(battle.defending)
    attackingArmyList = armyToList(battle.attacking)
    // console.log("initial defensive army:", defendingArmyList)
    // console.log("initial attacking army:", attackingArmyList)

    defensiveKills = armyKills(battle.defending, 'defense')
    attackingKills = armyKills(battle.attacking, 'attack')

    defendingCasualties = _.sample(defendingArmyList, attackingKills)
    attackingCasualties = _.sample(attackingArmyList, defensiveKills)
    // console.log("defensive kills:", defensiveKills)
    // console.log("defensive casualties:", defendingCasualties)
    // console.log("attacking kills:", attackingKills)
    // console.log("attacking casualties:", attackingCasualties)

    removeOneEachFromList(defendingArmyList, defendingCasualties)
    removeOneEachFromList(attackingArmyList, attackingCasualties)

    // console.log("remaining defensive army:", defendingArmyList)
    // console.log("remaining attacking army:", attackingArmyList)

    defenseLosses = mergeSuppliedAndUnsupplied(listToArmy(defendingCasualties))
    attackLosses = mergeSuppliedAndUnsupplied(listToArmy(attackingCasualties))
    defenseLosses.cost = armyValue(listToArmy(defendingCasualties), 'cost')
    attackLosses.cost = armyValue(listToArmy(attackingCasualties), 'cost')

    return {
        casualties: {
            defending: defenseLosses,
            attacking: attackLosses
        }
    }
}