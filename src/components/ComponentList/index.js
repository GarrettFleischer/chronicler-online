import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Component from '../Component';


const SortableItem = SortableElement(({ value }) =>
  <Component item={value} reorder />,
);

const ComponentList = SortableContainer(({ components }) => (
  <div>
    {components.map((component, index) => (
      <SortableItem key={component.id} index={index} value={component} />
    ))}
  </div>
));

export default ComponentList;
