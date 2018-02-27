/**
 *
 * Component
 *
 */

import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import DeleteIcon from 'material-ui-icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Text from '../Text';
import SetAction from '../SetAction';
import { TEXT, SET, PropTypeId } from '../../data/datatypes';
import { nodeDeleteComponent } from '../../containers/Node/reducers';
import ItemMenu from '../ItemMenu';

const styleSheet = (theme) => ({
  component: {
    margin: theme.spacing.unit,
  },
});

const UnknownComponent = () => (
  <Card>
    <CardContent>
      <div><FormattedMessage {...messages.unknown} /></div>
    </CardContent>
  </Card>
);

const renderItem = (item, reorder) => {
  switch (item.type) {
    case TEXT:
      return <Text item={item} reorder={reorder} />;

    case SET:
      return <SetAction item={item} reorder={reorder} />;

    default:
      return <UnknownComponent />;
  }
};

const Component = ({ parentId, item, reorder, classes, onDeleteClicked }) => (
  <div>
    <Card className={classes.component}>
      <CardContent>
        <ItemMenu parentId={parentId} itemId={item.id} handleDelete={onDeleteClicked}>
          {renderItem(item, reorder)}
        </ItemMenu>
      </CardContent>
    </Card>
  </div>
  );

Component.propTypes = {
  parentId: PropTypeId.isRequired,
  item: PropTypes.object.isRequired,
  reorder: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.component,
});
const mapDispatchToProps = (dispatch) => ({
  onDeleteClicked: (parentId, id) => {
    dispatch(nodeDeleteComponent(parentId, id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Component));
