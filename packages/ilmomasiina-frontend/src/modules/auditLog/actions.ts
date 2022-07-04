import _ from 'lodash';

import apiFetch from '@tietokilta/ilmomasiina-components/src/api';
import { AuditLog } from '@tietokilta/ilmomasiina-models/src/services/auditlog';
import { DispatchAction, GetState } from '../../store/types';
import {
  AUDIT_LOG_LOAD_FAILED,
  AUDIT_LOG_LOADED,
  AUDIT_LOG_QUERY,
  RESET,
} from './actionTypes';

export const resetState = () => <const>{
  type: RESET,
};

export const auditLogQuery = (query: AuditLog.List.Query) => <const>{
  type: AUDIT_LOG_QUERY,
  payload: query,
};

export const auditLogLoaded = (users: AuditLog.List) => <const>{
  type: AUDIT_LOG_LOADED,
  payload: users,
};

export const auditLogLoadFailed = () => <const>{
  type: AUDIT_LOG_LOAD_FAILED,
};

export type AuditLogActions =
  | ReturnType<typeof auditLogQuery>
  | ReturnType<typeof auditLogLoaded>
  | ReturnType<typeof auditLogLoadFailed>
  | ReturnType<typeof resetState>;

export const getAuditLogs = (query: AuditLog.List.Query = {}) => async (
  dispatch: DispatchAction,
  getState: GetState,
) => {
  const { accessToken } = getState().auth;

  dispatch(auditLogQuery(query));

  const queryString = _.entries(query)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  try {
    const response = await apiFetch(`auditlog?${queryString}`, { accessToken });
    dispatch(auditLogLoaded(response as AuditLog.List));
  } catch (e) {
    dispatch(auditLogLoadFailed());
  }
};

export const setAuditLogQueryField = <K extends keyof AuditLog.List.Query>(
  key: K,
  value: AuditLog.List.Query[K],
) => async (dispatch: DispatchAction, getState: GetState) => {
    const newQuery = {
      ...getState().auditLog.auditLogQuery,
      [key]: value,
    };
    if (!key.startsWith('$')) {
      delete newQuery.$offset;
    }
    await dispatch(getAuditLogs(newQuery));
  };
