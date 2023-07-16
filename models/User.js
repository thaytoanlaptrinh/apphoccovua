const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    description: String,
    token: String,
    avatar: { type: String, default: '/bundles/web/images/v5-index/computer.99763360.png' },
    phone: { type: String },
    name: { type: String },
    bod: { type: String },
    listfriend: [{ type: String }],
    elo: { type: Number }
}, { collection: 'users', timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash
        next()
    })
})


module.exports.User = mongoose.model('users', UserSchema);

