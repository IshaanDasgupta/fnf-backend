import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 8080;

import { connectDatabase } from "@/config/database";

async function bootstrap() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

bootstrap();
