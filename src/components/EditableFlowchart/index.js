import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';


const EditableFlowchart = ({ scenes, ui }) => {
  const onSomething = () => {};

  return (
    <div>

    </div>
  );
};

EditableFlowchart.propTypes = {
  scenes: PropTypes.arrayOf(PropTypes.object).isRequired,
};


const mapStateToProps = (state, ui) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(EditableFlowchart);
