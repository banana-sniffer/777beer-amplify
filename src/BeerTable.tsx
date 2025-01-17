import { useState, useEffect } from 'react';
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
    Select,
    Autosuggest,
    Checkbox,
} from '@cloudscape-design/components';
import { 
    getEditableColumns,
    getMatchesCountText,
    paginationLabels,
    getPreferencesProps,
    pageSizePreference,
    defaultPreferences,
    BeerData,
    baseColumnDefinitions,
} from './BeerTable-config';
import { BeerRatingButtons } from './BeerRatingButtons';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { 
    BRANDON_ID,
    SEAN_ID,
    WILL_ID,
    INVALID_BEER_NAME_MESSAGE,
    BEER_PARENT_TYPES
} from './Constants';
import { getCurrentUser } from 'aws-amplify/auth';

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
    const [beerNameSet, setBeerNameSet] = useState(new Set())
    const [brandNameSet, setBrandNameSet] = useState(new Set())
    const { user, signOut } = useAuthenticator();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBrandon, setIsBrandon] = useState(false);
    const [isSean, setIsSean] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    console.log('newBeer', newBeer)

    const columnDefinitions = getEditableColumns(isBrandon, isSean, isAdmin, baseColumnDefinitions)
    const collectionPreferencesProps = getPreferencesProps(columnDefinitions, pageSizePreference)

    const getUserData = async () => {
        const { userId } = await getCurrentUser();
        setIsAdmin(userId === WILL_ID)
        setIsBrandon(userId === BRANDON_ID)
        setIsSean(userId === SEAN_ID)
    }

    useEffect(() => {
        getUserData();
    }, []);

    const fetchBeers = async () => {
        const allBeers = [];
        let nextToken = null;
      
        try {
          do {
            const response = await client.models.BeerData.list({
              limit: 100,
              nextToken,
            });
      
            const beerData = response.data;
      
            const beers = beerData.map((beer) => ({
              id: beer.id,
              createdAt: beer.createdAt || '',
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
      
            allBeers.push(...beers);
      
            nextToken = response.nextToken; // Update nextToken for the next iteration
          } while (nextToken); // Continue fetching until nextToken is null

        // Create a set of all current beer names
        setBeerNameSet(new Set(allBeers.map(beer => beer.name)))

        // Create a set of all existing brand names
        setBrandNameSet(new Set(allBeers.map(beer => beer.brand)))

        // Sort by date first, then by name
        allBeers.sort((a, b) => {
            //@ts-ignore
            const dateCompare = new Date(b.createdAt) - new Date(a.createdAt);
            if (dateCompare !== 0) return dateCompare;
            
            // If dates are equal, sort by name
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
      
          setBeerData(allBeers); // Set all fetched data to state
          setDisplayData(allBeers); // Set it to the display data state as well
        } catch (error) {
          console.error('Error fetching beers:', error);
        }

        setIsLoading(false)
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
            const uploadedData = await client.models.BeerData.create(beerInput);

            // Add beer to the exist beer set
            setBeerNameSet((prevSet) => {
                // Create a new Set based on the previous Set
                const updatedSet = new Set(prevSet);
                // @ts-ignore
                updatedSet.add(uploadedData.name);
                return updatedSet;
            });

            // Add beer brand to the exist beer set
            // @ts-ignore
            if (uploadedData.brand) {
                setBrandNameSet((prevSet) => {
                    // Create a new Set based on the previous Set
                    const updatedSet = new Set(prevSet);
                    // @ts-ignore
                    updatedSet.add(uploadedData.brand);
                    return updatedSet;
                });
            }
            

            // Add the added beer to the top of the list
            setBeerData((prevBeerData) => [uploadedData, ...prevBeerData]);
            setDisplayData((prevBeerData) => [uploadedData, ...prevBeerData]);
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
                            parseFloat(((updatedBeer.dongerRating + updatedBeer.shawnRating) / 2).toFixed(2));
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

    // const [newBeer, setNewBeer] = useState({
    //     name: '',
    //     parentType: '',
    //     type: '',
    //     brand: '',
    //     origin: '',
    //     abv: '',
    // });

    const generateNewBeerForm = () => {
        const parentTypeOptions = Object.keys(BEER_PARENT_TYPES).map((key) => ({
            label: key,
            value: key,
        }));
    
        const typeOptions =
            newBeer.parentType && BEER_PARENT_TYPES[newBeer.parentType]
                ? BEER_PARENT_TYPES[newBeer.parentType].map((type) => ({
                      label: type,
                      value: type,
                  }))
                : [];
    
        const brandOptions = Array.from(brandNameSet).map((brand) => ({
            value: brand,
        }));
    
        return (
            <Form

            >
                <SpaceBetween direction="vertical" size="l">
                    <FormField
                        label="NAME"
                        errorText={beerNameSet.has(newBeer["name"]) && INVALID_BEER_NAME_MESSAGE || ""}
                    >
                        <Input
                            value={newBeer["name"]}
                            onChange={({ detail }) => handleInputChange("name", detail.value)}
                            invalid={beerNameSet.has(newBeer["name"])}
                            placeholder="Enter beer name"
                            disableBrowserAutocorrect
                        />
                    </FormField>
                    <FormField label="PARENT TYPE">
                        <Select
                            selectedOption={
                                newBeer.parentType
                                    ? { label: newBeer.parentType, value: newBeer.parentType }
                                    : null
                            }
                            onChange={({ detail }) =>
                                setNewBeer((prev) => ({
                                    ...prev,
                                    parentType: detail.selectedOption.value,
                                    type: '',
                                }))
                            }
                            options={parentTypeOptions}
                            placeholder="Select a Parent Type"
                        />
                    </FormField>
                    <FormField label="TYPE">
                        <Select
                            selectedOption={
                                newBeer.type ? { label: newBeer.type, value: newBeer.type } : null
                            }
                            onChange={({ detail }) =>
                                setNewBeer((prev) => ({
                                    ...prev,
                                    type: detail.selectedOption.value,
                                }))
                            }
                            options={typeOptions}
                            placeholder="Select a Type"
                            disabled={!newBeer.parentType}
                        />
                    </FormField>
                    <FormField label="BRAND">
                        <Autosuggest
                            value={newBeer["brand"]}
                            onChange={({ detail }) => handleInputChange("brand", detail.value)}
                            onSelect={({ detail }) => handleInputChange("brand", detail.value)}
                            // @ts-ignore
                            options={newBeer["brand"].length > 2 ? brandOptions : []}
                            placeholder="Enter or select a brand"
                            empty="No suggestions found"
                        />
                    </FormField>
                    <Checkbox
                        // onChange={({ detail }) =>
                        //     setChecked(detail.checked)
                        // } https://cloudscape.design/components/checkbox/
                        checked
                        >
                        Will's Choice
                    </Checkbox>
                    {/* 
                        For the origin it's just a text field
                        for the ABV it just has to be a number
                    */}
                </SpaceBetween>
            </Form>
        );
    };
    

    return (
        <>
            <Button
                    onClick={signOut}
                >
                    Sign out
                </Button>
            <Table //TODO Need to fix the (## here maybe to include ##/{total_number_of_beers})
                {...collectionProps}
                loading={isLoading}
                loadingText="Pouring beers..."
                wrapLines
                resizableColumns
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
                    // willtai TODO, instead of this use the actual form field full functionality: https://cloudscape.design/components/form/?tabId=playground&example=with-errors
                    <SpaceBetween direction="horizontal" size="s">
                        <Button variant="link" onClick={() => {
                            setIsAddModalVisible(false); 
                            setNewBeer({
                                name: '',
                                parentType: '',
                                type: '',
                                brand: '',
                                origin: '',
                                abv: '',
                            });
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={addNewBeer}>Add Beer</Button>
                    </SpaceBetween>
                }
                >
                {generateNewBeerForm()}
            </Modal>
        </>
    );
}
