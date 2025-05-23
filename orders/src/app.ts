import express,{Request,Response,NextFunction} from "express"
import OrdersRouter from './routes/orders'
import cookieSession from "cookie-session"
import { verifyToken } from "@xgettickets/common"
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
  signed:false,
  secure: process.env.NODE_ENV !== 'test'
}))

//app.use(verifyToken)
app.use('/api/orders', OrdersRouter)
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ error: "Route Not Found" });
});  

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });


export {app}