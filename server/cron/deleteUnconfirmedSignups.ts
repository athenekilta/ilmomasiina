import moment from 'moment';
import { Op } from 'sequelize';
import { IlmoApplication } from '../defs';
import { Signup } from '../models/signup';

export default (app: IlmoApplication) => {
  Signup
    .unscoped()
    .findAll({
      where: {
        [Op.and]: {
          // Is not confirmed
          confirmedAt: {
            [Op.eq]: null,
          },
          // Over 30 minutes old
          createdAt: {
            [Op.lt]: moment()
              .subtract(30, 'minutes')
              .toDate(),
          },
        },
      },
    })
    .then(r => {
      console.log('Unconfirmed signups: ');
      console.log(r);
      console.log(r.map(s => s.id));
      return r.map(s => s.id);
    })
    .then(r => {
      r.map(id => {
        Signup
          .unscoped()
          .destroy({
            where: {
              id,
            },
          })
          .then(res => console.log(res))
          .catch(error => console.log(error));
      });
    });
};
