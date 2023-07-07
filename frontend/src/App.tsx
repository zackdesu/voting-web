import { useEffect, useRef, useState } from "react";
import Background from "./components/background";
import Form from "./pages/form";
import Vote from "./pages/vote";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const vote = useRef<HTMLDivElement>(null);

  const [winHeight, setWinHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWinHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (vote.current) {
      if (vote.current.offsetHeight > winHeight) {
        document.documentElement.style.setProperty(
          "--bubble-height",
          vote.current.offsetHeight.toString() + "px"
        );
      } else {
        document.documentElement.style.setProperty("--bubble-height", "100%");
      }
    }
  }, [window.innerHeight]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Background />
              <Form />
            </>
          }
        />
        <Route
          path="/vote"
          element={
            <>
              <Background />
              <Vote ref={vote} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
