import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';


const SortableItem = SortableElement(({ value }) =>
  <div>{value}</div>,
);

const SortableList = SortableContainer(({ items }) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </div>
  );
});

export default SortableList;