import React from 'react';

const EditorTabs = ({ activeTab, setActiveTab }) => (
  <ul className="event-editor--nav nav nav-tabs">
    <li className={activeTab === 1 ? 'active' : undefined}>
      <a onClick={() => setActiveTab(1)}>Perustiedot</a>
    </li>
    <li className={activeTab === 2 ? 'active' : undefined}>
      <a onClick={() => setActiveTab(2)}>Ilmoittautumisasetukset</a>
    </li>
    <li className={activeTab === 3 ? 'active' : undefined}>
      <a onClick={() => setActiveTab(3)}>Kysymykset</a>
    </li>
    <li className={activeTab === 4 ? 'active' : undefined}>
      <a onClick={() => setActiveTab(4)}>Vahvistusviestit</a>
    </li>
    <li className={activeTab === 5 ? 'active' : undefined}>
      <a onClick={() => setActiveTab(5)}>Ilmoittautuneet</a>
    </li>
  </ul>
);

export default EditorTabs;
