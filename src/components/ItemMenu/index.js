import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import DeleteIcon from 'material-ui-icons/Delete';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { PropTypeId } from '../../data/datatypes';
import { setItemMenu } from '../../reducers/uiReducer';
import messages from './messages';

// parentId: id of container, id: id of item, handleDelete(parentId, id)
const ItemMenu = ({ parentId, itemId, handleDelete, children, ui, onShowMenu, onMenuItemClicked }) => {
  const options = [
    { icon: <DeleteIcon />, text: <FormattedMessage {...messages.delete} />, func: handleDelete },
  ];

  return (
    <div>
      <IconButton
        style={{ float: 'left', marginLeft: '-20px' }}
        aria-label="More"
        aria-owns={ui.anchorEl ? itemId : null}
        aria-haspopup="true"
        onClick={(event) => onShowMenu(event.currentTarget, itemId)}
      >
        <MoreVertIcon />
      </IconButton>
      {children}
      <Menu
        id={itemId}
        anchorEl={ui.anchorEl}
        open={Boolean(ui.anchorEl) && ui.showMenu === itemId}
        onClose={onMenuItemClicked}
      >
        {options.map((option) => (
          <MenuItem
            key={option.text}
            onClick={() => {
              onMenuItemClicked();
              option.func(parentId, itemId);
            }}
          >
            {option.text}
            {option.icon}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

ItemMenu.propTypes = {
  parentId: PropTypeId.isRequired,
  itemId: PropTypeId.isRequired,
  handleDelete: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  ui: PropTypes.object.isRequired,
  onShowMenu: PropTypes.func.isRequired,
  onMenuItemClicked: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
  ui: state.ui.itemMenu,
});

const mapDispatchToProps = (dispatch) => ({
  onShowMenu: (anchorEl, id) => {
    dispatch(setItemMenu(anchorEl, id));
  },
  onMenuItemClicked: () => {
    dispatch(setItemMenu(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemMenu);
