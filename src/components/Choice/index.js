import Card, { CardContent } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';
import SwapIcon from 'material-ui-icons/SwapVert';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Align from '../Align';
import { choiceAddItem, choiceDeleteItem, choiceItemTextChanged, choiceSortEnd } from './reducers';
import Link from '../Link';
import { setChoiceReordering } from '../../reducers/uiReducer';
import ItemMenu from '../ItemMenu';
import ItemList from '../ItemList';


// TODO use intl
const renderChoiceText = (choice, onChoiceTextChanged) => {
  if (!onChoiceTextChanged)
    return <text>{choice.text}</text>;

  return (<TextField
    onChange={(event) => onChoiceTextChanged(choice.id, event.target.value)}
    placeholder={'choice'}
    value={choice.text}
  />);
};


const ChoiceItem = ({ choice, onChoiceTextChanged, onDeleteClicked, sorting }) => (
  <Card style={{ marginTop: '5px' }}>
    <CardContent>
      <ItemMenu itemId={choice.id} handleDelete={onDeleteClicked}>
        <Align container>
          <Align left>
            {renderChoiceText(choice, !sorting && onChoiceTextChanged)}
          </Align>
          <Align right>
            <Link item={choice.link} />
          </Align>
        </Align>
      </ItemMenu>
    </CardContent>
  </Card>
);

ChoiceItem.propTypes = {
  choice: PropTypes.object.isRequired,
  onChoiceTextChanged: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
  sorting: PropTypes.bool,
};

ChoiceItem.defaultProps = {
  sorting: false,
};


// TODO use intl
// TODO draw internal components
const Choice = ({ item, onChoiceTextChanged, onSortEnd, onAddChoiceClick, onDeleteClicked }) => (
  <div>
    <ItemList
      id={item.id}
      titleBar={'*choice'}
      handleAdd={onAddChoiceClick(item.id)}
      handleSortEnd={onSortEnd(item.id)}
    >
      {item.choices.map((choice) => (
        <ChoiceItem
          key={choice.id}
          choice={choice}
          onChoiceTextChanged={onChoiceTextChanged}
          onDeleteClicked={onDeleteClicked}
        />)
      )}
    </ItemList>
  </div>
  );

Choice.propTypes = {
  item: PropTypes.object.isRequired,
  onChoiceTextChanged: PropTypes.func.isRequired,
  onAddChoiceClick: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.choice,
});

const mapDispatchToProps = (dispatch) => ({
  onChoiceTextChanged: (id, text) => {
    dispatch(choiceItemTextChanged(id, text));
  },
  onAddChoiceClick: (id) => () => {
    dispatch(choiceAddItem(id));
  },
  onSortEnd: (id) => ({ oldIndex, newIndex }) => {
    dispatch(choiceSortEnd(id, oldIndex, newIndex));
  },
  onDeleteClicked: (id) => {
    dispatch(choiceDeleteItem(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Choice);
