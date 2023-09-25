import {model, Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
    name:string;
    email: string;
    password: string;
    comparePasswords: (password:string)=>Promise<boolean>
}

const userSchema = new Schema({
    name:{
        type:String
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        trim: true
    },
    uuid:{
        type:String,
        unique:true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        require:true 
    },
    tokens: [{ type: Object }],
    refreshToken: [{ type: String }],
    
},{
    timestamps:true
});

//CIFRANDO LA CONTRASEÑA ANTES DE GUARDAR EL DATO

//pre,save significa antes de guardar
userSchema.pre<IUser>('save',async function(next){
    const user = this;
    //compruebo si el usuario nuevo a sido modificado, si no ha sido modificado next() continua, solo funciona para los antiguos usuarios
    if(!user.isModified('password')) return next();

    //si el usuario es nuevo encriptamos el password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password,salt)
    user.password = hash;

    next();
});

//methodo creado para comparar contraseñas
userSchema.methods.comparePasswords = async function(password: string):Promise<boolean>{
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', userSchema);