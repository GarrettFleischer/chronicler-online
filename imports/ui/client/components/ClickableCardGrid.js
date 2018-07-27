import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Zoom, Typography } from '@material-ui/core';
import { ClickableCard } from './ClickableCard';


export const ClickableCardGrid = ({ items, width, height }) => (
  <Grid container spacing={8} style={{ flexGrow: 1 }}>
    {items.map((item, i) => (
      <Zoom key={item.id} in mountOnEnter unmountOnExit style={{ transitionDelay: (i + 2) * 100 }}>
        <Grid item key={item.id}>
          <ClickableCard width={width} height={height} onClick={item.onClick}>
            <Grid container alignItems="center" justify="center" style={{ height: '100%' }}>
              <Grid item>
                <Typography variant="title">
                  {item.text}
                </Typography>
              </Grid>
            </Grid>
          </ClickableCard>
        </Grid>
      </Zoom>
    ))}
  </Grid>
);

ClickableCardGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.any, text: PropTypes.string, onClick: PropTypes.func })).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
