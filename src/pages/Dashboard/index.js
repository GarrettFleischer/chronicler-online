import AddIcon from 'material-ui-icons/Add';
import Card, { CardContent } from 'material-ui/Card';
import GridList, { GridListTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Align from '../../components/Align';
import CreateProjectDialog from '../../components/CreateProjectDialog';
import RequireAuth from '../../components/RequireAuth';
import TabView, { makeTab } from '../../components/TabView';
import { getProjects } from '../../data/state';
import { setShowCreateProject } from '../../reducers/uiReducer';


const ProjectGrid = withRouter(({ history, projects, onAddClick }) => (
  <div>
    <Align container>
      <Align right>
        <IconButton onClick={onAddClick}><AddIcon /></IconButton>
      </Align>
    </Align>
    <GridList cellHeight={75} cols={3}>
      {projects.map((project) => (
        <GridListTile key={project.id} cols={1}>
          <Card style={{ margin: 5 }} onClick={() => history.push(`/project/${project.id}`)}>
            <CardContent>{project.title}</CardContent>
          </Card>
        </GridListTile>
      ))}
    </GridList>
    <CreateProjectDialog id={'CREATE_PROJECT_DIALOG'} handleClose={(value) => console.log('value: ', value)} />
  </div>
  ));

ProjectGrid.propTypes = {
  projects: PropTypes.array.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

// TODO use intl
const Dashboard = ({ projects, onAddClick }) => (
  <RequireAuth>
    <TabView
      id={'dashboard'}
      tabs={[
        makeTab('Projects', <ProjectGrid projects={projects} onAddClick={onAddClick} />),
        makeTab('Settings', <div />),
      ]}
    />
  </RequireAuth>
  );

Dashboard.propTypes = {
  projects: PropTypes.array.isRequired,
  onAddClick: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => ({
  projects: getProjects(state),
});

const mapDispatchToProps = (dispatch) => ({
  onAddClick: () => {
    dispatch(setShowCreateProject(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
