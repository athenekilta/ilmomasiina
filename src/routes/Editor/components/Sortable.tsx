import React, { ReactNode } from 'react';

import {
  Offset,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => <span className="handler" />);

type SortableItemProps = {
  value: ReactNode;
};

const SortableItem = SortableElement(({ value }: SortableItemProps) => (
  <div className="panel panel-default">
    <DragHandle />
    {value}
  </div>
));

type SortableItemsProps = {
  collection: Offset;
  items: JSX.Element[];
};

const Sortable = SortableContainer(({ collection, items }: SortableItemsProps) => (
  <div>
    {items.map((value, index) => (
      <SortableItem
        collection={collection}
        key={value.key}
        index={index}
        value={value}
      />
    ))}
  </div>
));

export default Sortable;
