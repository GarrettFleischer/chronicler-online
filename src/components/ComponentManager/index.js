import PropTypes from 'prop-types';
import React from 'react';
import ComponentList from '../ComponentList';
import Component from '../Component';
import { PropTypeId } from '../../data/datatypes';


const ComponentManager = ({ parentId, components, reordering, onSortEnd }) => {
  if (reordering)
    return <ComponentList components={components} onSortEnd={onSortEnd} />;

  return (
    <div>
      {components.map((component) => (
        <Component key={component.id} parentId={parentId} item={component} reorder={false} />
    ))}
    </div>
  );
};


ComponentManager.propTypes = {
  parentId: PropTypeId.isRequired,
  components: PropTypes.array.isRequired,
  reordering: PropTypes.bool.isRequired,
  onSortEnd: PropTypes.func.isRequired,
};


export default ComponentManager;
