import {
  AUDIT_LOG_LOAD_FAILED,
  AUDIT_LOG_LOADED,
  AUDIT_LOG_QUERY,
  RESET,
} from './actionTypes';
import { AuditLogActions, AuditLogState } from './types';

const initialState: AuditLogState = {
  auditLogQuery: {},
  auditLog: null,
  auditLogLoadError: false,
};

export default function reducer(
  state = initialState,
  action: AuditLogActions,
): AuditLogState {
  switch (action.type) {
    case AUDIT_LOG_QUERY:
      return {
        ...state,
        auditLogQuery: action.payload,
        auditLog: null,
        auditLogLoadError: false,
      };
    case AUDIT_LOG_LOADED:
      return {
        ...state,
        auditLog: action.payload,
        auditLogLoadError: false,
      };
    case AUDIT_LOG_LOAD_FAILED:
      return {
        ...state,
        auditLog: null,
        auditLogLoadError: true,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
}
