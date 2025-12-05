const { Schema, model } = require('mongoose');

const FileSchema = new Schema({
    fileURL: {
        type: String,
        required: true
    },
    subCode: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['Questions', 'Answers'],
        required: true,
    },
     subName: {
        type: String,
        required: true
    },
    sem:{
        type:String,
        required:true
    },
    uploadedBy: {
        type: String,
        default: null
    }
})

FileSchema.index({ contentType: 1, subCode: 1, sem:1 }, { unique: true });


const File = model('File', FileSchema)

module.exports = File;