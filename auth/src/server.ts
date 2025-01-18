import express,{Request,Response,NextFunction} from "express"
import userRoute from './routes/user'

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

app.listen(3000,()=>{
    console.log('Listening on port 3000')
})