import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element:<h1>Hello</h1>,
    // children: [
    //   { index: true, Component: Home },
    //   { path: "about", Component: About },
    //   {
    //     path: "auth",
    //     Component: AuthLayout,
    //     children: [
    //       { path: "login", Component: Login },
    //       { path: "register", Component: Register },
    //     ],
    //   },
    //   {
    //     path: "concerts",
    //     children: [
    //       { index: true, Component: ConcertsHome },
    //       { path: ":city", Component: ConcertsCity },
    //       { path: "trending", Component: ConcertsTrending },
    //     ],
    //   },
    // ],
  },
]);


export default router;
