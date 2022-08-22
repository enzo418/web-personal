import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';

export default function ProjectDetails() {
    return <Card sx={{ minWidth: 275 }}>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Word of the Day
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Learn More</Button>
        </CardActions>
    </Card>;
}
