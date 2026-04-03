import dotenv from "dotenv";
dotenv.config({ override: true });
import express, { Application } from "express";
import cors from "cors";
import accessRouter from "./routes/acess";
const app: Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());


app.use("/api/accesses", accessRouter); // Endpoint de accesos

const PORT: number = Number(process.env.PORT) || 8080;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend corriendo en el puerto ${PORT}`);
});