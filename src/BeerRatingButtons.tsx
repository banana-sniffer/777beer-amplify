import React from 'react';
import { Button, SpaceBetween } from '@cloudscape-design/components';

export function BeerRatingButtons({ 
    onFinalRating, 
    onDngrRating, 
    onShwnRating, 
    onResetBeers, 
    currentView 
}) {
    return (
        <SpaceBetween direction="horizontal" size="xs">
            <Button 
                variant={currentView === 'final' ? 'primary' : 'normal'}
                onClick={onFinalRating}
            >
                Overall Top 10
            </Button>
            <Button 
                variant={currentView === 'danger' ? 'primary' : 'normal'}
                onClick={onDngrRating}
            >
                DONGER Top 10
            </Button>
            <Button 
                variant={currentView === 'shown' ? 'primary' : 'normal'}
                onClick={onShwnRating}
            >
                SHAWOOBOO Top 10
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