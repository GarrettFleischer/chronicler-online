import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import { Redirect, withRouter } from 'react-router-dom';
import Card, { CardContent } from 'material-ui/Card';
import GridList, { GridListTile } from 'material-ui/GridList';
import { setActiveProject } from '../../reducers/uiReducer';
import TabView, { makeTab } from '../../components/TabView';
import { getProjects } from '../../data/state';
import { peek } from '../../lib/stack';

const SceneGrid = withRouter(({ history, scenes }) => (
  <GridList cellHeight={160} cols={3}>
    {scenes.map((scene) => (
      <GridListTile key={scene.id} cols={1}>
        <Card style={{ margin: 5 }} onClick={() => history.push(`/scene/${scene.id}`)}>
          <CardContent>{scene.name}</CardContent>
        </Card>
      </GridListTile>
    ))}
  </GridList>
));

SceneGrid.propTypes = {
  scenes: PropTypes.array.isRequired,
};

// TODO use intl
const Project = ({ project }) => {
  if (project === undefined)
    return <Redirect to="/404" />;

  return (
    <TabView
      id={'dashboard'}
      tabs={[
        makeTab('Scenes', <SceneGrid scenes={project.scenes || []} />),
        makeTab('Variables', <div />),
      ]}
    />
  );
};

Project.propTypes = {
  project: PropTypes.object,
// used in componentWillMount
// eslint-disable-next-line react/no-unused-prop-types
  activateProject: PropTypes.func.isRequired,
};

Project.defaultProps = {
  project: null,
};


const mapStateToProps = (state, props) => ({
  project: peek((getProjects(state)).filter((project) => project.id === props.match.params.id)),
});

const mapDispatchToProps = (dispatch) => ({
  activateProject: (id) => {
    dispatch(setActiveProject(id));
  },
});

const methods = ({
  componentWillMount: ({ project, activateProject }) => {
    activateProject(project.id);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(Project));
