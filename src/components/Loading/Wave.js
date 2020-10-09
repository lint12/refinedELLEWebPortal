import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Wave = (props) => {

  return (
        <div>
          <SkeletonTheme color="transparent" highlightColor="#3af0f9">
            <Skeleton width={1000} height={1000}/>
          </SkeletonTheme>
        </div>
  );
};

export default Wave