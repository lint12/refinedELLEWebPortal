import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Wave = (props) => {

  return (
        <div style={{padding: "0", margin: "0"}}>
          <SkeletonTheme color="transparent" highlightColor="#8691fa">
            <Skeleton/>
          </SkeletonTheme>
        </div>
  );
};

export default Wave