import moment from 'moment';
import { Op } from 'sequelize';
import { Signup } from '../models/signup';

const redactedName = 'Deleted';
const redactedEmail = 'deleted@gdpr';

export default () => {
  Signup
    .findAll({
      where: {
        [Op.and]: {
          [Op.or]: {
            firstName: {
              [Op.ne]: redactedName,
            },
            lastName: {
              [Op.ne]: redactedName,
            },
            email: {
              [Op.ne]: redactedEmail,
            },
          },
          createdAt: {
            [Op.lt]: moment().subtract(6, 'months').toDate(),
          },
        },
        // Over 6 months old

      },
    })
    .then((signups) => {
      if (signups.length !== 0) {
        console.log('Redacting older signups: ');
        console.log(signups.map((s) => s.id));
        signups.forEach((signup) => {
          signup.update({
            firstName: redactedName,
            lastName: redactedName,
            email: redactedEmail,
          });
        });
      }
    });
};
