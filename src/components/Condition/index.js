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
import { conditionAddItem, conditionDeleteItem, conditionItemTextChanged, conditionSortEnd } from './reducers';
import Link from '../Link';
import { setConditionSorting } from '../../reducers/uiReducer';
import ItemMenu from '../ItemMenu';
import { ELSE, ELSEIF } from '../../data/datatypes';

const SortableItem = SortableElement(({ value }) => renderConditionItem(value));

const ChoiceList = SortableContainer(({ choices }) => (
  <div>
    {choices.map((choice, index) => (
      <SortableItem key={choice.id} index={index} value={choice} />
    ))}
  </div>
));

// TODO use intl
const renderConditionText = (item, onConditionTextChanged) => {
  if (!onConditionTextChanged)
    return <text>{item.condition}</text>;

  return (<TextField
    onChange={(event) => onConditionTextChanged(item.id, event.target.value)}
    placeholder={'condition'}
    value={item.condition}
  />);
};

const conditionTypeText = (item) => {
  switch (item.type) {
    case ELSEIF:
      return '*else if';
    case ELSE:
      return '*else';
    default:
      return '*if';
  }
};

const renderConditionItem = (item, parentId, onConditionTextChanged, onDeleteClicked) => (
  <Card key={item.id} style={{ marginTop: '5px' }}>
    <CardContent>
      <ItemMenu parentId={parentId} itemId={item.id} handleDelete={onDeleteClicked}>
        <Align container>
          <Align left>
            <text style={{ marginRight: '8px' }}>{conditionTypeText(item)}</text>
            {renderConditionText(item, onConditionTextChanged)}
          </Align>
          <Align right>
            <Link item={item.link} />
          </Align>
        </Align>
      </ItemMenu>
    </CardContent>
  </Card>
);

const renderConditions = (item, sorting, onConditionTextChanged, onSortEnd, onDeleteClicked) => {
  if (sorting)
    return <ChoiceList choices={item.conditions} onSortEnd={({ oldIndex, newIndex }) => onSortEnd(item.id, oldIndex, newIndex)} />;

  return item.conditions.map((condition) => renderConditionItem(condition, item.id, onConditionTextChanged, onDeleteClicked));
};

// TODO use intl
// TODO draw internal components
const Condition = ({ item, ui, onConditionTextChanged, onSortEnd, onReorderClick, onAddChoiceClick, onDeleteClicked }) => (
  <div>
    <Align container>
      <Align left><span>*choice</span></Align>
      <Align right>
        <Tooltip title="reorder conditions">
          <IconButton onClick={() => onReorderClick(ui.sorting)}><SwapIcon style={{ fill: ui.sorting ? 'blue' : 'gray' }} /></IconButton>
        </Tooltip>
        <Tooltip title="add condition">
          <IconButton onClick={() => onAddChoiceClick(item.id)}><AddIcon /></IconButton>
        </Tooltip>
      </Align>
    </Align>
    {renderConditions(item, ui.sorting, onConditionTextChanged, onSortEnd, onDeleteClicked)}
  </div>
);

Condition.propTypes = {
  item: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  onConditionTextChanged: PropTypes.func.isRequired,
  onAddChoiceClick: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onReorderClick: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.condition,
});

const mapDispatchToProps = (dispatch) => ({
  onConditionTextChanged: (id, text) => {
    dispatch(conditionItemTextChanged(id, text));
  },
  onAddChoiceClick: (id) => {
    dispatch(conditionAddItem(id));
  },
  onSortEnd: (id, oldIndex, newIndex) => {
    dispatch(conditionSortEnd(id, oldIndex, newIndex));
  },
  onReorderClick: (sorting) => {
    dispatch(setConditionSorting(!sorting));
  },
  onDeleteClicked: (parentId, id) => {
    dispatch(conditionDeleteItem(parentId, id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Condition);
