import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "@/components/Layout/pc";

const Home = React.lazy(() => import("./views/Dashboard"));

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            // element={<Suspense fallback={<></>}>{<Home />}</Suspense>}
            element={<Home />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
