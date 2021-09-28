import express from "express";
import cors from "cors";
import productsRouter from "./services/products/index.js";
import createTables, { publicFolderPath } from "../utils/utils.js";
import listEndpoints from "express-list-endpoints";
import reviewRouter from "./services/reviews/index.js";

const server = express();

const PORT = process.env.PORT || 3001;
console.log(PORT);

console.log(process.env.DATABASE_URL_DEV)
/*
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Origins is not allowed"));
    }
  },
};

server.use(cors(corsOpts));
*/
server.use(cors())
server.use(express.json());
server.use(express.static(publicFolderPath));

server.use("/products", productsRouter);
server.use("/reviews", reviewRouter);

console.table(listEndpoints(server));

server.listen(PORT, async() => {
  console.log("The server running on port: ", PORT)
  await createTables()
});

server.on("error", (error) =>
  console.log(`Server is not running due to: ${error}`)
);
