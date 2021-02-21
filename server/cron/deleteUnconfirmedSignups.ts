import moment from 'moment';
import { Op } from 'sequelize';
import { Signup } from '../models/signup';

export default () => {
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
            [Op.lt]: moment().subtract(30, 'minutes').toDate(),
          },
        },
      },
    })
    .then((signups) => signups.map((signup) => signup.id))
    .then((signups) => {
      console.log('Deleting unconfirmed signups:');
      console.log(signups);
      signups.map((id) => {
        Signup
          .unscoped()
          .destroy({ where: { id } })
          .then((res) => console.log(res))
          .catch((error) => console.error(error));
      });
    });
};
