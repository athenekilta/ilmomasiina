import React from 'react';

import Separator from '../../../../components/Separator';

import './ViewProgress.scss';

type Props = {
  max: number;
  title: string;
  value: number;
};

const ViewProgress = ({ max, title, value }: Props) => (
  <div>
    {title}
    <div className="progress">
      <div
        className="progress-bar"
        style={{
          minWidth: '5em',
          width: `${(value / max) * 100}%`,
        }}
      >
        {value}
        <Separator />
        {max || <span title="Unlimited">&infin;</span>}
      </div>
    </div>
  </div>
);

export default ViewProgress;
