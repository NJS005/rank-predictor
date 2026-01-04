import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Form from "./pages/Form";
import ResultPage from "./pages/Result";

export default function App() {
  return (
    <Router>
      

        <div >
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/form" element={<Form />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </div>
     
    </Router>
  );
}
