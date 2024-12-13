const express = require("express");
const router = express.Router();
const { verifyToken, isPlayer } = require("../middlewares/auth.middleware");
const playerController = require("../controllers/player.controller");

/**
 * @swagger
 * /api/player/questions:
 *   get:
 *     summary: Get filtered questions for players
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter questions
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Difficulty level to filter questions
 *     responses:
 *       200:
 *         description: List of questions (without correct answers)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlayerQuestion'
 *       401:
 *         description: Unauthorized
 *
 * /api/player/questions/random:
 *   get:
 *     summary: Get a random unanswered question
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A random question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerQuestion'
 *       404:
 *         description: No more questions available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No more questions available
 *
 * /api/player/questions/{id}/submit:
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
 *                 type: integer
 *                 description: Index of the selected answer
 *     responses:
 *       200:
 *         description: Answer submission result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correct:
 *                   type: boolean
 *                 pointsEarned:
 *                   type: integer
 *                 feedback:
 *                   type: string
 *       400:
 *         description: Question already answered
 *       404:
 *         description: Question not found
 *
 * /api/player/leaderboard:
 *   get:
 *     summary: Get top 10 players leaderboard
 *     tags: [Player]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top 10 players by points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   points:
 *                     type: integer
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
 *         description: Designer followed successfully
 *       404:
 *         description: Designer not found
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
 *         description: Player followed successfully
 *       404:
 *         description: Player not found
 *       400:
 *         description: Cannot follow yourself
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot follow yourself
 *
 * /api/player/unfollow/designer/{id}:
 *   post:
 *     summary: Unfollow a designer
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
 *         description: Designer unfollowed successfully
 *       404:
 *         description: Designer not found
 *
 * /api/player/unfollow/player/{id}:
 *   post:
 *     summary: Unfollow another player
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
 *         description: Player unfollowed successfully
 *       404:
 *         description: Player not found
 *
 * components:
 *   schemas:
 *     PlayerQuestion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         text:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *         difficulty:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         createdAt:
 *           type: string
 *           format: date-time
 */

router.get("/questions", verifyToken, isPlayer, playerController.getQuestions);
router.get(
  "/questions/random",
  verifyToken,
  isPlayer,
  playerController.getRandomQuestion
);
router.post(
  "/questions/:id/submit",
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
router.post(
  "/unfollow/designer/:id",
  verifyToken,
  isPlayer,
  playerController.unfollowDesigner
);
router.post(
  "/unfollow/player/:id",
  verifyToken,
  isPlayer,
  playerController.unfollowPlayer
);

module.exports = router;
