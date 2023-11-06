import { useState } from "react";
import Login from "./components/Login";
import Theater from "./components/Theater";

function App() {

  // WIP
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const started = !!videoInfo;

  return (
    <>
      {started
        ?
        <Theater videoInfo={videoInfo}/>
        :
        <Login setVideoInfo={setVideoInfo} />
      } 
    </>
  )
}

export default App
