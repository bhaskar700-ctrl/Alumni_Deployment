import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpcomingEvents, selectAllEvents } from '../../redux/store/eventSlice'; // Adjust the import path as needed
import { Container, Typography, CircularProgress, Card, CardContent, CardMedia, Grid, Box } from '@mui/material';

const UpcomingEventPage = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const { status, error } = useSelector((state) => state.events);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUpcomingEvents());
    }
  }, [status, dispatch]);

  useEffect(() => {
    console.log('Upcoming Events:', events);
  }, [events]);

  if (status === 'loading') {
    console.log('Status:', status);
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }
  if (status === 'failed') {
    console.log('Status:', status);
    console.log('Error:', error);
    return <Typography color="error">{error}</Typography>;
  }

  const upcomingEvents = events.filter(event => new Date(event.startDate) >= new Date());

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Upcoming Events
      </Typography>
      <Grid container spacing={4}>
        {upcomingEvents.map(event => {
          console.log('Event:', event);
          console.log('Event Image:', event.imageUrl);
          console.log('Organizer ID:', event.organizer?._id);
          console.log('Organizer Personal Details:', event.organizer?.personalDetails);
          console.log('Organizer Name:', event.organizer?.personalDetails?.firstName, event.organizer?.personalDetails?.lastName);

          return (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card>
                {event.imageUrl ? (
                  <CardMedia
                    component="img"
                    alt={event.title}
                    height="140"
                    image={event.imageUrl}  // Use the imageUrl from the selector
                    title={event.title}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    alt="Default Image"
                    height="140"
                    image="https://via.placeholder.com/300"
                    title="Default Image"
                  />
                )}
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {event.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {new Date(event.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {event.description}
                  </Typography>
                  <Typography variant="body2" component="p">
                    Location: {event.location}
                  </Typography>
                  {/*}
                  {event.organizer && event.organizer.personalDetails ? (
                    <Typography variant="body2" component="p">
                      Organizer: {event.organizer.personalDetails.firstName} {event.organizer.personalDetails.lastName}
                    </Typography>
                  ) : (
                    <Typography variant="body2" component="p">
                      Organizer details not available
                    </Typography>
                  )}
                  */}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default UpcomingEventPage;
