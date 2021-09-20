import React from 'react';

import { Nav } from 'react-bootstrap';

export type EditorTabId = 1 | 2 | 3 | 4 | 5;

type Props = {
  activeTab: EditorTabId;
  setActiveTab: (tab: EditorTabId) => void
};

const TABS: [EditorTabId, string][] = [
  [1, 'Perustiedot'],
  [2, 'Ilmoittautumisasetukset'],
  [3, 'Kysymykset'],
  [4, 'Vahvistusviestit'],
  [5, 'Ilmoittautuneet'],
];

const EditorTabs = ({ activeTab, setActiveTab }: Props) => (
  <Nav variant="tabs" activeKey={activeTab} className="event-editor--nav">
    {TABS.map(([id, label]) => (
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
      </Nav.Item>
    ))}
  </Nav>
);

export default EditorTabs;
