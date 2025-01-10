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
} from '@cloudscape-design/components';
import { columnDefinitions, getMatchesCountText, paginationLabels, collectionPreferencesProps, defaultPreferences } from './BeerTable-config';
import { BeerRatingButtons } from './BeerRatingButtons';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from "../amplify/data/resource";

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
        dongerRating: '',
        shawnRating: '',
        overallRating: '',
        dongerComments: '',
        shawnComments: '',
    });

    // console.log('beerData', beerData)

    const fetchBeers = async () => {
        try {
            const response = await client.models.BeerData.list();
            console.log('response', response)
            const beerData = response.data
            const beers = beerData.map(beer => ({
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
            const beerInput = {
                name: newBeer.name || '',
                parentType: newBeer.parentType || '',
                type: newBeer.type || '',
                brand: newBeer.brand || '',
                origin: newBeer.origin || '',
                abv: newBeer.abv || null,
                dongerRating: newBeer.dongerRating || null,
                shawnRating: newBeer.shawnRating || null,
                overallRating: newBeer.overallRating || null,
                dongerComments: newBeer.dongerComments || '',
                shawnComments: newBeer.shawnComments || '',
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
                dongerRating: '',
                shawnRating: '',
                overallRating: '',
                dongerComments: '',
                shawnComments: '',
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
            <Table
                {...collectionProps}
                header={
                    <Header
                        counter={`(${items.length})`}
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <BeerRatingButtons
                                    // @ts-ignore
                                    onRating={() => getTopBeers('rating')}
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
