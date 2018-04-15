import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Files from 'react-files';
import {
  setShowCreateProject, setNameCreateProject, createProjectFileLoaded,
  setTabCreateProject, VALUE_NEW_PROJECT, VALUE_IMPORT_PROJECT,
} from '../../reducers/uiReducer';
import TabView, { makeTab } from '../TabView';
import { readFileAsync } from '../../sagas/filesystemSaga';

const createButtonText = (type) => {
  if (type === VALUE_IMPORT_PROJECT)
    return 'Import';

  return 'Create';
};

// TODO use intl
const CreateProjectDialog = ({ handleClose, ui, setTab, setName, readFile, onClose }) => (
  <Dialog
    open={ui.show}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Create or Import Project</DialogTitle>
    <DialogContent>
      <div style={{ width: '500px', height: '500px' }}>
        <TabView
          onTabChange={setTab}
          id={'create_project_dialog_tab_view'}
          tabs={[
            makeTab('Create', <div />),
            makeTab('Import',
              <Files
                style={{ width: '100%', height: '450px' }}
                onChange={(files) => files.map((file) => readFile(file))}
                onError={(err) => console.log('error: ', err.message)}
                accepts={['.txt']}
                multiple
                clickable
              >
                Drop scene files here or click to upload
                { ui.value.scenes.map((scene) => <div key={scene.name}>{scene.name}</div>) }
              </Files>
            ),
          ]}
        />
      </div>
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
        {createButtonText(ui.value.type)}
      </Button>
    </DialogActions>
  </Dialog>
  );

CreateProjectDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  setTab: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  readFile: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.createProjectDialog,
});

const mapDispatchToProps = (dispatch) => ({
  setTab: (tab) => {
    dispatch(setTabCreateProject(tab));
  },
  setName: (value) => {
    dispatch(setNameCreateProject(value));
  },
  readFile: (file) => {
    dispatch(readFileAsync(file, createProjectFileLoaded));
  },
  onClose: () => {
    dispatch(setShowCreateProject(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectDialog);
