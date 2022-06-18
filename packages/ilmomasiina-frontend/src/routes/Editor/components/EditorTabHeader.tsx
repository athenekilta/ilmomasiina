import React from 'react';

import { useFormikContext } from 'formik';
import { Nav } from 'react-bootstrap';

import { EditorEvent, EditorEventType } from '../../../modules/editor/types';

export enum EditorTab {
  BASIC_DETAILS = 1,
  QUOTAS = 2,
  QUESTIONS = 3,
  EMAILS = 4,
  SIGNUPS = 5,
}

type Props = {
  activeTab: EditorTab;
  setActiveTab: (tab: EditorTab) => void
};

const TABS: [EditorTab, string][] = [
  [EditorTab.BASIC_DETAILS, 'Perustiedot'],
  [EditorTab.QUOTAS, 'Ilmoittautumisasetukset'],
  [EditorTab.QUESTIONS, 'Kysymykset'],
  [EditorTab.EMAILS, 'Vahvistusviestit'],
  [EditorTab.SIGNUPS, 'Ilmoittautuneet'],
];

const EditorTabHeader = ({ activeTab, setActiveTab }: Props) => {
  const { values: { eventType } } = useFormikContext<EditorEvent>();

  return (
    <Nav variant="tabs" activeKey={activeTab} className="event-editor--nav">
      {TABS.flatMap(([id, label]) => {
        if (id !== EditorTab.BASIC_DETAILS && eventType === EditorEventType.ONLY_EVENT) {
          return [];
        }

        return [
          <Nav.Item key={id}>
            <Nav.Link
              eventKey={id}
              onClick={() => setActiveTab(id)}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`editor-tab-${id}`}
            >
              {label}
            </Nav.Link>
          </Nav.Item>,
        ];
      })}
    </Nav>
  );
};

export default EditorTabHeader;
