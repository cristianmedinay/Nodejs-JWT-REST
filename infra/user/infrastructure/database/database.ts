import mongoose, {ConnectOptions } from 'mongoose'
import config from '../config/config'

const dbInit = ()=>{
    mongoose.connect(config.DB.URI,{bufferCommands: true, autoIndex: true, autoCreate: true})
    const connection = mongoose.connection;
    connection.once('open',()=>{
        console.log('Mongodb connecion establecida')
        
    })
    connection.on('error',err=>{
        console.log(err)
        process.exit(0);
    })
}


export default dbInit