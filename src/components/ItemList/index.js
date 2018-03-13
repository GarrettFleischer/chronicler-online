import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import SwapIcon from 'material-ui-icons/SwapVert';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import Align from '../Align';
import { setItemListSorting } from '../../reducers/uiReducer';
import { PropTypeId } from '../../data/datatypes';

const SortableItem = SortableElement(({ child }) => React.cloneElement(child, { sorting: true }));

const SortableList = SortableContainer(({ children }) => (
  <div>{React.Children.map(children, (child, index) => <SortableItem key={child.key} index={index} child={child} />)}</div>
));

// TODO use intl and stylesheet
const ItemList = ({ children, ui, setSorting, id, titleBar, handleAdd, handleSortEnd }) => (
  <div>
    <div style={{ marginBottom: '18px' }}>
      <Align container>
        <Align left>
          {titleBar}
        </Align>
        <Align right>
          {handleSortEnd && <IconButton onClick={setSorting(id, !ui.sorting[id])}><SwapIcon style={{ fill: ui.sorting[id] ? 'blue' : 'gray' }} /></IconButton>}
          {handleAdd && <IconButton onClick={handleAdd}><AddIcon /></IconButton>}
        </Align>
      </Align>
    </div>
    <div style={{ margin: 10 }}>
      {(!handleSortEnd || !ui.sorting[id]) && React.Children.map(children, (child) => React.cloneElement(child, { sorting: false }))}
      {(handleSortEnd && ui.sorting[id]) && <SortableList onSortEnd={handleSortEnd}>{children}</SortableList>}
    </div>
  </div>
);

ItemList.propTypes = {
  children: PropTypes.node.isRequired,
  ui: PropTypes.object.isRequired,
  setSorting: PropTypes.func.isRequired,
  id: PropTypeId.isRequired,
  titleBar: PropTypes.node,
  handleAdd: PropTypes.func,
  handleSortEnd: PropTypes.func,
};

ItemList.defaultProps = {
  handleAdd: null,
  handleSortEnd: null,
  titleBar: <div />,
};

const mapStateToProps = (state) => ({
  ui: state.ui.itemList,
});

const mapDispatchToProps = (dispatch) => ({
  setSorting: (id, sorting) => () => {
    dispatch(setItemListSorting(id, sorting));
  },
});

const methods = {
  componentWillMount: ({ id, setSorting }) => {
    setSorting(id, false)();
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(ItemList));
