import express from "express";
import { getAllReviews, createReview } from "../controller/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router({mergeParams:true});

router.route("/")
.get(getAllReviews).post(authenticate, createReview)


export default router;