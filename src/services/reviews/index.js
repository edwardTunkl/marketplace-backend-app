import express from "express";
import uniqid from "uniqid";
// import createHttpError from "http-errors";

import { getReviews, writeReviews } from "../../../utils/utils.js";

import pool from "../../../utils/db.js";

const reviewRouter = express.Router();

/*

//---GET reviews---

reviewRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

//---GET---

reviewRouter.get("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find((rev) => rev.reviewId === req.params.id);

    if (review) {
      res.send(review);
    } else {
      res.send("Not found!");
    }
  } catch (error) {
    next(error);
  }
});

//---POST reviews---

reviewRouter.post("/", async (req, res, next) => {
  try {
    const { comment, rate, productId } = req.body;
    const review = {
      reviewId: uniqid(),
      comment,
      rate,
      productId,
      createdAt: new Date(),
    };

    const reviews = await getReviews();
    reviews.push(review);
    await writeReviews(reviews);
    res.status(201).send(review);
  } catch (error) {
    console.log(error);
  }
});

//---Delete reviews---

reviewRouter.delete("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const remainingReviews = reviews.filter(
      (rev) => rev.reviewId !== req.params.id
    );
    writeReviews(remainingReviews);
    res.status(204).send();
  } catch (error) {
    console.log(error);
  }
});

//---Update review---

reviewRouter.put("/:id", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const remainingReviews = reviews.filter(
      (rev) => rev.reviewId !== req.params.id
    );

    const updatedReview = {
      ...req.body,
      reviewId: uniqid(),
      productId: req.params.id,
      updatedAt: new Date(),
    };
    remainingReviews.push(updatedReview);
    await writeReviews(remainingReviews);
    res.send(updatedReview).status(200);
  } catch (error) {
    console.log(error);
  }
});

*/

// ***************** CRUD for Reviews ( /products GET, POST, DELETE, PUT)

//---GET---

reviewRouter.get("/", async(req, res, next) => {
  try {
    const query = `
    SELECT
    review.review_id,
    review.comment,
    review.rate,
    review.product,
    product.name,
    product.description,
    product.brand,
    product.image_url,
    product.price,
    product.category
    FROM reviews as review
    INNER JOIN products AS product ON review.product = product.product_id
    `
    const result = await pool.query(query)
    res.send(result.rows)

  } catch (error) {
    console(error)
    res.status(500).send(error)
  }
})

//---GET:id---

reviewRouter.get("/:id", async(req, res, next) =>{
  try {
    const query = `
    SELECT
    review.review_id,
    review.comment,
    review.rate,
    review.product,
    product.name,
    product.description,
    product.brand,
    product.image_url,
    product.price,
    product.category
    FROM reviews as review
    INNER JOIN products AS product ON review.product = product.product_id
    WHERE review_id=${req.params.id};`

    const result = await pool.query(query)
    if(result.rows.length > 0){
      res.send(result.rows[0])
    }
    else{
        res.status(404).send({message:`Review with ${req.params.id} NOT FOUND.`})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

//---Delete---

reviewRouter.delete("/:id", async(req, res, next) =>{
  try {
    const query = `DELETE FROM reviews WHERE review_id=${req.params.id};`
    await pool.query(query)
    res.status(204).send()

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

//---Put---

reviewRouter.put("/:id", async(req, res, next) =>{
try {
  const {comment, rate, product} = req.body
  const query = `
    UPDATE reviews
    SET
    comment=${"'"+comment+"'"},
    rate=${"'"+rate+"'"},
    product=${"'"+product+"'"},
    updated_at= NOW()
    WHERE product_id=${req.params.id}
    RETURNING*;
  `
  const result = await pool.query(query)
  res.status(204).send(result.rows[0])

} catch (error) {
  console.log(error)
  res.status(500).send(error)
}

})

//---POST---

reviewRouter.post("/", async(req, res, next) =>{
  try {
    const {comment, rate, product} = req.body
    const query = `
    INSERT INTO REVIEWS
    (
      comment,
      rate,
      product
    ) 
    VALUES
    (
      ${"'"+comment+"'"},
      ${"'"+rate+"'"},
      ${"'"+product+"'"}
    ) RETURNING *;
    `
      const result = pool.query(query)
      res.status(201).send(result.rows[0])

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})

export default reviewRouter;
