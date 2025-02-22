import { 
    Input,
    Select,
    Textarea,
} from '@cloudscape-design/components';
import { 
    BEER_PARENT_TYPES,
    TABLE_NUMBER_COLUMN_WIDTH,
    TABLE_TEXT_AREA_ROWS,
} from './Constants';

// Define the Beer interface
export interface BeerData {
    id: string;
    // TODO need to add the createdAt timestamp here
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
    willsChoice: boolean;
    willsComments: string;
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
        id: 'createdAt',
        header: 'Drunk At',
        cell: (item) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'UKNOWN',
        sortingField: 'createdAt',
        ariaLabel: createLabelFunction('createdAt'),
        isRowHeader: true,
    },
    {
        id: 'name',
        header: 'Name',
        cell: (item) => 
            item.willsChoice ? `${item.name} 🚾` : item.name,
        sortingField: 'name',
        ariaLabel: createLabelFunction('name'),
        isRowHeader: true,
        width: 150
    },
    { 
        id: 'parentType',
        header: 'Parent Type', 
        cell: (item) => item.parentType || "-",
        ariaLabel: createLabelFunction('Parent Type'),
        sortingField: 'parentType'
    },
    { 
        id: 'type',
        header: 'Type', 
        cell: (item) => item.type || "-",
        ariaLabel: createLabelFunction('Type'),
        sortingField: 'type'
    },
    { 
        id: 'brand',
        header: 'Brand', 
        cell: (item) => item.brand || "-",
        ariaLabel: createLabelFunction('Brand'),
        sortingField: 'brand'
    },
    { 
        id: 'origin',
        header: 'Origin', 
        cell: (item) => item.origin || "-",
        ariaLabel: createLabelFunction('Origin'),
        sortingField: 'origin',
    },
    {
        id: 'abv',
        header: 'ABV', 
        cell: (item) => item.abv ? `${item.abv}%` : "-",
        ariaLabel: createLabelFunction('ABV'),
        sortingField: 'abv'
    },
    { 
        id: 'dongerRating',
        header: 'BR', 
        cell: (item) => item.dongerRating || "-",
        ariaLabel: createLabelFunction('dongerRating'),
        sortingField: 'dongerRating'
    },
    { 
        id: 'shawnRating',
        header: 'SR', 
        cell: (item) => item.shawnRating || "-",
        ariaLabel: createLabelFunction('shawnRating'),
        sortingField: 'shawnRating'
    },
    { 
        id: 'overallRating',
        header: 'OR', 
        cell: (item) => item.overallRating || "-",
        ariaLabel: createLabelFunction('overallRating'),
        sortingField: 'overallRating',
        width: TABLE_NUMBER_COLUMN_WIDTH
    },
    { 
        id: 'dongerComments',
        header: 'Brandon Comments', 
        cell: (item) => item.dongerComments || "-",
        sortingField: 'dongerComments'
    },
    { 
        id: 'shawnComments',
        header: 'Sean Comments', 
        cell: (item) => item.shawnComments || "-",
        sortingField: 'shawnComments'
    },
    { 
        id: 'willsComments',
        header: 'Will Comments', 
        cell: (item) => item.willsComments || "-",
        sortingField: 'willsComments'
    },
]

export const getEditableColumns = (isBrandon, isSean, isAdmin, baseColumnDefinitions) => {
    const editableColumns = {
        parentType: {
            minWidth: 200,
            editConfig: {
                ariaLabel: 'Edit Parent Type',
                errorIconAriaLabel: 'Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon && !isSean) {
                        return 'You are not Brandon/Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    const parentTypeOptions = Object.keys(BEER_PARENT_TYPES).map(key => ({
                        label: key,
                        value: key
                    }));

                    return (
                        <Select
                            selectedOption={
                                currentValue 
                                    ? { label: currentValue, value: currentValue }
                                    : null
                            }
                            onChange={({ detail }) => {
                                setValue(detail.selectedOption.value);
                            }}
                            options={parentTypeOptions}
                            placeholder={item.parentType || "Select Parent Type"}
                        />
                    );
                },
            },
        },
        type: {
            minWidth: 200,
            editConfig: {
                ariaLabel: 'Edit Type',
                errorIconAriaLabel: 'Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon && !isSean) {
                        return 'You are not Brandon/Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    // Get types based on selected parent type
                    const parentType = item.parentType;
                    const typeOptions = parentType 
                        ? BEER_PARENT_TYPES[parentType].map(type => ({
                            label: type,
                            value: type
                        }))
                        : [];

                    return (
                        <Select
                            selectedOption={
                                currentValue 
                                    ? { label: currentValue, value: currentValue }
                                    : null
                            }
                            onChange={({ detail }) => {
                                setValue(detail.selectedOption.value);
                            }}
                            options={typeOptions}
                            placeholder={item.type || "Select Type"}
                            disabled={!parentType}
                        />
                    );
                },
            },
        },
        brand: {
            width: 150,
            editConfig: {
                ariaLabel: 'Edit Brand',
                errorIconAriaLabel: 'Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon && !isSean) {
                        return 'You are not Brandon/Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Input
                            autoFocus={true}
                            ariaLabel="Edit Brand"
                            value={currentValue ?? item.brand}
                            onChange={event => {
                                setValue(event.detail.value);
                            }}
                            placeholder="Enter brand"
                        />
                    );
                },
            },
        },
        origin: {
            width: 150,
            editConfig: {
                ariaLabel: 'Edit Origin',
                errorIconAriaLabel: 'Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon && !isSean) {
                        return 'You are not Brandon/Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Input
                            autoFocus={true}
                            ariaLabel="Edit Origin"
                            value={currentValue ?? item.origin}
                            onChange={event => {
                                setValue(event.detail.value);
                            }}
                            placeholder="Enter origin"
                        />
                    );
                },
            },
        },
        abv: {
            width: TABLE_NUMBER_COLUMN_WIDTH,
            editConfig: {
                ariaLabel: 'Edit ABV',
                errorIconAriaLabel: 'Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon && !isSean) {
                        return 'You are not Brandon/Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Input
                            autoFocus={true}
                            type="number"
                            step="any"
                            ariaLabel="Edit ABV"
                            value={currentValue ?? item.abv}
                            onChange={event => {
                                setValue(parseFloat(event.detail.value));
                            }}
                            placeholder="Enter ABV"
                        />
                    );
                },
            },
        },
        dongerRating: {
            width: TABLE_NUMBER_COLUMN_WIDTH,
            editConfig: {
                ariaLabel: 'Edit Brandon Rating',
                errorIconAriaLabel: 'Rating Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon) {
                        return 'You are not Brandon!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Input
                            autoFocus={true}
                            type="number"
                            step="any"
                            ariaLabel="Edit Brandon rating"
                            value={currentValue ?? item.dongerRating}
                            onChange={event => {
                                setValue(parseFloat(event.detail.value));
                            }}
                            placeholder="Enter rating"
                        />
                    );
                },
            },
        },
        shawnRating: {
            width: TABLE_NUMBER_COLUMN_WIDTH,
            editConfig: {
                ariaLabel: 'Edit Sean Rating',
                errorIconAriaLabel: 'Rating Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isSean) {
                        return 'You are not Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Input
                            autoFocus={true}
                            type="number"
                            step="any"
                            ariaLabel="Edit Sean rating"
                            value={currentValue ?? item.shawnRating}
                            onChange={event => {
                                setValue(parseFloat(event.detail.value));
                            }}
                            placeholder="Enter rating"
                        />
                    );
                },
            },
        },
        dongerComments: {
            width: 400,
            editConfig: {
                ariaLabel: 'Edit Brandon Comments',
                errorIconAriaLabel: 'Comment Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isBrandon) {
                        return 'You are not Brandon!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Textarea
                            autoFocus={true}
                            ariaLabel="Edit Brandon comments"
                            value={currentValue ?? item.dongerComments}
                            onChange={event => {
                                setValue(event.detail.value);
                            }}
                            placeholder="Enter comments"
                            rows={TABLE_TEXT_AREA_ROWS}
                        />
                    );
                },
            },
        },
        shawnComments: {
            width: 300,
            editConfig: {
                ariaLabel: 'Edit Sean Comments',
                errorIconAriaLabel: 'Comment Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin && !isSean) {
                        return 'You are not Sean!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Textarea
                            autoFocus={true}
                            ariaLabel="Edit Sean comments"
                            value={currentValue ?? item.shawnComments}
                            onChange={event => {
                                setValue(event.detail.value);
                            }}
                            placeholder="Enter comments"
                            rows={TABLE_TEXT_AREA_ROWS}
                        />
                    );
                },
            },
        },
        willsComments: {
            minWidth: 200,
            editConfig: {
                ariaLabel: 'Edit Will Comments',
                errorIconAriaLabel: 'Comment Validation Error',
                editIconAriaLabel: 'editable',
                disabledReason: item => {
                    if (!isAdmin) {
                        return 'You are not Will!';
                    }
                    return undefined;
                },
                editingCell: (item, { setValue, currentValue }) => {
                    return (
                        <Textarea
                            autoFocus={true}
                            ariaLabel="Edit Will comments"
                            value={currentValue ?? item.willsComments}
                            onChange={event => {
                                setValue(event.detail.value);
                            }}
                            placeholder="Enter comments"
                            rows={TABLE_TEXT_AREA_ROWS}
                        />
                    );
                },
            },
        },
    };

    return baseColumnDefinitions.map(column => {
        if (editableColumns[column.id]) {
            return {
                ...column,
                ...editableColumns[column.id],
            };
        }
        return column;
    })
};


export const defaultPreferences = {
    pageSize: 25,
    contentDisplay: [
        { id: 'createdAt', visible: false },
        { id: 'name', visible: true },
        { id: 'parentType', visible: false },
        { id: 'type', visible: false },
        { id: 'brand', visible: true },
        { id: 'origin', visible: true },
        { id: 'abv', visible: true },
        { id: 'dongerRating', visible: true },
        { id: 'shawnRating', visible: true },
        { id: 'overallRating', visible: true },
        { id: 'dongerComments', visible: true },
        { id: 'shawnComments', visible: true },
        { id: 'willsComments', visible: false },
    ],
}

export const paginationLabels = {
    nextPageLabel: 'Next page',
    pageLabel: pageNumber => `Go to page ${pageNumber}`,
    previousPageLabel: 'Previous page',
};

export const pageSizePreference = {
    title: 'Number of beers to display',
    options: [
        { value: 10, label: '10 beers' },
        { value: 25, label: '25 beers' },
        { value: 50, label: '50 beers' },
        { value: 100, label: '100 beers' },
    ],
};

export const getPreferencesProps = (columnDefinitions) => {
    const contentDisplayPreference = {
        title: 'Column preferences',
        description: 'Customize the columns visibility and order.',
        options: columnDefinitions.map(({ id, header }) => ({ 
            id, 
            label: header, 
            alwaysVisible: id === 'name' 
        })),
    };

    const collectionPreferencesProps = {
        pageSizePreference,
        contentDisplayPreference,
        title: 'Set Beer Table Preferences',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
    };

    return collectionPreferencesProps
};
