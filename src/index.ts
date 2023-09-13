import app from './app'
import dbInit from './database'
const port =  process.env.PORT || 3000
dbInit()
app.listen(port,()=>console.log(`Listo por el puerto ${port}`));

/* app.listen(app.get('port'));console.log('server on port', app.get('port'))  */
