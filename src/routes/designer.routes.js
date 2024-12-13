const express = require("express");
const router = express.Router();
const { verifyToken, isDesigner } = require("../middlewares/auth.middleware");
const designerController = require("../controllers/designer.controller");

/**
 * @swagger
 * /api/designer/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Designers only
 *   post:
 *     summary: Create a new question
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - options
 *               - correctAnswer
 *               - difficulty
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               difficulty:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               relatedQuestions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Designers only
 *
 * /api/designer/questions/{id}:
 *   get:
 *     summary: Get a specific question
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 *   put:
 *     summary: Update a question
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - options
 *               - correctAnswer
 *               - difficulty
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctAnswer:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               difficulty:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               relatedQuestions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Question not found
 *   delete:
 *     summary: Delete a question
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *
 * /api/designer/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     summary: Create a new category
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *
 * /api/designer/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete a category
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *
 * components:
 *   schemas:
 *     Question:
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
 *           type: number
 *         creator:
 *           type: string
 *         relatedQuestions:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         creator:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 * /api/designer/questions/{id}/related/{relatedId}:
 *   post:
 *     summary: Add a related question
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: relatedId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Related question added successfully
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Designers only
 *   delete:
 *     summary: Remove a related question
 *     tags: [Designer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: relatedId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Related question removed successfully
 *       404:
 *         description: Question not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Designers only
 */

router.post(
  "/questions/:id/related/:relatedId",
  verifyToken,
  isDesigner,
  designerController.addRelatedQuestion
);
router.delete(
  "/questions/:id/related/:relatedId",
  verifyToken,
  isDesigner,
  designerController.removeRelatedQuestion
);

router.get(
  "/questions",
  verifyToken,
  isDesigner,
  designerController.getQuestions
);
router.post(
  "/questions",
  verifyToken,
  isDesigner,
  designerController.createQuestion
);
router.get(
  "/questions/:id",
  verifyToken,
  isDesigner,
  designerController.getQuestion
);
router.put(
  "/questions/:id",
  verifyToken,
  isDesigner,
  designerController.updateQuestion
);
router.delete(
  "/questions/:id",
  verifyToken,
  isDesigner,
  designerController.deleteQuestion
);

router.get(
  "/categories",
  verifyToken,
  isDesigner,
  designerController.getCategories
);
router.post(
  "/categories",
  verifyToken,
  isDesigner,
  designerController.createCategory
);
router.put(
  "/categories/:id",
  verifyToken,
  isDesigner,
  designerController.updateCategory
);
router.delete(
  "/categories/:id",
  verifyToken,
  isDesigner,
  designerController.deleteCategory
);

module.exports = router;
