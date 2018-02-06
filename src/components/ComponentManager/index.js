import PropTypes from 'prop-types';
import React from 'react';
import ComponentList from '../ComponentList';
import Component from '../Component';


const ComponentManager = ({ components, reordering, onSortEnd }) => {
  if (reordering)
    return <ComponentList components={components} onSortEnd={onSortEnd} />;

  return (
    <div>
      {components.map((component) => (
        <Component key={component.id} item={component} reorder={false} />
    ))}
    </div>
  );
};


ComponentManager.propTypes = {
  components: PropTypes.array.isRequired,
  reordering: PropTypes.bool.isRequired,
  onSortEnd: PropTypes.func.isRequired,
};


export default ComponentManager;
