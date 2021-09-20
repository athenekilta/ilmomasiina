import React, { ReactNode } from 'react';

import Separator from '../../components/Separator';

type Props = {
  className: string;
  title: ReactNode;
  date?: string;
  signupStatus?: string;
  signupCount?: number;
  quotaSize?: number | null;
};

const TableRow = ({
  className, title, date, signupStatus, signupCount, quotaSize,
}: Props) => (
  <tr className={className}>
    <td key="title" className="title">
      {title}
    </td>
    <td key="date" className="date">
      {date}
    </td>
    <td key="signup" className="signup">
      {signupStatus}
    </td>
    <td
      key="signups"
      className="signups"
      data-xs-prefix={signupCount !== undefined ? 'Ilmoittautuneita: ' : ''}
    >
      {signupCount}
      {quotaSize && <Separator />}
      {quotaSize || ''}
    </td>
  </tr>
);

export default TableRow;
