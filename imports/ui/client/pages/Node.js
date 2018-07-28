import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Nodes } from '../../../api/nodes/nodes';
import { Page } from './Page';

const componentList = [
  'Story',
  'Set Variable',
];

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  // const sourceClone = Array.from(source);
  // const destClone = Array.from(destination);
  // // const [removed] = sourceClone.splice(droppableSource.index, 1);
  //
  // destClone.splice(droppableDestination.index, 0, sourceClone[droppableSource.index]);
  //
  // const result = {};
  // result[droppableSource.droppableId] = sourceClone;
  // result[droppableDestination.droppableId] = destClone;
  //
  // return result;
};

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


class NodeUI extends Component {
  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) return;


    if (source.droppableId === destination.droppableId) {
      // reorder
    } else {
      // move
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { items, selected } = this.state;


    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Page>
          <Grid container spacing={16}>
            <Grid item xs>
              <Droppable droppableId="droppable">
                {(dropProvided, dropSnapshot) => (
                  <div
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
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
                            {item.content}
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
              <Droppable droppableId="droppable2">
                {(dropProvided, dropSnapshot) => (
                  <div
                    ref={dropProvided.innerRef}
                    style={getListStyle(dropSnapshot.isDraggingOver)}
                  >
                    {selected.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
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
                            {item.content}
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
  components: null,
};

const mapTrackerToProps = () => {
  const node = Nodes.findOne({ _id: FlowRouter.getParam('id') });
  return {
    node,
    components: node ? node.components() : undefined,
  };
};

export const Node = withTracker(mapTrackerToProps)(NodeUI);
