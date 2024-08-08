import React, { useState } from "react";
import "./App.css";
import Filter from "./Components/Filter";
import { IAppData, INIT_APP_DATA } from "./utils/constants";
import Chart from "./Components/Chart";

function App() {
  const [appData, setAppData] = useState<IAppData>(INIT_APP_DATA);

  const getAppData = (data: IAppData) => {
    setAppData(data);
  };

  return (
    <div className="App" style={{ display: "flex" }}>
      <Filter getAppData={getAppData} appData={appData} />
      {appData.categories.length ? <Chart appData={appData} /> : null}
    </div>
  );
}

export default App;
