// Define the schema
Units = new SimpleSchema({
    infantry: {
        type: Number,
        min: 0,
        defaultValue: 0
    },
    armor: {
        type: Number,
        min: 0,
        defaultValue: 0
    },
    lightFleet: {
        type: Number,
        min: 0,
        defaultValue: 0
    },
    heavyFleet: {
        type: Number,
        min: 0,
        defaultValue: 0
    },
    aircraft: {
        type: Number,
        min: 0,
        defaultValue: 0
    },
});

Army = new SimpleSchema({
    supplied: {
        type: Units
    },
    unsupplied: {
        type: Units
    }
})

Battle = new SimpleSchema({
    attacking: {
        type: Army
    },
    defending: {
        type: Army
    }
})

SimpleSchema.debug = false