import moment from 'moment';
import { Op, Sequelize } from 'sequelize';
import { IlmoApplication } from '../defs';
import { Signup } from '../models/signup';

const redactionKey = 'Deleted';

export default (app: IlmoApplication) => {
  Signup
    .findAll({
      where: {
        [Op.and]: {
          [Op.or]: {
            firstName: {
              [Op.ne]: redactionKey,
            },
            lastName: {
              [Op.ne]: redactionKey,
            },
            email: {
              [Op.not]: null,
            },
          },
          createdAt: {
            [Op.lt]: moment()
              .subtract(6, 'months')
              .toDate(),
          },
        },
        // Over 6 months old

      },
    })
    .then((signups) => {
      if (signups.length !== 0) {
        console.log('Redacting older signups: ');
        console.log(signups.map(s => s.id));
        signups.forEach((signup) => {
          signup.update({ firstName: redactionKey, lastName: redactionKey, email: null });
        });
      }
    });
};
