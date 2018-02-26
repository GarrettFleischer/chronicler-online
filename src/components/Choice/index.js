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
import { choiceAddItem, choiceItemTextChanged, choiceSortEnd } from './reducers';
import Link from '../Link';
import { setChoiceReordering } from '../../reducers/uiReducer';

const SortableItem = SortableElement(({ value }) => renderChoiceItem(value));

const ChoiceList = SortableContainer(({ choices }) => (
  <div>
    {choices.map((choice, index) => (
      <SortableItem key={choice.id} index={index} value={choice} />
    ))}
  </div>
));

const renderChoiceText = (choice, onChoiceTextChanged) => {
  if (!onChoiceTextChanged)
    return <text>{choice.text}</text>;

  return (<TextField
    onChange={(event) => onChoiceTextChanged(choice.id, event.target.value)}
    placeholder={'choice'}
    value={choice.text}
  />);
};

const renderChoiceItem = (choice, onChoiceTextChanged) => (
  <Card key={choice.id} style={{ marginTop: '5px' }}>
    <CardContent>
      <Align container>
        <Align left>
          {renderChoiceText(choice, onChoiceTextChanged)}
        </Align>
        <Align right>
          <Link item={choice.link} />
        </Align>
      </Align>
    </CardContent>
  </Card>
  );

const renderChoices = (item, reordering, onChoiceTextChanged, onSortEnd) => {
  if (reordering)
    return <ChoiceList choices={item.choices} onSortEnd={({ oldIndex, newIndex }) => onSortEnd(item.id, oldIndex, newIndex)} />;

  return item.choices.map((choice) => renderChoiceItem(choice, onChoiceTextChanged));
};

// TODO use intl
// TODO draw internal components
const Choice = ({ item, ui, onChoiceTextChanged, onSortEnd, onReorderClick, onAddChoiceClick }) => (
  <div>
    <Align container>
      <Align left><span>*choice</span></Align>
      <Align right>
        <Tooltip title="Reorder choices">
          <IconButton onClick={() => onReorderClick(ui.reordering)}><SwapIcon style={{ fill: ui.reordering ? 'blue' : 'gray' }} /></IconButton>
        </Tooltip>
        <Tooltip title="Add choice">
          <IconButton onClick={() => onAddChoiceClick(item.id)}><AddIcon /></IconButton>
        </Tooltip>
      </Align>
    </Align>
    {renderChoices(item, ui.reordering, onChoiceTextChanged, onSortEnd)}
  </div>
  );

Choice.propTypes = {
  item: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  onChoiceTextChanged: PropTypes.func.isRequired,
  onAddChoiceClick: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onReorderClick: PropTypes.func.isRequired,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Choice);
