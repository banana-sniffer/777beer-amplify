// import React, { useState, useEffect } from 'react';
// import { useCollection } from '@cloudscape-design/collection-hooks';
// import {
//     Box,
//     Button,
//     CollectionPreferences,
//     Header,
//     Pagination,
//     Table,
//     TextFilter,
//     Modal,
//     SpaceBetween,
//     Form,
//     FormField,
//     Input,
// } from '@cloudscape-design/components';
// import { columnDefinitions, getMatchesCountText, paginationLabels, collectionPreferencesProps, defaultPreferences } from './BeerTable-config';
// import { BeerRatingButtons } from './BeerRatingButtons';
// import { generateClient } from 'aws-amplify/api';
// import { useAuthenticator } from '@aws-amplify/ui-react';
// import type { Schema } from "../amplify/data/resource";

// const client = generateClient<Schema>();

// function EmptyState({ title, subtitle, action }) {
//     return (
//         <Box textAlign="center" color="inherit">
//             <Box variant="strong" textAlign="center" color="inherit">
//                 {title}
//             </Box>
//             <Box variant="p" padding={{ bottom: 's' }} color="inherit">
//                 {subtitle}
//             </Box>
//             {action}
//         </Box>
//     );
// }

// export default function BeerTable() {
//     const [beerData, setBeerData] = useState([]); 
//     const [displayData, setDisplayData] = useState([]); 
//     const [currentView, setCurrentView] = useState('all');
//     const [isAddModalVisible, setIsAddModalVisible] = useState(false);
//     const [newBeer, setNewBeer] = useState({
//         name: '',
//         parentType: '',
//         type: '',
//         brand: '',
//         origin: '',
//         abv: '',
//         dongerRating: '',
//         shawnRating: '',
//         final: '',
//         dongerComments: '',
//         shawnComments: '',
//     });

//     // Fetch data from Amplify
//     const fetchBeers = async () => {
//         try {
//             // const response = await client.graphql({
//             //     query: listBeerData
//             // });
//             // const beers = response.data.listBeerData.items;
//             // const formattedBeers = beers.map(beer => ({
//             //     name: beer.name || '',
//             //     parentType: beer.parentType || '',
//             //     type: beer.type || '',
//             //     brand: beer.brand || '',
//             //     origin: beer.origin || '',
//             //     abv: beer.abv?.toString() || '',
//             //     danger: beer.dongerRating || '',
//             //     shown: beer.shawnRating || '',
//             //     final: beer.final?.toString() || '',
//             //     dongerComments: beer.dongerComments || '',
//             //     shawooComments: beer.shawnComments || '',
//             // }));
//             const beerData = await client.models.BeerData.list();
//             console.log
//             setBeerData(formattedBeers);
//             setDisplayData(formattedBeers);
//         } catch (error) {
//             console.error('Error fetching beers:', error);
//         }
//     };

//     useEffect(() => {
//         fetchBeers();
//     }, []);

//     // Function to add new beer to Amplify
//     const addNewBeer = async () => {
//         try {
//             const beerInput = {
//                 name: newBeer.name,
//                 parentType: newBeer.parentType,
//                 type: newBeer.type,
//                 brand: newBeer.brand,
//                 origin: newBeer.origin,
//                 abv: parseFloat(newBeer.abv) || 0,
//                 dongerRating: newBeer.danger,
//                 shawnRating: newBeer.shown,
//                 final: parseFloat(newBeer.final) || 0,
//                 dongerComments: newBeer.dongerComments,
//                 shawnComments: newBeer.shawooComments,
//             };

//             await client.graphql({
//                 query: createBeerData,
//                 variables: {
//                     input: beerInput
//                 }
//             });

//             // Refresh the beer list
//             await fetchBeers();
//             setIsAddModalVisible(false);
//             setNewBeer({
//                 name: '',
//                 parentType: '',
//                 type: '',
//                 brand: '',
//                 origin: '',
//                 abv: '',
//                 danger: '',
//                 shown: '',
//                 final: '',
//                 dongerComments: '',
//                 shawooComments: '',
//             });
//         } catch (error) {
//             console.error('Error adding beer:', error);
//         }
//     };

//     // Function to get top 10 beers
//     const getTopBeers = (ratingField) => {
//         const sortedBeers = [...beerData]
//             .filter(beer => !isNaN(parseFloat(beer[ratingField])))
//             .sort((a, b) => parseFloat(b[ratingField]) - parseFloat(a[ratingField]))
//             .slice(0, 10);
        
//         setDisplayData(sortedBeers);
//         setCurrentView(ratingField);
//     };

//     const resetToAllBeers = () => {
//         setDisplayData(beerData);
//         setCurrentView('all');
//     };
    
//     const [preferences, setPreferences] = useState(defaultPreferences);
//     const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
//         displayData,
//         {
//             filtering: {
//                 empty: <EmptyState title="No beers :<(" action={<Button>Create instance</Button>} />,
//                 noMatch: (
//                     <EmptyState
//                         title="No matches"
//                         action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
//                     />
//                 ),
//             },
//             pagination: { pageSize: preferences.pageSize },
//             sorting: {},
//             selection: {},
//         }
//     );

//     const handleInputChange = (field, value) => {
//         setNewBeer((prev) => ({ ...prev, [field]: value }));
//     };

//     return (
//         <>
//             <Table
//                 {...collectionProps}
//                 header={
//                     <Header
//                         counter={`(${items.length})`}
//                         actions={
//                             <SpaceBetween
//                                 direction="horizontal"
//                                 size="xs"
//                             >
//                                 <BeerRatingButtons 
//                                     onFinalRating={() => getTopBeers('final')}
//                                     onDngrRating={() => getTopBeers('danger')}
//                                     onShwnRating={() => getTopBeers('shown')}
//                                     onResetBeers={resetToAllBeers}
//                                     currentView={currentView}
//                                 />
//                                 <Button onClick={() => setIsAddModalVisible(true)}>Add New Beer</Button>
//                             </SpaceBetween>
//                         }
//                     >
//                         {currentView === 'all' ? 'Beers' : `Top 10 Beers by ${currentView.toUpperCase()} Rating`}
//                     </Header>
//                 }
//                 columnDefinitions={columnDefinitions}
//                 columnDisplay={preferences.contentDisplay}
//                 items={items}
//                 pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
//                 filter={
//                     <TextFilter
//                         {...filterProps}
//                         countText={getMatchesCountText(filteredItemsCount)}
//                         filteringAriaLabel="Filter beers"
//                     />
//                 }
//                 preferences={
//                     <CollectionPreferences
//                         {...collectionPreferencesProps}
//                         preferences={preferences}
//                         onConfirm={({ detail }) => setPreferences(detail)}
//                     />
//                 }
//             />

//             <Modal
//                 visible={isAddModalVisible}
//                 onDismiss={() => setIsAddModalVisible(false)}
//                 header="Add New Beer"
//                 footer={
//                     <SpaceBetween direction="horizontal" size="s">
//                         <Button variant="link" onClick={() => setIsAddModalVisible(false)}>Cancel</Button>
//                         <Button onClick={addNewBeer}>Add Beer</Button>
//                     </SpaceBetween>
//                 }
//             >
//                 <Form>
//                     <SpaceBetween direction="vertical" size="l">
//                         {Object.keys(newBeer).map((key) => (
//                             <FormField key={key} label={key.toUpperCase()}>
//                                 <Input
//                                     value={newBeer[key]}
//                                     onChange={({ detail }) => handleInputChange(key, detail.value)}
//                                 />
//                             </FormField>
//                         ))}
//                     </SpaceBetween>
//                 </Form>
//             </Modal>
//         </>
//     );
// }