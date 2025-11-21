
import { RouteObject } from 'react-router-dom';
import Home from '../pages/home/page';
import Nutrition from '../pages/nutrition/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/nutrition',
    element: <Nutrition />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
