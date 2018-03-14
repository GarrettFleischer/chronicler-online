import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import { Redirect, withRouter } from 'react-router-dom';
import Card, { CardContent } from 'material-ui/Card';
import GridList, { GridListTile } from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import TabView, { makeTab } from '../../components/TabView';
import Variable from '../../components/Variable';
import { setActiveProject } from '../../reducers/uiReducer';
import { getProjects } from '../../data/state';
import { peek } from '../../lib/stack';
import { addVariable } from '../../components/Variable/reducers';
import ItemList from '../../components/ItemList';
import { setProjectAuthor, setProjectTitle } from './reducers';

const SceneGrid = withRouter(({ history, scenes }) => (
  <GridList cellHeight={75} cols={2}>
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
const VariableList = ({ variables, onAddVariable }) => (
  <ItemList handleAdd={onAddVariable}>
    {variables.map((variable) => (
      <Variable key={variable.id} variable={variable} />
    ))}
  </ItemList>
);

VariableList.propTypes = {
  variables: PropTypes.array.isRequired,
  onAddVariable: PropTypes.func.isRequired,
};


// TODO use intl
const Project = ({ project, onAddVariable, onTitleChange, onAuthorChange }) => {
  if (project === undefined)
    return <Redirect to="/404" />;

  return (
    <TabView
      id={'dashboard'}
      tabs={[
        makeTab('Scenes', <SceneGrid scenes={project.scenes || []} />),
        makeTab('Variables', (
          <ItemList id={project.id} handleAdd={onAddVariable(project.id)}>
            {project.variables.map((variable) => (
              <Variable key={variable.id} variable={variable} />
            ))}
          </ItemList>
          )),
        makeTab('Settings', (
          <div style={{ margin: 20 }}>
            <div style={{ marginBottom: 18 }}>
              <TextField
                onChange={onTitleChange(project.id)}
                value={project.title}
                error={!project.title.length}
                label="Title"
              />
            </div>
            <div>
              <TextField
                onChange={onAuthorChange(project.id)}
                value={project.author}
                error={!project.author.length}
                label="Author"
              />
            </div>
          </div>
        )),
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
  onTitleChange: PropTypes.func.isRequired,
  onAuthorChange: PropTypes.func.isRequired,
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
  onTitleChange: (id) => (event) => {
    dispatch(setProjectTitle(id, event.target.value));
  },
  onAuthorChange: (id) => (event) => {
    dispatch(setProjectAuthor(id, event.target.value));
  },
});

const methods = ({
  componentWillMount: ({ project, activateProject }) => {
    activateProject(project.id);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(Project));
