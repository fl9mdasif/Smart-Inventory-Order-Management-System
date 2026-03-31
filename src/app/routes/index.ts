import { Router } from 'express';
import { authRoute } from '../modules/auth/route.auth';
import { categoryRoutes } from '../modules/category/router.category';
import { productRoutes } from '../modules/product/router.product';
// import { orderRoutes } from '../modules/order/route.order';
// import { userRoutes } from '../modules/user/route.user';
// import { cartRoutes } from '../modules/cart/route.cart';

const router = Router();

const moduleRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  // {
  //   path: '/orders',
  //   route: orderRoutes,
  // },
  // {
  //   path: '/users',
  //   route: userRoutes,
  // },
  // {
  //   path: '/carts',
  //   route: cartRoutes,
  // },
];

moduleRoute.forEach((routeObj) => router.use(routeObj.path, routeObj.route));

export default router;
