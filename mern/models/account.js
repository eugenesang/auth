import {Schema, model} from 'mongoose';


const accountSchema =  new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Account  = model('Account', accountSchema);


export default Account;