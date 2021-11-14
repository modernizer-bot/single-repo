import ReactDOM from "react-dom";
import React from "react";
import "./index.css";
// @ts-ignore
import styles from "./index.module.css";

const App = () => {
  return (
    <div>
      <h1 className="red-color">This is my React app!</h1>
      <h1 className={styles.greenColor}>This is my React app!</h1>{" "}
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
