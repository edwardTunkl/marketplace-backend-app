import path from "path";
import fs from "fs-extra";
import uniqid from "uniqid";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import pool from "./db";


const { readJSON, writeJSON } = fs;

export const publicFolderPath = path.join(process.cwd(), "public");
// set storage for the files
const storage = multer.diskStorage({
  destination: publicFolderPath,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  filename: function (req, file, cb) {
    cb(null, uniqid() + path.extname(file.originalname));
  },
});

export const imageUpload = multer({ storage: storage });
export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);
const productsJSONPath = join(dataFolderPath, "products.json");

const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (content) => writeJSON(reviewsJSONPath, content);

export const writeProducts = (content) => writeJSON(productsJSONPath, content);
export const getProducts = () => readJSON(productsJSONPath);


//--- Create Tables

const query = `
-- DROP TABLE IF EXISTS products;
    CREATE TABLE IF NOT EXISTS 
    products(
        product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (50) NOT NULL,
        description VARCHAR (200) NOT NULL,
        brand VARCHAR (50) NOT NULL,
        image_url TEXT NOT NULL,
        price INTEGER NOT NULL,
        category VARCHAR (50) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- DROP TABLE IF EXISTS reviews;
        CREATE TABLE IF NOT EXISTS
        reviews(
            review_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            comment TEXT NOT NULL,
            rate INTEGER NOT NULL,
            product INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
           
        );
`

const createTables = async () => {
  try {
    await pool.query(query)
    console.log('Tables are created')
  } catch (error) {
    console.log(error)
    console.log('Tables are NOT created')
  }
}

export default createTables