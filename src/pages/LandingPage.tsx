import React from 'react';

import '../styles/LandingPage.scss';

import '@fontsource/raleway/100.css';
import '@fontsource/raleway/300.css';
import '@fontsource/raleway/800.css';

import '@fontsource/space-mono/400.css';

export default function LandingPage() {
    return (
        <>
            <header>
                {/* <img
                    className="background"
                    src="media/A dream of robot astronauts with camera heads, oil painting.png"></img> */}

                <div className="header-content">
                    <div className="text-left">
                        <div>
                            <h1 className="title">ENZO AGUIRRE</h1>
                            <h5 className="subtitle">
                                <em>// Software Developer</em>
                            </h5>
                        </div>
                    </div>
                </div>
            </header>
            <footer>
                <div className="links">
                    <div className="links-item">
                        <img src="media/Octocat.png" />
                        <p>Github</p>
                    </div>
                    {/* <div className="links-item">
                        <img src="media/Octocat.png" />
                        <p>Linkedin</p>
                    </div> */}
                </div>
            </footer>
        </>
    );
}
