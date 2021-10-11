import React from 'react';

import { EditorTab } from './EditorTabHeader';

type Props = {
  id: EditorTab;
  activeTab: EditorTab;
  component: React.ComponentType;
};

const EditorTabBody = ({ id, activeTab, component: Component }: Props) => (
  <div
    className={`tab-pane ${activeTab === id ? 'active' : ''}`}
    role="tabpanel"
    id={`editor-tab-${id}`}
  >
    <Component />
  </div>
);

export default EditorTabBody;
