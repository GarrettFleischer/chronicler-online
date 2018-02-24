import Card, { CardContent } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';
import SwapIcon from 'material-ui-icons/SwapVert';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Align from '../Align';
import { choiceItemTextChanged } from './reducers';

// TODO use intl
// TODO draw internal components
const Choice = ({ item, onChoiceTextChanged, onSortEnd, onSortClick, onAddChoiceClick, onAddComponentClick }) => (
  <div>
    <Align container>
      <Align left><span>*choice</span></Align>
      <Align right>
        <Tooltip title="Add choice">
          <IconButton onClick={() => onAddChoiceClick(item.id)}><AddIcon /></IconButton>
        </Tooltip>
      </Align>
    </Align>
    {item.choices.map((choice) => (
      <Card key={choice.id} style={{ marginTop: '5px' }}>
        <CardContent>
          <Align container>
            <Align left>
              <TextField
                onChange={(event) => onChoiceTextChanged(choice.id, event.target.value)}
                placeholder={'choice'}
                value={choice.text}
              />
            </Align>
          </Align>
        </CardContent>
      </Card>
      ))}
  </div>
  );

Choice.propTypes = {
  item: PropTypes.object.isRequired,
  onChoiceTextChanged: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onSortClick: PropTypes.func.isRequired,
  onAddChoiceClick: PropTypes.func.isRequired,
  onAddComponentClick: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  onChoiceTextChanged: (id, text) => {
    dispatch(choiceItemTextChanged(id, text));
  },
  onSortEnd: (id, oldIndex, newIndex) => {
    // dispatch();
  },
  onSortClick: (id) => {
    // dispatch();
  },
  onAddChoiceClick: (id) => {
    // dispatch();
  },
  onAddComponentClick: (id) => {
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Choice);
