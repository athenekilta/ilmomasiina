import React from "react";
import { Link } from "react-router-dom";

import moment from "moment";

import Separator from "../../components/Separator";

type Props = {
  title: string;
  date?: string;
  link?: string;
  signupLabel?: string;
  className?: string;
  signups?: number;
  size?: number;
};

const TableRow = (props: Props) => {
  const { title, link, date, signupLabel, signups, size, className } = props;

  return (
    <tr className={className}>
      <td key="title" className="title">
        {link ? <Link to={link}>{title}</Link> : title}
      </td>
      <td key="date" className="date">
        {date ? moment(date).format("DD.MM.YYYY") : ""}
      </td>
      <td key="signup" className="signup">
        {signupLabel}
      </td>
      <td
        key="signups"
        className="signups"
        data-xs-prefix={signups || size ? "Ilmoittautuneita: " : ""}
      >
        {signups}
        {size ? <Separator /> : ""}
        {size || ""}
      </td>
    </tr>
  );
};

export default TableRow;
