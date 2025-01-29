import express,{Request,Response,NextFunction} from "express"
import userRoute from './routes/user'
import cookieSession from "cookie-session"
import pool from "./config/db"

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
  signed:false,
  secure:true
}))

app.use(userRoute)
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ error: "Route Not Found" });
});  

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });


const start = async () => {
  if (!process.env.POSTGRES_DB || !process.env.POSTGRES_USER || !process.env.POSTGRES_PASSWORD 
    || !process.env.ACTIVE_TOKEN_SECRET || !process.env.ACCESS_TOKEN_SECRET 
    || !process.env.REFRESH_TOKEN_SECRET || !process.env.CLIENT_URL
) {
    throw new Error("Missing required environment variables");
}
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