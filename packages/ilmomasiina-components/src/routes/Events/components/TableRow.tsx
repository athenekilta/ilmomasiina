import React, { ReactNode } from 'react';

import { SignupStateText } from '../../../utils/signupStateText';

type Props = {
  className: string;
  title: ReactNode;
  date?: string;
  signupStatus?: SignupStateText;
  signupCount?: number;
  quotaSize?: number | null;
};

const TableRow = ({
  className, title, date, signupStatus, signupCount, quotaSize,
}: Props) => (
  <tr className={className}>
    <td key="title" className="ilmo--title">
      {title}
    </td>
    <td key="date" className="ilmo--date">
      {date}
    </td>
    <td key="signup" className="ilmo--signup-state">
      <span className="ilmo--desktop-only">{signupStatus?.shortLabel}</span>
      <span className="ilmo--mobile-only">{signupStatus?.fullLabel || signupStatus?.shortLabel}</span>
    </td>
    <td
      key="signups"
      className="ilmo--signup-count"
    >
      {signupCount !== undefined && <span className="ilmo--mobile-only">Ilmoittautuneita: </span>}
      {signupCount}
      {quotaSize && <>&ensp;/&ensp;</>}
      {quotaSize || ''}
    </td>
  </tr>
);

export default TableRow;
