import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import lifecycle from 'react-pure-lifecycle';
import { Redirect, withRouter } from 'react-router-dom';
import Card, { CardContent } from 'material-ui/Card';
// import GridList, { GridListTile } from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import TabView, { makeTab } from '../../components/TabView';
import Variable from '../../components/Variable';
import { setActiveProject } from '../../reducers/uiReducer';
import { getProjects } from '../../data/state';
import { peek } from '../../lib/stack';
import { addVariable } from '../../components/Variable/reducers';
import ItemList from '../../components/ItemList';
import { addScene, setProjectAuthor, setProjectTitle, sortScenes } from './reducers';
import { setSceneName } from '../Scene/reducers';


const SceneList = withRouter(({ history, scenes, onNameChange, onAdd, onSortEnd }) => (
  <ItemList handleAdd={onAdd} handleSortEnd={onSortEnd}>
    {scenes.map((scene) => (
      <Card key={scene.id} style={{ margin: 5 }} onClick={() => history.push(`/scene/${scene.id}`)}>
        <CardContent>
          <TextField
            onClick={(e) => e.stopPropagation()}
            onChange={onNameChange(scene.id)}
            value={scene.name}
          />
          <div />
        </CardContent>
      </Card>
    ))}
  </ItemList>
));

SceneList.propTypes = {
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
const Project = ({ project, onAddVariable, onTitleChange, onAuthorChange, onSceneNameChange, onAddScene, onSortEnd }) => {
  if (project === undefined)
    return <Redirect to="/404" />;

  return (
    <TabView
      id={'dashboard'}
      tabs={[
        makeTab('Scenes',
          <SceneList
            scenes={project.scenes || []}
            onNameChange={onSceneNameChange}
            onAdd={onAddScene(project.id)}
            onSortEnd={onSortEnd(project.id)}
          />),
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
  onSceneNameChange: PropTypes.func.isRequired,
  onAddScene: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
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
  onSceneNameChange: (id) => (event) => {
    dispatch(setSceneName(id, event.target.value));
  },
  onAddScene: (id) => () => {
    dispatch(addScene(id));
  },
  onSortEnd: (id) => ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex)
      dispatch(sortScenes(id, oldIndex, newIndex));
  },
});

const methods = ({
  componentWillMount: ({ project, activateProject }) => {
    activateProject(project.id);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(lifecycle(methods)(Project));
