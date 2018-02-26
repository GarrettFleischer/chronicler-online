import PropTypes from 'prop-types';
import React from 'react';
import ComponentList from '../ComponentList';
import Component from '../Component';
import { PropTypeId } from '../../data/datatypes';


const ComponentManager = ({ parent, components, reordering, onSortEnd }) => {
  if (reordering)
    return <ComponentList components={components} onSortEnd={onSortEnd} />;

  return (
    <div>
      {components.map((component) => (
        <Component key={component.id} parent={parent} item={component} reorder={false} />
    ))}
    </div>
  );
};


ComponentManager.propTypes = {
  parent: PropTypeId.isRequired,
  components: PropTypes.array.isRequired,
  reordering: PropTypes.bool.isRequired,
  onSortEnd: PropTypes.func.isRequired,
};


export default ComponentManager;
