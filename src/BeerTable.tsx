import React, { useState, useEffect } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
    Box,
    Button,
    CollectionPreferences,
    Header,
    Pagination,
    Table,
    TextFilter,
    Modal,
    SpaceBetween,
    Form,
    FormField,
    Input,
    TableProps,
} from '@cloudscape-design/components';
import { columnDefinitions, getMatchesCountText, paginationLabels, collectionPreferencesProps, defaultPreferences, BeerData } from './BeerTable-config';
import { BeerRatingButtons } from './BeerRatingButtons';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function EmptyState({ title, subtitle, action }) {
    return (
        <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
                {title}
            </Box>
            <Box variant="p" padding={{ bottom: 's' }} color="inherit">
                {subtitle}
            </Box>
            {action}
        </Box>
    );
}

export const BeerTable = () => {
    const [beerData, setBeerData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [currentView, setCurrentView] = useState('all');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newBeer, setNewBeer] = useState({
        name: '',
        parentType: '',
        type: '',
        brand: '',
        origin: '',
        abv: '',
    });
    const { user, signOut } = useAuthenticator();

    const fetchBeers = async () => {
        try {
            const response = await client.models.BeerData.list();
            const beerData = response.data
            const beers = beerData.map(beer => ({
                id: beer.id,
                name: beer.name || '',
                parentType: beer.parentType || '',
                type: beer.type || '',
                brand: beer.brand || '',
                origin: beer.origin || '',
                abv: beer.abv || '',
                dongerRating: beer.dongerRating || '',
                shawnRating: beer.shawnRating || '',
                overallRating: beer.overallRating || '',
                dongerComments: beer.dongerComments || '',
                shawnComments: beer.shawnComments || '',
            }));
            setBeerData(beers);
            setDisplayData(beers);
        } catch (error) {
            console.error('Error fetching beers:', error);
        }
    };

    useEffect(() => {
        fetchBeers();
    }, []);

    // Function to add a new beer
    const addNewBeer = async () => {
        try {
            if (!newBeer.name.trim()) {
                alert('The beer name is required.');
                return;
            }

            const beerInput = {
                name: newBeer.name || '',
                parentType: newBeer.parentType || '',
                type: newBeer.type || '',
                brand: newBeer.brand || '',
                origin: newBeer.origin || '',
                abv: newBeer.abv || null,
            };

            // @ts-ignore
            await client.models.BeerData.create(beerInput);

            // Refresh the beer list
            await fetchBeers();
            setIsAddModalVisible(false);
            setNewBeer({
                name: '',
                parentType: '',
                type: '',
                brand: '',
                origin: '',
                abv: '',
            });
        } catch (error) {
            console.error('Error adding beer:', error);
        }
    };

    // Get top beers by a specified field
    const getTopBeers = (field) => {
        const sortedBeers = [...beerData]
            .filter(beer => !isNaN(parseFloat(beer[field])))
            .sort((a, b) => parseFloat(b[field]) - parseFloat(a[field]))
            .slice(0, 10);

        setDisplayData(sortedBeers);
        setCurrentView(field);
    };

    const resetToAllBeers = () => {
        setDisplayData(beerData);
        setCurrentView('all');
    };

    const handleSubmit = async (
        currentItem: BeerData,
        column: TableProps.ColumnDefinition<BeerData>,
        value: unknown
    ) => {
        if (!column.id) {
            return;
        }
    
        try {
            // Prepare the input for the update operation
            const updateInput: Partial<BeerData> = {
                id: currentItem.id,
                [column.id]: column.id.includes('Rating') || column.id === 'abv'
                    ? Number(value) // Ensure numeric fields are numbers
                    : value as string, // Assume other fields are strings
            };
    
            if (column.id.includes('Rating') || column.id === 'abv') {
                let numericValue = updateInput[column.id] as number;
    
                if (isNaN(numericValue)) {
                    console.error('Invalid numeric value:', value);
                    return; // Early exit if the value is not a valid number
                }
    
                // Validate and truncate numeric fields
                const lowerBound = column.id === 'abv' ? 0 : 0;
                const upperBound = column.id === 'abv' ? 100 : 10;
    
                if (numericValue < lowerBound || numericValue > upperBound) {
                    console.error(
                        `${column.id} value out of bounds (must be between ${lowerBound} and ${upperBound}):`,
                        value
                    );
                    return; // Early exit if the value is outside the allowed range
                }
    
                numericValue = parseFloat(numericValue.toFixed(1)); // Truncate to one decimal place
                updateInput[column.id] = numericValue;
            }
    
            // Update in the backend
            // @ts-ignore
            await client.models.BeerData.update(updateInput);
    
            // Create the updated beer data
            const updatedBeerData = beerData.map(beer => {
                if (beer.id === currentItem.id) {
                    const updatedBeer = { ...beer, [column.id]: updateInput[column.id] };
    
                    // Calculate overallRating if both ratings are present
                    if (updatedBeer.dongerRating != null && updatedBeer.shawnRating != null) {
                        updatedBeer.overallRating = 
                            parseFloat(((updatedBeer.dongerRating + updatedBeer.shawnRating) / 2).toFixed(1));
                    }
    
                    return updatedBeer;
                }
                return beer;
            });
    
            // Update both states with the new data
            setBeerData(updatedBeerData);
            setDisplayData(updatedBeerData);
        } catch (error) {
            console.error('Error updating beer data:', error);
            // Optional: Add error handling such as showing a toast notification
        }
    };    
    
    

    const [preferences, setPreferences] = useState(defaultPreferences);
    const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
        displayData,
        {
            filtering: {
                // @ts-ignore
                empty: <EmptyState title="No beers :<(" action={<Button>Create instance</Button>} />,
                noMatch: (
                    // @ts-ignore
                    <EmptyState
                        title="No matches"
                        action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
                    />
                ),
            },
            pagination: { pageSize: preferences.pageSize },
            sorting: {},
            selection: {},
        }
    );

    const handleInputChange = (field, value) => {
        setNewBeer((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <Button
                    onClick={signOut}
                >
                    Sign out
                </Button>
            <Table
                {...collectionProps}
                wrapLines
                header={
                    <Header
                        counter={`(${items.length})`}
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <BeerRatingButtons
                                    // @ts-ignore
                                    onOverallRating={() => getTopBeers('overallRating')}
                                    onBrandonRating={() => getTopBeers('dongerRating')}
                                    onSeanRating={() => getTopBeers('shawnRating')}
                                    onResetBeers={resetToAllBeers}
                                    currentView={currentView}
                                />
                                <Button onClick={() => setIsAddModalVisible(true)}>Add New Beer</Button>
                            </SpaceBetween>
                        }
                    >
                        {currentView === 'all' ? 'All Beers' : `Top 10 Beers by ${currentView.toUpperCase()}`}
                    </Header>
                }
                columnDefinitions={columnDefinitions}
                submitEdit={handleSubmit}
                columnDisplay={preferences.contentDisplay}
                items={items}
                pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
                filter={
                    <TextFilter
                        {...filterProps}
                        countText={getMatchesCountText(filteredItemsCount)}
                        filteringAriaLabel="Filter beers"
                    />
                }
                preferences={
                    <CollectionPreferences
                        {...collectionPreferencesProps}
                        preferences={preferences}
                        // @ts-ignore
                        onConfirm={({ detail }) => setPreferences(detail)}
                    />
                }
            />

            <Modal
                visible={isAddModalVisible}
                onDismiss={() => setIsAddModalVisible(false)}
                header="Add New Beer"
                footer={
                    <SpaceBetween direction="horizontal" size="s">
                        <Button variant="link" onClick={() => setIsAddModalVisible(false)}>Cancel</Button>
                        <Button onClick={addNewBeer}>Add Beer</Button>
                    </SpaceBetween>
                }
                >
                <Form>
                    <SpaceBetween direction="vertical" size="l">
                        {Object.keys(newBeer).map((key) => (
                            <FormField key={key} label={key.toUpperCase()}>
                                <Input
                                    value={newBeer[key]}
                                    onChange={({ detail }) => handleInputChange(key, detail.value)}
                                />
                            </FormField>
                        ))}
                    </SpaceBetween>
                </Form>
            </Modal>
        </>
    );
}
