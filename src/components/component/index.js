/**
 *
 * Component
 *
 */

// import styled from 'styled-components';

import DragHandle from 'material-ui-icons/DragHandle';
import Card, { CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DataType } from '../../data/nodes';
import messages from './messages';


function content(item) {
  switch (item.type) {
    case DataType.TEXT:
      return <div style={{ paddingTop: '10px' }}>{`text ${item.id.toString()}: ${item.text}`}</div>;
    case DataType.NEXT:
      return <div style={{ paddingTop: '10px' }}>{`next ${item.id.toString()}: ${item.text}`}</div>;
    default:
      return <div><FormattedMessage {...messages.unknown} /></div>;
  }
}


export default class Component extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // noinspection JSUnusedGlobalSymbols
  getDragHeight() {
    return 48;
  }


  render() {
    const { dragHandle, item } = this.props;
    return (
      <Card>
        <CardContent>
          <Grid container gutter={8}>
            <Grid item xs={1}>
              <DragHandle />
              {/*{dragHandle(<DragHandle />)}*/}
            </Grid>
            <Grid item xl>
              {content(item)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}


Component.propTypes = {
  dragHandle: PropTypes.func,
  item: PropTypes.object.isRequired,
};
