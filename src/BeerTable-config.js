// import * as React from 'react';

// export function getMatchesCountText(count) {
//     return count === 1 ? `1 match` : `${count} matches`;
// }

// function createLabelFunction(columnName) {
//     return ({ sorted, descending }) => {
//         const sortState = sorted ? `sorted ${descending ? 'descending' : 'ascending'}` : 'not sorted';
//         return `${columnName}, ${sortState}.`;
//     };
// }

// export const columnDefinitions = [
//     {
//         id: 'name',
//         header: 'Name',
//         cell: (item) => item.name,
//         sortingField: 'name',
//         ariaLabel: createLabelFunction('name'),
//         isRowHeader: true,
//     },
//     { 
//         id: 'parentType',
//         header: 'Parent Type', 
//         cell: (item) => item.type,
//         ariaLabel: createLabelFunction('Parent Type'),
//         sortingField: 'parentType'
//     },
//     { 
//         id: 'type',
//         header: 'Type', 
//         cell: (item) => item.type,
//         ariaLabel: createLabelFunction('Type'),
//         sortingField: 'type'
//     },
//     { 
//         id: 'brand',
//         header: 'Brand', 
//         cell: (item) => item.brand,
//         ariaLabel: createLabelFunction('Brand'),
//         sortingField: 'brand'
//     },
//     { 
//         id: 'brand',
//         header: 'Origin', 
//         cell: (item) => item.origin,
//         ariaLabel: createLabelFunction('Origin'),
//         sortingField: 'origin',
//     },
//     { // TODO: Need to fix the sorting on this
//         id: 'abv',
//         header: 'ABV', 
//         cell: (item) => item.abv,
//         ariaLabel: createLabelFunction('ABV'),
//         sortingField: 'abv'
//     },
//     { 
//         id: 'danger',
//         header: 'DNGR', 
//         cell: (item) => item.danger,
//         ariaLabel: createLabelFunction('DNGR'),
//         sortingField: 'danger'
//     },
//     { 
//         id: 'shown',
//         header: 'SHWN', 
//         cell: (item) => item.shown,
//         ariaLabel: createLabelFunction('SHWN'),
//         sortingField: 'shown'
//     },
//     { 
//         id: 'final',
//         header: 'Rating', 
//         cell: (item) => item.final,
//         ariaLabel: createLabelFunction('Final'),
//         sortingField: 'final'
//     },
//     { 
//         id: 'dongerComments',
//         header: 'Donger Comments', 
//         cell: (item) => item.dongerComments,
//         sortingField: 'dongerComments'
//     },
//     { 
//         id: 'shawooComments',
//         header: 'Shawoo Comments', 
//         cell: (item) => item.shawooComments,
//         sortingField: 'shawooComments'
//     },
// ]

// // TODO: Rename the sean/brandon/final rating column
// export const defaultPreferences = {
//     pageSize: 20,
//     contentDisplay: [
//         { id: 'name', visible: true },
//         { id: 'type', visible: false },
//         { id: 'type', visible: true },
//         { id: 'brand', visible: true },
//         { id: 'origin', visible: true },
//         { id: 'abv', visible: true },
//         { id: 'danger', visible: false },
//         { id: 'shown', visible: false },
//         { id: 'final', visible: true },
//         { id: 'dongerComments', visible: true },
//         { id: 'shawooComments', visible: true },
//     ],
// }

// export const paginationLabels = {
//     nextPageLabel: 'Next page',
//     pageLabel: pageNumber => `Go to page ${pageNumber}`,
//     previousPageLabel: 'Previous page',
// };

// const pageSizePreference = {
//     title: 'Select page size',
//     options: [
//         { value: 10, label: '10 beers' },
//         { value: 20, label: '20 beers' },
//     ],
// };

// const contentDisplayPreference = {
//     title: 'Column preferences',
//     description: 'Customize the columns visibility and order.',
//     options: columnDefinitions.map(({ id, header }) => ({ id, label: header, alwaysVisible: id === 'name' })),
// };
// export const collectionPreferencesProps = {
//     pageSizePreference,
//     contentDisplayPreference,
//     cancelLabel: 'Cancel',
//     confirmLabel: 'Confirm',
//     title: 'Preferences',
// };