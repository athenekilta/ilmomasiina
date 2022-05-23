import React from 'react';

import { ProgressBar } from 'react-bootstrap';

import Separator from '../../../components/Separator';

import './QuotaProgress.scss';

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
      className="signup-progress mb-3"
      label={(
        <>
          {value}
          <Separator />
          {max !== Infinity ? max : <span title="Unlimited">&infin;</span>}
        </>
      )}
    />
  </div>
);

export default QuotaProgress;
