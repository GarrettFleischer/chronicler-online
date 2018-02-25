import LinkIcon from 'material-ui-icons/Link';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/ButtonBase';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { nodeLinkChanged } from './reducers';
import { NODE } from '../../data/datatypes';
import { findById, getNodeName } from '../../data/core';
import { getActiveProject } from '../../data/state';
import ChooseNodeDialog from '../ChooseNodeDialog';
import { setChooseNodeDialogValue, setShowChooseNodeDialog } from '../../reducers/uiReducer';
import Align from '../Align';


const NodeLink = ({ item, onLinkItemClicked, onChange }) => (
  <Align container>
    <Align center>
      <Button onClick={() => onLinkItemClicked(item.id, item.node.id)}>{getNodeName(item.node)}</Button>
      <RouterLink to={`/node/${item.node.id}`} style={{ color: 'black' }}><IconButton color="inherit"><LinkIcon /></IconButton></RouterLink>
      <ChooseNodeDialog
        id={item.id}
        handleClose={(value) => {
          onChange(item.id, value);
        }}
      />
    </Align>
  </Align>
);

NodeLink.propTypes = {
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onLinkItemClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  item: {
    ...props.item,
    node: findById(getActiveProject(state), props.item.node, NODE),
  },
});

const mapDispatchToProps = (dispatch) => ({
  onLinkItemClicked: (dialogId, value) => {
    dispatch(setChooseNodeDialogValue(value));
    dispatch(setShowChooseNodeDialog(dialogId));
  },
  onChange: (id, value) => {
    dispatch(nodeLinkChanged(id, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeLink);

