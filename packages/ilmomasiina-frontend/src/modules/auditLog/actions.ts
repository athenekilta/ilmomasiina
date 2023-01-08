import _ from 'lodash';

import type { AuditLogResponse, AuditLoqQuery } from '@tietokilta/ilmomasiina-models';
import adminApiFetch from '../../api';
import type { DispatchAction, GetState } from '../../store/types';
import {
  AUDIT_LOG_LOAD_FAILED,
  AUDIT_LOG_LOADED,
  AUDIT_LOG_QUERY,
  RESET,
} from './actionTypes';

export const resetState = () => <const>{
  type: RESET,
};

export const auditLogQuery = (query: AuditLoqQuery) => <const>{
  type: AUDIT_LOG_QUERY,
  payload: query,
};

export const auditLogLoaded = (log: AuditLogResponse) => <const>{
  type: AUDIT_LOG_LOADED,
  payload: log,
};

export const auditLogLoadFailed = () => <const>{
  type: AUDIT_LOG_LOAD_FAILED,
};

export type AuditLogActions =
  | ReturnType<typeof auditLogQuery>
  | ReturnType<typeof auditLogLoaded>
  | ReturnType<typeof auditLogLoadFailed>
  | ReturnType<typeof resetState>;

export const getAuditLogs = (query: AuditLoqQuery = {} as AuditLoqQuery) => async (
  dispatch: DispatchAction,
  getState: GetState,
) => {
  dispatch(auditLogQuery(query));

  const queryString = _.entries(query)
    .filter(([, value]) => value)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string | number | boolean)}`)
    .join('&');

  const { accessToken } = getState().auth;

  try {
    const response = await adminApiFetch(`admin/auditlog?${queryString}`, { accessToken }, dispatch);
    dispatch(auditLogLoaded(response as AuditLogResponse));
  } catch (e) {
    dispatch(auditLogLoadFailed());
  }
};

export const setAuditLogQueryField = <K extends keyof AuditLoqQuery>(
  key: K,
  value: AuditLoqQuery[K],
) => async (dispatch: DispatchAction, getState: GetState) => {
    const newQuery = {
      ...getState().auditLog.auditLogQuery,
      [key]: value,
    };
    if (!key.startsWith('$')) {
      delete newQuery.offset;
    }
    await dispatch(getAuditLogs(newQuery));
  };
