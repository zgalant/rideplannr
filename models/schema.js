module.exports.SetUp = SetUp;
function SetUp(Goose) {
    // Define User model
    UserSchema = new Goose.Schema({
        first_name: String,
        last_name: String,
        fbid: String,
        username: String,
        email: Goose.Email,
        phone: String,
        num_logins: Number,
        groups: [{type: Goose.ObjectId, ref:'Group'}],
    });
    UserSchema.plugin(Goose.useTimestamps);
    User = Goose.mongoose.model('User', UserSchema);

    // Define Ride model
    RideSchema = new Goose.Schema({
        ride_event: {type: Goose.ObjectId, ref:'Event'},
        driver: {type: Goose.ObjectId, ref:'User'},
        riders:{
            there: [{type: Goose.ObjectId, ref:'User'}],
            back: [{type: Goose.ObjectId, ref:'User'}],
        },
        seats: {
            there: { type: Number, default: 4 },
            back: { type: Number, default: 4 },
        },
        notes: String,
        leaving: String,
        returning: String,
    });
    RideSchema.plugin(Goose.useTimestamps);
    Ride = Goose.mongoose.model('Ride', RideSchema);

    // Define Event model
    EventSchema = new Goose.Schema({
        name: String,
        info: String,
        group:{type: Goose.ObjectId, ref:'Group'},
        rides: [{type: Goose.ObjectId, ref:'Ride'}],
    }); 
    EventSchema.plugin(Goose.useTimestamps);
    Event = Goose.mongoose.model('Event', EventSchema);
    
    // Define Group model
    GroupSchema = new Goose.Schema({
        name: String,
        description: String,
        events: [{type: Goose.ObjectId, ref:'Event'}],
        users: [String],
    }); 
    GroupSchema.plugin(Goose.useTimestamps);
    Group = Goose.mongoose.model('Group', GroupSchema);
}


