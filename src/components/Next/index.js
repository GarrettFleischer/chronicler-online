import LinkIcon from 'material-ui-icons/Link';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import 'brace/mode/python';
import 'brace/theme/github';
import { textComponentChanged } from './reducers';
import { GOTO, NODE, NODE_LINK } from '../../data/datatypes';
import Align from '../Align';
import { findById } from '../../data/core';
import { getActiveProject } from '../../data/state';


const Reorder = ({ item }) => (
  <Card>
    <CardContent>
      <text>link component</text>
    </CardContent>
  </Card>
);

Reorder.propTypes = {
  item: PropTypes.object.isRequired,
};

const NextType = ({ item, onChange }) => {
  switch (item.type) {
    case NODE_LINK:
      return (
        <Tooltip title={item.node.label}>
          <IconButton color="inherit"><LinkIcon /></IconButton>
        </Tooltip>
      );

    default:
      return <text>link component</text>;
  }
};

const Next = ({ item, reorder, onChange }) => {
  if (reorder)
    return <Reorder item={item} />;

  return (
    <Align container>
      <Align center>
        <NextType item={item} onChange={onChange} />
      </Align>
    </Align>
  );
};

Next.propTypes = {
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  item: {
    ...props.item,
    node: findById(getActiveProject(state), props.item.node, NODE),
  },
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, text) => {
    dispatch(textComponentChanged(id, text));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Next);

