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
// import { setShowChooseNodeDialog } from '../../reducers/uiReducer';
import { getActiveProject } from '../../data/state';
import { setChooseNodeDialogValue, setShowChooseNodeDialog } from '../../reducers/uiReducer';


const nodeName = (node) => node.label === '' ? node.id : node.label;

const nodeItem = (node, value, setValue) => (
  <ListItem
    key={node.id}
    button
    dense
    onClick={() => {
      setValue(node.id);
    }}
  >
    <ListItemText inset primary={nodeName(node)} />
    <Checkbox checked={node.id === value} />
  </ListItem>
);

const ChooseNodeDialog = ({ open, scenes, value, setValue, onClose, handleClose }) => (
  <Dialog
    open={open}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Choose Node</DialogTitle>
    <DialogContent>
      <List>
        {scenes.map((scene) => (
          <div key={scene.id}>
            <ListItem><ListItemText primary={scene.name} /></ListItem>
            <List component="div" disablePadding>
              {scene.nodes.map((node) => nodeItem(node, value, setValue))}
            </List>
          </div>
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
          handleClose(value);
        }}
        color="primary"
      >
          Select
      </Button>
    </DialogActions>
  </Dialog>
  );

ChooseNodeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  scenes: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  open: state.ui.link.showChooseNodeDialog,
  value: state.ui.link.chooseNodeDialogValue,
  scenes: (getActiveProject(state)).scenes,
});

const mapDispatchToProps = (dispatch) => ({
  setValue: (value) => {
    dispatch(setChooseNodeDialogValue(value));
  },
  onClose: () => {
    dispatch(setShowChooseNodeDialog(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChooseNodeDialog);
