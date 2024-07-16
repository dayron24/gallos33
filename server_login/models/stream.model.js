const {model, Schema} = require("mongoose");


const streamSchema = new Schema({
    id: Number,
    titulo: String,
    clave: String,
    image: String
});


module.exports= model("stream", streamSchema);