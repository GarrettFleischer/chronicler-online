/**
 *
 * Component
 *
 */

import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Text from '../Text';
import SetAction from '../SetAction';
import { TEXT, SET } from '../../data/datatypes';
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

const renderItem = (item, sorting) => {
  switch (item.type) {
    case TEXT:
      return <Text item={item} sorting={sorting} />;

    case SET:
      return <SetAction item={item} sorting={sorting} />;

    default:
      return <UnknownComponent />;
  }
};

const Component = ({ item, sorting, classes, onDeleteClicked }) => (
  <div>
    <Card className={classes.component}>
      <CardContent>
        <ItemMenu itemId={item.id} handleDelete={onDeleteClicked}>
          {renderItem(item, sorting)}
        </ItemMenu>
      </CardContent>
    </Card>
  </div>
  );

Component.propTypes = {
  item: PropTypes.object.isRequired,
  sorting: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ui: state.ui.component,
});
const mapDispatchToProps = (dispatch) => ({
  onDeleteClicked: (id) => {
    dispatch(nodeDeleteComponent(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Component));
