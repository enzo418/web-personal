import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    createSvgIcon,
    Stack,
    SvgIcon,
    Typography,
} from '@mui/material';
import React from 'react';
import ProjectDetails from '../components/ProjectDetails';

import '../styles/HomePage.css';
import svgToIcon from '../utils/SvgToIcon';

interface IProps {}
interface IState {}

export default class HomePage extends React.Component<IProps, IState> {
    state = {};

    playPauseVideo = (e: React.MouseEvent<HTMLVideoElement, MouseEvent>) => {
        var target = e.target as HTMLVideoElement;
        target.paused ? target.play() : target.pause();
    };

    render() {
        return (
            <Box sx={{ margin: '20%' }}>
                <Typography variant="h2" gutterBottom component="div">
                    Projects
                </Typography>

                <Stack spacing={2}>
                    <Card elevation={6} className="project">
                        <video
                            src="media/peeakaboo_problem.mp4"
                            loop
                            muted
                            autoPlay={true}
                            style={{ width: '100%' }}
                            onClick={e => this.playPauseVideo(e)}></video>
                        <CardContent>
                            <Typography className="project-title" variant="h5">
                                CCTV - Recognizer
                            </Typography>
                            <Typography variant="body1">
                                A video surveillance software to track and alert
                                events on several cameras
                            </Typography>
                            <Box className="tech-stack-container">
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/cpp.svg')}
                                    label="c++"
                                />
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/opencv.svg')}
                                    label="opencv"
                                />
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/cmake.svg')}
                                    label="cmake"
                                />
                            </Box>
                            <Typography variant="body1">
                                This project includes reading a configuration
                                from a json or yaml file, connecting to a camera
                                (opencv), processing frames (opencv), displaying
                                those frames with thread safe producer -
                                consumer queues to validate the events with
                                multiples steps (using the chain of
                                responsibility pattern) and sending them through
                                a curl wrapper. All of that while keeping a
                                clean architecture, that means this system is
                                independent of frameworks (opencv), has tests
                                and the UI is developed separately, in the
                                project below.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>

                    <Card elevation={6} className="project">
                        <video
                            src="media/demoui.mp4"
                            loop
                            muted
                            autoPlay={true}
                            style={{ width: '100%' }}
                            onClick={e => this.playPauseVideo(e)}></video>
                        <CardContent>
                            <Typography className="project-title" variant="h5">
                                CCTV - Web/Client Recognizer
                            </Typography>
                            <Typography variant="body1">
                                The interface to easily configurate and
                                start/stop the &quot;CCTV - Recognizer&quot;
                                program
                            </Typography>
                            <Box className="tech-stack-container">
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/cpp.svg')}
                                    label="c++"
                                />
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/opencv.svg')}
                                    label="opencv"
                                />
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/cmake.svg')}
                                    label="cmake"
                                />
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('../icons/typescript.svg')}
                                    label="typescript"
                                />
                                <Chip
                                    variant="outlined"
                                    icon={svgToIcon('/icons/reactjs.svg')}
                                    label="react"
                                />
                            </Box>
                            <Typography variant="body1">
                                Apart from beign able to change a configuration,
                                it has a live view of all the cameras and a
                                notifications page. The main actors are react as
                                the framework, typescript as the languague and
                                the MUI as the components library.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </Stack>
            </Box>
        );
    }
}
