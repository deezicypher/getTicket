import express,{Request,Response,NextFunction} from "express"
import userRoute from './routes/user'
import pool from "./config/db"

const app = express()
app.use(express.json())

app.use(userRoute)

app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: "Not Found" });
  });  
 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });


const start = async () => {
  try {
    await pool.connect()
    console.log("Connected to DB")
    app.listen(3000,()=>{
      console.log('Listening on port 3000')
  })
  }catch (err:any) {
    console.error("Error connecting to DB:", err.message); 
    process.exit(1); 
  }

}

start()