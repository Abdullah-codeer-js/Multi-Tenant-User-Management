const express = require("express");
const companyController = require("../controllers/companyController");
const { authenticateToken } = require("../middleware/authenticateToken");
const { authorizeRoles } = require("../middleware/authorizeRole");
const { ADMIN } = require("../constants/roles");

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/companies/me:
 *   get:
 *     tags: [Companies]
 *     summary: Get the authenticated user's company
 *     description: Returns the company associated with the bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company profile returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       401:
 *         description: Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", companyController.getCompanyProfile);

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: List companies
 *     description: Admin token required.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       401:
 *         description: Missing or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Only Admin users can list companies.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authorizeRoles(ADMIN), companyController.listCompanies);

module.exports = router;
