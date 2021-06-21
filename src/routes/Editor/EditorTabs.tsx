import React from 'react';

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
  <ul className="event-editor--nav nav nav-tabs">
    {TABS.map(([id, label]) => (
      <li className={activeTab === id ? 'active' : undefined}>
        <button
          type="button"
          onClick={() => setActiveTab(1)}
          role="tab"
          aria-selected={activeTab === id}
          aria-controls={`editor-tab-${id}`}
        >
          {label}
        </button>
      </li>
    ))}
  </ul>
);

export default EditorTabs;
