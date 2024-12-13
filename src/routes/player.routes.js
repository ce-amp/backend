const express = require("express");
const router = express.Router();
const { verifyToken, isPlayer } = require("../middlewares/auth.middleware");
const playerController = require("../controllers/player.controller");

/**
 * @swagger
 * /api/player/questions:
 *   get:
 *     summary: Get all questions for players
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of questions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Players only.
 *
 * /api/player/questions/random:
 *   get:
 *     summary: Get a random question
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Random question
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Players only.
 *
 * /api/player/questions/{id}/answer:
 *   post:
 *     summary: Submit an answer for a question
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 type: number
 *                 description: Index of the selected answer
 *     responses:
 *       200:
 *         description: Answer submission result
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Players only.
 *
 * /api/player/leaderboard:
 *   get:
 *     summary: Get the player leaderboard
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Players only.
 *
 * /api/player/follow/designer/{id}:
 *   post:
 *     summary: Follow a designer
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Designer ID
 *     responses:
 *       200:
 *         description: Successfully followed designer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Players only.
 *
 * /api/player/follow/player/{id}:
 *   post:
 *     summary: Follow another player
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Successfully followed player
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Players only.
 */

router.get("/questions", verifyToken, isPlayer, playerController.getQuestions);
router.get(
  "/questions/random",
  verifyToken,
  isPlayer,
  playerController.getRandomQuestion
);
router.post(
  "/questions/:id/answer",
  verifyToken,
  isPlayer,
  playerController.submitAnswer
);
router.get(
  "/leaderboard",
  verifyToken,
  isPlayer,
  playerController.getLeaderboard
);
router.post(
  "/follow/designer/:id",
  verifyToken,
  isPlayer,
  playerController.followDesigner
);
router.post(
  "/follow/player/:id",
  verifyToken,
  isPlayer,
  playerController.followPlayer
);

module.exports = router;
