import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import { Redirect, withRouter } from 'react-router-dom';
import Card, { CardContent } from 'material-ui/Card';
import GridList, { GridListTile } from 'material-ui/GridList';
import AddIcon from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import TabView, { makeTab } from '../../components/TabView';
import Variable from '../../components/Variable';
import { setActiveProject } from '../../reducers/uiReducer';
import { getProjects } from '../../data/state';
import { peek } from '../../lib/stack';
import Align from '../../components/Align';
import { addVariable } from '../../components/Variable/reducers';

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
const VariableList = ({ variables }) => (
  <div style={{ margin: 10 }}>
    {variables.map((variable) => (
      <Variable key={variable.id} variable={variable} />
    ))}
  </div>
);

VariableList.propTypes = {
  variables: PropTypes.array.isRequired,
};


// TODO use intl
const Project = ({ project, onAddVariable }) => {
  if (project === undefined)
    return <Redirect to="/404" />;

  return (
    <TabView
      id={'dashboard'}
      tabs={[
        makeTab('Scenes', <SceneGrid scenes={project.scenes || []} />),
        makeTab('Variables', (
          <div>
            <Align container>
              <Align right>
                <Tooltip title={'Add variable'}>
                  <IconButton onClick={onAddVariable(project.id)}><AddIcon /></IconButton>
                </Tooltip>
              </Align>
            </Align>
            <VariableList variables={project.variables} />
          </div>)
        ),
      ]}
    />
  );
};

Project.propTypes = {
  project: PropTypes.object,
// used in componentWillMount
// eslint-disable-next-line react/no-unused-prop-types
  activateProject: PropTypes.func.isRequired,
  onAddVariable: PropTypes.func.isRequired,
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
  onAddVariable: (id) => () => {
    dispatch(addVariable(id));
  },
});

const methods = ({
  componentWillMount: ({ project, activateProject }) => {
    activateProject(project.id);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(Project));
