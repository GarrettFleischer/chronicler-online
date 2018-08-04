import React, { Component as ReactComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Nodes } from '../../../both/api/nodes/nodes';
import { Page } from './Page';
import { Component } from '../Component';
import { addTextComponent, TEXT, updateComponentOrder } from '../../../both/api/components/components';

const COMPONENT_ZONE = 'COMPONENT_ZONE';
const NODE_ZONE = 'NODE_ZONE';


const componentList = [
  { id: 0, type: TEXT, data: { text: 'Story' } },
  { id: 1, type: TEXT, data: { text: 'Set Variable' } }, // TODO change type to SET
];

// a little function to help us with reordering the result


/**
 * Moves an item from one list to another list.
 */


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: '95%',
});


class NodeUI extends ReactComponent {
  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) return;

    if (source.droppableId === NODE_ZONE && source.droppableId === destination.droppableId) this.reorder(source.index, destination.index);
    else this.move(source, destination);
  };

  reorder = (startIndex, endIndex) => {
    const result = Array.from(this.props.components);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.forEach((component, index) => {
      if (component.order !== index) updateComponentOrder(component._id, index);
    });
  };

  move = (droppableSource, droppableDestination) => {
    const { node, components } = this.props;
    const sourceClone = Array.from(componentList);
    const destClone = Array.from(components);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, item);

    switch (item.type) {
      case TEXT:
        addTextComponent(node._id, droppableDestination.index);
        destClone.forEach((component, index) => {
          if (component._id && component.order !== index) updateComponentOrder(component._id, index);
        });
        break;
      default:
        break;
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { components } = this.props;
    components.sort((a, b) => a.order - b.order);
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Page>
          <Grid container spacing={16}>
            <Grid item xs>
              <Droppable droppableId={COMPONENT_ZONE}>
                {(dropProvided, dropSnapshot) => (
                  <div
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                  >
                    {componentList.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <Component component={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
            <Grid item xs={6}>
              <Droppable droppableId={NODE_ZONE}>
                {(dropProvided, dropSnapshot) => (
                  <div
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                  >
                    {components.map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                          >
                            <Component component={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </Grid>
            <Grid item xs />
          </Grid>
        </Page>
      </DragDropContext>
    );
  }
}

NodeUI.propTypes = {
  node: PropTypes.object,
  components: PropTypes.array,
};

NodeUI.defaultProps = {
  node: null,
  components: [],
};

const mapTrackerToProps = () => {
  const node = Nodes.findOne({ _id: FlowRouter.getParam('id') });
  return {
    node,
    components: node ? node.components() : undefined,
  };
};

export const Node = withTracker(mapTrackerToProps)(NodeUI);
