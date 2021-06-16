import React from 'react';

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span className="handler" />);

const SortableItem = SortableElement(({ value }) => (
  <div className="panel panel-default">
    <DragHandle />
    {value}
  </div>
));

export const SortableItems = SortableContainer(({ collection, items }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem
        collection={collection}
        key={index}
        index={index}
        value={value}
      />
    ))}
  </div>
));
