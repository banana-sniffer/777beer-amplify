import React from 'react';
import { Button, SpaceBetween } from '@cloudscape-design/components';

export function BeerRatingButtons({ 
    onOverallRating,    
    onBrandonRating,
    onSeanRating,
    onResetBeers, 
    currentView 
}) {
    return (
        <SpaceBetween direction="horizontal" size="xs">
            <Button 
                variant={currentView === 'overallRating' ? 'primary' : 'normal'}
                onClick={onOverallRating}
            >
                Overall Top 10
            </Button>
            <Button 
                variant={currentView === 'dongerRating' ? 'primary' : 'normal'}
                onClick={onBrandonRating}
            >
                Brandon Top 10
            </Button>
            <Button 
                variant={currentView === 'shawnRating' ? 'primary' : 'normal'}
                onClick={onSeanRating}
            >
                Sean Top 10
            </Button>
            <Button 
                variant={currentView === 'all' ? 'primary' : 'normal'}
                onClick={onResetBeers}
            >
                Show All Beers
            </Button>
        </SpaceBetween>
    );
}