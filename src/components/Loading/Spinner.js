import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import '../../stylesheets/spinner.css';

const Spinner = (props) => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
        props.chart === "performance" || props.chart === "frequency" ?
        <div className="spinner" style={{paddingTop: props.chart === "performance" ? "50px" : "0px", height: "100px"}}>
            <Loader type="Oval" color="#3af0f9" height="100" width="100"/>
        </div>
        :
        <div className="spinner">
            <Loader type="ThreeDots" color="#3af0f9" height="62" width="62"/>
        </div>
    )
  );
};

export default Spinner