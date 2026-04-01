import { Router } from 'express';
import { ActivityController } from './controller.activity';

const router = Router();

router.get('/', ActivityController.getRecentActivities);

export const ActivityRoutes = router;
