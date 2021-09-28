import express from "express";
import uniqid from "uniqid";
// import createHttpError from "http-errors";

import { getReviews, writeReviews } from "../../../utils/utils.js";

const reviewRouter = express.Router();

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

export default reviewRouter;
