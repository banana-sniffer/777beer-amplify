import { Input } from '@cloudscape-design/components';


// Define the Beer interface
export interface BeerData {
    id: string;
    name: string;
    parentType: string;
    type: string;
    brand: string;
    origin: string;
    abv: number;
    dongerRating: number;
    shawnRating: number;
    overallRating: number;
    dongerComments: string;
    shawnComments: string;
}

export function getMatchesCountText(count) {
    return count === 1 ? `1 match` : `${count} matches`;
}

function createLabelFunction(columnName) {
    return ({ sorted, descending }) => {
        const sortState = sorted ? `sorted ${descending ? 'descending' : 'ascending'}` : 'not sorted';
        return `${columnName}, ${sortState}.`;
    };
}

export const baseColumnDefinitions = [
    {
        id: 'name',
        header: 'Name',
        cell: (item) => item.name,
        sortingField: 'name',
        ariaLabel: createLabelFunction('name'),
        isRowHeader: true,
    },
    { 
        id: 'parentType',
        header: 'Parent Type', 
        cell: (item) => item.type,
        ariaLabel: createLabelFunction('Parent Type'),
        sortingField: 'parentType'
    },
    { 
        id: 'type',
        header: 'Type', 
        cell: (item) => item.type,
        ariaLabel: createLabelFunction('Type'),
        sortingField: 'type'
    },
    { 
        id: 'brand',
        header: 'Brand', 
        cell: (item) => item.brand,
        ariaLabel: createLabelFunction('Brand'),
        sortingField: 'brand'
    },
    { 
        id: 'origin',
        header: 'Origin', 
        cell: (item) => item.origin,
        ariaLabel: createLabelFunction('Origin'),
        sortingField: 'origin',
    },
    {
        id: 'abv',
        header: 'ABV', 
        cell: (item) => item.abv,
        ariaLabel: createLabelFunction('ABV'),
        sortingField: 'abv'
    },
    { 
        id: 'dongerRating',
        header: 'Brandon Rating', 
        cell: (item) => item.dongerRating,
        ariaLabel: createLabelFunction('dongerRating'),
        sortingField: 'dongerRating'
    },
    { 
        id: 'shawnRating',
        header: 'Sean Rating', 
        cell: (item) => item.shawnRating,
        ariaLabel: createLabelFunction('shawnRating'),
        sortingField: 'shawnRating'
    },
    { 
        id: 'overallRating',
        header: 'Rating', 
        cell: (item) => item.overallRating,
        ariaLabel: createLabelFunction('overallRating'),
        sortingField: 'overallRating'
    },
    { 
        id: 'dongerComments',
        header: 'Brandon Comments', 
        cell: (item) => item.dongerComments,
        sortingField: 'dongerComments'
    },
    { 
        id: 'shawnComments',
        header: 'Sean Comments', 
        cell: (item) => item.shawnComments,
        sortingField: 'shawnComments'
    },
]

const editableColumns = {
    dongerComments: {
        minWidth: 200,
        editConfig: {
            ariaLabel: 'Edit Brandon Comments',
            errorIconAriaLabel: 'Comment Validation Error',
            editIconAriaLabel: 'editable',
            editingCell: (item, { setValue, currentValue }) => {
                return (
                    <Input
                        autoFocus={true}
                        ariaLabel="Edit Brandon comments"
                        value={currentValue ?? item.dongerComments}
                        onChange={event => {
                            setValue(event.detail.value);
                        }}
                        placeholder="Enter comments"
                    />
                );
            },
        },
        cell: item => item.dongerComments,
    },
    shawnComments: {
        minWidth: 200,
        editConfig: {
            ariaLabel: 'Edit Sean comments',
            errorIconAriaLabel: 'Comment Validation Error',
            editIconAriaLabel: 'editable',
            editingCell: (item, { setValue, currentValue }) => {
                return (
                    <Input
                        autoFocus={true}
                        ariaLabel="Edit Sean comments"
                        value={currentValue ?? item.shawnComments}
                        onChange={event => {
                            setValue(event.detail.value);
                        }}
                        placeholder="Enter comments"
                    />
                );
            },
        },
        cell: item => item.shawnComments,
    },
};

export const columnDefinitions = baseColumnDefinitions.map(column => {
    if (editableColumns[column.id]) {
        return {
            ...column,
            // minWidth: Math.max(Number(column.minWidth) || 0, 176),
            ...editableColumns[column.id],
        };
    }
    return column;
});

export const defaultPreferences = {
    pageSize: 20,
    contentDisplay: [
        { id: 'name', visible: true },
        { id: 'parentType', visible: true },
        { id: 'type', visible: true },
        { id: 'brand', visible: true },
        { id: 'origin', visible: true },
        { id: 'abv', visible: true },
        { id: 'dongerRating', visible: true },
        { id: 'shawnRating', visible: true },
        { id: 'overallRating', visible: true },
        { id: 'dongerComments', visible: true },
        { id: 'shawnComments', visible: true },
    ],
}

export const paginationLabels = {
    nextPageLabel: 'Next page',
    pageLabel: pageNumber => `Go to page ${pageNumber}`,
    previousPageLabel: 'Previous page',
};

const pageSizePreference = {
    title: 'Select page size',
    options: [
        { value: 10, label: '10 beers' },
        { value: 20, label: '20 beers' },
    ],
};

const contentDisplayPreference = {
    title: 'Column preferences',
    description: 'Customize the columns visibility and order.',
    options: columnDefinitions.map(({ id, header }) => ({ id, label: header, alwaysVisible: id === 'name' })),
};
export const collectionPreferencesProps = {
    pageSizePreference,
    contentDisplayPreference,
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    title: 'Preferences',
};