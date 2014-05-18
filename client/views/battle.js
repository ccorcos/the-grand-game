// FIX: mod checkboxes

unitTypes = ['infantry', 'armor', 'lightFleet', 'heavyFleet', 'aircraft']
attackingModifiers = []
defendingModifiers = ['river', 'city', 'mountains']


Template.battle.unitType = function() {
    return unitTypes
}

Template.battle.attackingModifiers = function() {
    return attackingModifiers
}

Template.battle.defendingModifiers = function() {
    return defendingModifiers
}

Template.battle.events({
    'click #fight': function(event, template) {

        narrative = []
        console.log("fight begins")
        console.log("get form values")
        attack = {}
        attack.supplied = {}
        attack.unsupplied = {}
        defenseList = []
        attackList = []
        defense = {}
        defense.supplied = {}
        defense.unsupplied = {}
        unitTypes.forEach(function(value, index, array) {
            attack.supplied[value] = parseInt($('.attacking.supplied.' + value)[0].value)
            attackList.push(value)
        })
        unitTypes.forEach(function(value, index, array) {
            attack.unsupplied[value] = parseInt($('.attacking.unsupplied.' + value)[0].value)
            attackList.push(value)
        })
        unitTypes.forEach(function(value, index, array) {
            defense.supplied[value] = parseInt($('.defending.supplied.' + value)[0].value)
            defenseList.push(value)
        })
        unitTypes.forEach(function(value, index, array) {
            defense.unsupplied[value] = parseInt($('.defending.unsupplied.' + value)[0].value)
            defenseList.push(value)
        })
        console.log("attacking army:", attack)
        console.log("defending army:", defense)

        console.log("determine air superiority")

        airKillOdds = 1 / 3

        attackAirKills = 0
        defenseAirKills = 0

        attackMods = {}
        defenseMods = {}

        if (attack.supplied.aircraft != 0 && defense.supplied.aircraft != 0) {
            console.log("both armies have aircraft")
            console.log("attack have", attack.supplied.aircraft, "aircraft")
            console.log("defense have", defense.supplied.aircraft, "aircraft")

            narrative.push('Air battle - attack ' + attack.supplied.aircraft + ' vs defense ' + defense.supplied.aircraft)


            for (var i = 0; i < attack.supplied.aircraft; i++) {
                attackAirKills += binarySample(airKillOdds) ? 1 : 0
            }
            for (var i = 0; i < defense.supplied.aircraft; i++) {
                defenseAirKills += binarySample(airKillOdds) ? 1 : 0
            }

            console.log("attack airplane kills:", attackAirKills)
            console.log("defense airplane kills:", defenseAirKills)
            attack.supplied.aircraft -= defenseAirKills
            defense.supplied.aircraft -= attackAirKills

            attack.supplied.aircraft = atLeastZero(attack.supplied.aircraft)
            defense.supplied.aircraft = atLeastZero(defense.supplied.aircraft)

            narrative.push('Air battle - attack killed ' + attackAirKills + ' leaving defense with ' + defense.supplied.aircraft)
            narrative.push('Air battle - defense killed ' + defenseAirKills + ' leaving attack with ' + attack.supplied.aircraft)

            console.log("attack have", attack.supplied.aircraft, "aircraft")
            console.log("defense have", defense.supplied.aircraft, "aircraft")
            if (attack.supplied.aircraft > defense.supplied.aircraft) {
                narrative.push('Air battle - attack have air superiority ' + (attack.supplied.aircraft - defense.supplied.aircraft))
                attackMods.air = attack.supplied.aircraft - defense.supplied.aircraft
            } else if (attack.supplied.aircraft < defense.supplied.aircraft) {
                narrative.push('Air battle - defense have air superiority ' + (defense.supplied.aircraft - attack.supplied.aircraft))
                defenseMods.air = defense.supplied.aircraft - attack.supplied.aircraft
            } else {
                narrative.push('Air battle - air forces mutually destroyed')
            }
        } else if (attack.supplied.aircraft != 0) {
            console.log("attack have air superiority with", attack.supplied.aircraft, "aircraft")
            narrative.push('Air battle - attack have air superiority ' + attack.supplied.aircraft)
            attackMods.air = attack.supplied.aircraft
        } else if (defense.supplied.aircraft != 0) {
            console.log("defense have air superiority with", defense.supplied.aircraft, "aircraft")
            narrative.push('Air battle - defense have air superiority ' + defense.supplied.aircraft)
            defenseMods.air = defense.supplied.aircraft
        } else {
            console.log("no air battle, no air superiority")
        }

        console.log("now its time to battle")

        // get modifiers
        attackingModifiers.forEach(function(value, index, array) {
            attackMods[value] = $('.attacking.modifiers.' + value)[0].checked ? 1 : 0
        })
        defendingModifiers.forEach(function(value, index, array) {
            defenseMods[value] = $('.defending.modifiers.' + value)[0].checked ? 1 : 0
        })

        console.log("attacking modifiers:", attackMods)
        console.log("defending modifiers:", defenseMods)

        // calculate defense strength with modifiers

        sumDefenseMods = 0
        sumAttackMods = 0

        _.each(attackMods, function(value, key) {
            sumAttackMods += value
        })
        _.each(defenseMods, function(value, key) {
            sumDefenseMods += value
        })

        narrative.push('Modifiers - attack have a modifier bonus of ' + sumAttackMods)
        narrative.push('Modifiers - defense have a modifier bonus of ' + sumDefenseMods)

        console.log("attacking mod total:", sumAttackMods)
        console.log("defending mod total:", sumDefenseMods)

        defenseStrength = 0
        attackStrength = 0
        attackUnits = 0
        defenseUnits = 0

        _.each(defense.supplied, function(value, key) {
            defenseStrength += (unitStrengths.supplied[key].defense + sumDefenseMods) * defense.supplied[key]
            defenseUnits += defense.supplied[key]
        })
        _.each(defense.unsupplied, function(value, key) {
            defenseStrength += (unitStrengths.unsupplied[key].defense + sumDefenseMods) * defense.unsupplied[key]
            defenseUnits += defense.unsupplied[key]
        })

        _.each(attack.supplied, function(value, key) {
            attackStrength += (unitStrengths.supplied[key].attack + sumAttackMods) * attack.supplied[key]
            attackUnits += attack.supplied[key]
        })
        _.each(attack.unsupplied, function(value, key) {
            attackStrength += (unitStrengths.unsupplied[key].attack + sumAttackMods) * attack.unsupplied[key]
            attackUnits += attack.unsupplied[key]
        })

        console.log("attack strength:", attackStrength)
        console.log("defense strength:", defenseStrength)

        narrative.push('Strength - attack ' + attackStrength + ' vs defense ' + defenseStrength)

        // who wins
        attackProb = attackStrength / (attackStrength + defenseStrength)
        defenseProb = defenseStrength / (attackStrength + defenseStrength)

        attackWins = binarySample(attackProb)
        winner = attackWins ? "ATTACK WINS" : "DEFENSE WINS"
        console.log(winner)

        narrative.push(winner)

        // now for the kills
        console.log("attack has", attackUnits, "units with", attackProb, "of getting a kill")
        console.log("defense has", defenseUnits, "units with", defenseProb, "of getting a kill")

        narrative.push('Casualties - ' + attackUnits + ' attack units with ' + attackProb + ' of a kill')
        narrative.push('Casualties - ' + defenseUnits + ' defense units with ' + defenseProb + ' of a kill')

        defenseKills = 0
        attackKills = 0

        for (var i = 0; i < defenseUnits; i++) {
            defenseKills += binarySample(defenseProb) ? 1 : 0
        };
        for (var i = 0; i < attackUnits; i++) {
            attackKills += binarySample(attackProb) ? 1 : 0
        };

        console.log("defense killed", defenseKills)
        console.log("attack killed", attackKills)
        narrative.push('Casualties - defense killed ' + defenseKills)
        narrative.push('Casualties - attack killed ' + attackKills)

        // randomly select what was killed
        attackLosses = _.sample(attackList, defenseKills)
        defenseLosses = _.sample(defenseList, attackKills)

        for (var i = 0; i < defenseAirKills; i++) {
            attackLosses.push('aircraft')
        };

        for (var i = 0; i < attackAirKills; i++) {
            defenseLosses.push('aircraft')
        };

        attackLosses = _.sortBy(attackLosses, function(string) {
            return string
        });
        defenseLosses = _.sortBy(defenseLosses, function(string) {
            return string
        });

        console.log("attack losses:", attackLosses)
        console.log("defense losses:", defenseLosses)

        Session.set("winner", winner)
        Session.set("attackLosses", attackLosses)
        Session.set("defenseLosses", defenseLosses)
        Session.set('narrative', narrative)

    }
})

sum = function(array) {
    return _.reduce(array, function(memo, num) {
        return memo + num;
    }, 0);
}

atLeastZero = function(num) {
    if (num < 0) {
        return 0
    } else {
        return num
    }
}

Template.battle.rendered = function() {
    Session.set("winner", null)
    Session.set("attackLosses", null)
    Session.set("defenseLosses", null)
    Session.set('narrative', null)
}