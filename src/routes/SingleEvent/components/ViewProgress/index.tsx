import React from 'react';

import Separator from '../../../../components/Separator';

import './ViewProgress.scss';

type Props = {
  max: number;
  title: string;
  value: number;
};

const ViewProgress = (props: Props) => {
  const { max, title, value } = props;

  // Don' return progress bar if no max limit
  return !max ? (
    <div />
  ) : (
    <div>
      {title}
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            minWidth: '5em',
            width: `${(value / max) * 100}%`,
          }}
        >
          {value}
          <Separator />
          {max}
        </div>
      </div>
    </div>
  );
};

export default ViewProgress;
