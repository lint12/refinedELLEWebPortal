import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Wave = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  let height; 
  let width;
  if (props.chart === "language") {
    height = 180; 
    width = 50;
  }
  else if (props.chart === "tag") {
    height = 440; 
    width = 50;
  }

  return (
    promiseInProgress && (
        <div>
          <SkeletonTheme color="transparent" highlightColor="#3af0f9">
            <Skeleton width={width} height={height}/>
          </SkeletonTheme>
        </div>
    )
  );
};

export default Wave