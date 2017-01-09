import _ from 'lodash';

const allTimesMatch = (quotas) => {
  const startMin = _.min(quotas.map(n => n.signupOpens));
  const endMin = _.min(quotas.map(n => n.signupCloses));
  const startMax = _.max(quotas.map(n => n.signupOpens));
  const endMax = _.max(quotas.map(n => n.signupCloses));

  return (startMin === startMax && endMin === endMax);
};

export default allTimesMatch;
