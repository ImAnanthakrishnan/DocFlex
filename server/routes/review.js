import express from "express";
import { getAllReviews, createReview, getAllNonAuthReviews } from "../controller/reviewController.js";
import { authenticate,restrict } from "../middleware/authMiddleware.js";

const router = express.Router({mergeParams:true});

router.route("/")
.get(getAllReviews)
.post(authenticate,restrict(['patient']) ,createReview)

router.get('/',getAllNonAuthReviews);

export default router;