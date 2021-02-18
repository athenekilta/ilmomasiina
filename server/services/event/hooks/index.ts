import { disallow } from 'feathers-hooks-common';
import includeQuotas from './includeQuotas';
import includeAllEventData from './includeAllEventData';
import removeNonpublicAnswers from './removeNonpublicAnswers';
import formatOptionsAsArray from './formatOptionsAsArray';
import addOpenStatus from './addOpenStatus';

export default {
  before: {
    all: [],
    find: [includeQuotas()],
    get: [includeAllEventData()],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
  },
  after: {
    all: [],
    find: [],
    get: [removeNonpublicAnswers(), formatOptionsAsArray(), addOpenStatus()],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
