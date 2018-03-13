import PropTypes from 'prop-types';
import React from 'react';
import AceEditor from 'react-ace';
import { connect } from 'react-redux';

import 'brace/mode/python';
import 'brace/theme/github';
import { textComponentChanged } from './reducers';


const Reorder = ({ item }) => (
  <text>{item.text}</text>
);

Reorder.propTypes = {
  item: PropTypes.object.isRequired,
};


const Text = ({ item, sorting, onChange }) => {
  if (sorting)
    return <Reorder item={item} />;

  // TODO render radio and checkbox options for line break and double line break before or after
  return (
    <AceEditor
      onChange={(text) => {
        onChange(item.id, text);
      }}
      value={item.text}
      mode="python"
      theme="github"
      name={item.id}
      editorProps={{ $blockScrolling: true }}
      height="75px"
      showGutter
    />
  );
};

Text.propTypes = {
  item: PropTypes.object.isRequired,
  sorting: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, text) => {
    dispatch(textComponentChanged(id, text));
  },
});

export default connect(() => ({}), mapDispatchToProps)(Text);

