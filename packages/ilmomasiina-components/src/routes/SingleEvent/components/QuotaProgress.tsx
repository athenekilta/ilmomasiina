import React from 'react';

import { ProgressBar } from 'react-bootstrap';

type Props = {
  max: number;
  title: string;
  value: number;
};

const QuotaProgress = ({ max, title, value }: Props) => (
  <div>
    {title}
    <ProgressBar
      now={Math.min(value, max)}
      max={max}
      className="ilmo--signup-progress"
      label={(
        <>
          {value}
          &ensp;/&ensp;
          {max !== Infinity ? max : <span title="Unlimited">&infin;</span>}
        </>
      )}
    />
  </div>
);

export default QuotaProgress;
