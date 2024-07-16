const {model, Schema} = require("mongoose");


const userSchema = new Schema({
    username: String,
    password: String,
    image: String,
    rol: { type: String, default: 'usuario' },
});


module.exports= model("user", userSchema);