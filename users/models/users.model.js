const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    permissionLevel: Number
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.search_by_id = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const User = mongoose.model('Users', userSchema);



exports.search_by_id = (id) => {
    return User.search_by_id(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.create_user = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.remove_by_ID = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.update_user = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

