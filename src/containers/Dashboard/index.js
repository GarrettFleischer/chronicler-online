import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Card, { CardContent } from 'material-ui/Card';
import GridList, { GridListTile } from 'material-ui/GridList';
import { getProjects } from '../../data/state';
import TabView, { makeTab } from '../../components/TabView';


const ProjectGrid = withRouter(({ history, projects }) => (
  <GridList cellHeight={75} cols={3}>
    {projects.map((project) => (
      <GridListTile key={project.id} cols={1}>
        <Card style={{ margin: 5 }} onClick={() => history.push(`/project/${project.id}`)}>
          <CardContent>{project.title}</CardContent>
        </Card>
      </GridListTile>
      ))}
  </GridList>
  ));

ProjectGrid.propTypes = {
  projects: PropTypes.array.isRequired,
};

// TODO use intl
const Dashboard = ({ projects }) => (
  <TabView
    id={'dashboard'}
    tabs={[
      makeTab('Projects', <ProjectGrid projects={projects} />),
      makeTab('Settings', <div />),
    ]}
  />
  );

Dashboard.propTypes = {
  projects: PropTypes.array.isRequired,
};


const mapStateToProps = (state) => ({
  projects: getProjects(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
