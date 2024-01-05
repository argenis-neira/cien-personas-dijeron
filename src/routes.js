import Database from "./pages/index";
import Game from "./pages/game"
import Error from "./pages/error404";

const PublicRoutes = [
  { path: "/carlos", element: <Database /> },
  { path: "/game", element: <Game /> },
  { path: '/*', skipLazyLoad: true, element: <Error /> }
]

export { PublicRoutes }