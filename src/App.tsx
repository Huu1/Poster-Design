import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Spin } from "antd";
import AppLayout from "./layout";

const Home = React.lazy(() => import("./views/Dashboard"));

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            // element={<Suspense fallback={<Spin></Spin>}>{<Home />}</Suspense>}
            element={<Home />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
