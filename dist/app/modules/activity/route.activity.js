"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRoutes = void 0;
const express_1 = require("express");
const controller_activity_1 = require("./controller.activity");
const router = (0, express_1.Router)();
router.get('/', controller_activity_1.ActivityController.getRecentActivities);
exports.ActivityRoutes = router;
