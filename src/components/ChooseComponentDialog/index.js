import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import {
  setChooseComponentDialogValue, setShowChooseComponentDialog } from '../../reducers/uiReducer';
import { SET, TEXT } from '../../data/datatypes';

// TODO use intl
const components = [
  { type: TEXT, text: 'text' },
  { type: SET, text: '*set' },
];

const ChooseComponentDialog = ({ handleClose, ui, setValue, onClose }) => (
  <Dialog
    open={ui.show}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Choose Component</DialogTitle>
    <DialogContent>
      <List>
        {components.map((item) => (
          <ListItem key={item.type} button onClick={() => setValue(item.type)}>
            <ListItemText inset primary={item.text} />
            <Checkbox checked={item.type === ui.value} />
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          onClose();
          handleClose(ui.value);
        }}
        color="primary"
      >
        Select
      </Button>
    </DialogActions>
  </Dialog>
);

ChooseComponentDialog.propTypes = {
  // PropTypeId is used in mapStateToProps
  ui: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.chooseComponentDialog,
});

const mapDispatchToProps = (dispatch) => ({
  setValue: (value) => {
    dispatch(setChooseComponentDialogValue(value));
  },
  onClose: () => {
    dispatch(setShowChooseComponentDialog(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseComponentDialog);
