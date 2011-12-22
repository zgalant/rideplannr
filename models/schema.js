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
        cars: [{type: Goose.ObjectId, ref:'Car'}],
        groups: [{type: Goose.ObjectId, ref:'Group'}],
    });
    UserSchema.plugin(Goose.useTimestamps);
    User = Goose.mongoose.model('User', UserSchema);

    // Define Car model
    CarSchema = new Goose.Schema({
        user: {type: Goose.ObjectId, ref:'User'},
        type: String,
        num_seats: Number,
        info: String
    }); 
    CarSchema.plugin(Goose.useTimestamps);
    Car = Goose.mongoose.model('Car', CarSchema);

    // Define Ride model
    RideSchema = new Goose.Schema({
        driver: {type: Goose.ObjectId, ref:'User'},
        riders: [{type: Goose.ObjectId, ref:'User'}],
        car: {type: Goose.ObjectId, ref:'Car'},
        num_seats: Number,
        notes: String,
        leaving_date: Date,
        return_date: Date
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
    }); 
    GroupSchema.plugin(Goose.useTimestamps);
    Group = Goose.mongoose.model('Group', GroupSchema);
}


