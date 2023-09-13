import app from './app'
import dbInit from './infrastructure/database/database'
const port =  process.env.PORT || 3000
dbInit()
app.listen(port,()=>console.log(`Listo por el puerto ${port}`));