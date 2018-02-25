import Card, { CardContent } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Align from '../Align';
import { choiceAddItem, choiceItemTextChanged } from './reducers';
import { renderLink } from '../Link';

// TODO use intl
// TODO draw internal components
const Choice = ({ item, onChoiceTextChanged, onAddChoiceClick }) => (
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
            <Align right>
              {renderLink(choice.link)}
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
  onAddChoiceClick: PropTypes.func.isRequired,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Choice);
