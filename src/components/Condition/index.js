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

const SortableItem = SortableElement(({ value }) => renderChoiceItem(value));

const ChoiceList = SortableContainer(({ choices }) => (
  <div>
    {choices.map((choice, index) => (
      <SortableItem key={choice.id} index={index} value={choice} />
    ))}
  </div>
));

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

const renderChoiceItem = (choice, parentId, onChoiceTextChanged, onDeleteClicked) => (
  <Card key={choice.id} style={{ marginTop: '5px' }}>
    <CardContent>
      <ItemMenu parentId={parentId} itemId={choice.id} handleDelete={onDeleteClicked}>
        <Align container>
          <Align left>
            {renderChoiceText(choice, onChoiceTextChanged)}
          </Align>
          <Align right>
            <Link item={choice.link} />
          </Align>
        </Align>
      </ItemMenu>
    </CardContent>
  </Card>
);

const renderChoices = (item, reordering, onChoiceTextChanged, onSortEnd, onDeleteClicked) => {
  if (reordering)
    return <ChoiceList choices={item.choices} onSortEnd={({ oldIndex, newIndex }) => onSortEnd(item.id, oldIndex, newIndex)} />;

  return item.choices.map((choice) => renderChoiceItem(choice, item.id, onChoiceTextChanged, onDeleteClicked));
};

// TODO use intl
// TODO draw internal components
const Condition = ({ item, ui, onChoiceTextChanged, onSortEnd, onReorderClick, onAddChoiceClick, onDeleteClicked }) => (
  <div>
    <Align container>
      <Align left><span>*choice</span></Align>
      <Align right>
        <Tooltip title="reorder choices">
          <IconButton onClick={() => onReorderClick(ui.reordering)}><SwapIcon style={{ fill: ui.reordering ? 'blue' : 'gray' }} /></IconButton>
        </Tooltip>
        <Tooltip title="add choice">
          <IconButton onClick={() => onAddChoiceClick(item.id)}><AddIcon /></IconButton>
        </Tooltip>
      </Align>
    </Align>
    {renderChoices(item, ui.reordering, onChoiceTextChanged, onSortEnd, onDeleteClicked)}
  </div>
);

Condition.propTypes = {
  item: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  onChoiceTextChanged: PropTypes.func.isRequired,
  onAddChoiceClick: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onReorderClick: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.choice,
});

const mapDispatchToProps = (dispatch) => ({
  onChoiceTextChanged: (id, text) => {
    dispatch(choiceItemTextChanged(id, text));
  },
  onAddChoiceClick: (id) => {
    dispatch(choiceAddItem(id));
  },
  onSortEnd: (id, oldIndex, newIndex) => {
    dispatch(choiceSortEnd(id, oldIndex, newIndex));
  },
  onReorderClick: (reordering) => {
    dispatch(setChoiceReordering(!reordering));
  },
  onDeleteClicked: (parentId, id) => {
    dispatch(choiceDeleteItem(parentId, id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Condition);
