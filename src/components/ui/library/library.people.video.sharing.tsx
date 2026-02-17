/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';

interface SharedPerson {
    id: string;
    name: string;
    avatar: string;
    isSharing: boolean;
    videoTitle: string;
}

const sharedPeople: SharedPerson[] = [
    { id: '1', name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=1', isSharing: true, videoTitle: 'Project Neon' },
    { id: '2', name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=2', isSharing: true, videoTitle: 'UI Design Sync' },
    { id: '3', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=3', isSharing: false, videoTitle: '' },
    { id: '4', name: 'Mike', avatar: 'https://i.pravatar.cc/150?u=4', isSharing: true, videoTitle: 'API Docs' },
    { id: '5', name: 'Elena', avatar: 'https://i.pravatar.cc/150?u=5', isSharing: false, videoTitle: '' },
    { id: '6', name: 'Chris', avatar: 'https://i.pravatar.cc/150?u=6', isSharing: true, videoTitle: 'Marketing Clip' },
    { id: '7', name: 'Pat', avatar: 'https://i.pravatar.cc/150?u=7', isSharing: false, videoTitle: '' },
    { id: '8', name: 'Sam', avatar: 'https://i.pravatar.cc/150?u=8', isSharing: true, videoTitle: 'Review v2' },
    { id: '9', name: 'Taylor', avatar: 'https://i.pravatar.cc/150?u=9', isSharing: true, videoTitle: 'Draft' },
    { id: '10', name: 'Jasmine', avatar: 'https://i.pravatar.cc/150?u=10', isSharing: true, videoTitle: 'Draft' },
];

export const VideoSharingPeople: React.FC = () => {
    return (
        <section id="collaborator-sharing-hub" className="Sharing-Hub-Container">
            <div className="Sharing-Hub-Scroll-Area custom-scrollbar">
                {sharedPeople.map((person) => (
                    <div key={person.id} className="Sharing-Person-Card">
                        <div className={`Avatar-Ring ${person.isSharing ? 'active-pulse' : ''}`}>
                            <div className="Avatar-Wrapper">
                                <img src={person.avatar} alt={person.name} title={person.isSharing ? `Watching: ${person.videoTitle}` : person.name} />
                                {person.isSharing && <span className="Sharing-Indicator" />}
                            </div>
                        </div>
                        <span className="Person-Name">{person.name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};