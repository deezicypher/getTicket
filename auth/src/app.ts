import express,{Request,Response,NextFunction} from "express"
import userRoute from './routes/user'
import cookieSession from "cookie-session"
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
  signed:false,
  secure: process.env.NODE_ENV !== 'dev'
}))

app.use('/api/users', userRoute)
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ error: "Route Not Found" });
});  

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });


export {app}