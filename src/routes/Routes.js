import asyncRoute from './RoutesAsync';

export const Home = asyncRoute(() => import('./Home'));
export const HelloWorld = asyncRoute(() => import('./HelloWorld'));
export const Bye = asyncRoute(() => import('./Bye'));
