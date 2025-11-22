'use client';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowSelectionState,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare, faWebAwesome } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getNumberOfDirectOwners, groupingOwners, removeFromGroups } from '@/lib/actions';
import { MemberResult, MembershipResults } from '@/lib/types';
import OwnersModal from '@/components/modal/owners-modal';
import DynamicModal from '@/components/modal/dynamic-modal';
import PersonTableSkeleton from '@/app/admin/_components/person-table/person-table-skeleton';
import personTableColumns from '@/app/admin/_components/person-table/table-element/person-table-columns';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const PersonTable = ({
                         membershipResults,
                         memberResult,
                         uhIdentifier,
                         showWarning
                     }: {
    membershipResults?: MembershipResults;
    memberResult?: MemberResult;
    uhIdentifier?: undefined | string;
    showWarning: boolean;
}) => {
    // Table states
    const [isPending, startTransition] = useTransition();
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    // Modal states
    const [openOwnersModal, setOpenOwnersModal] = useState(false);
    const [ownersModalData, setOwnersModalData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(<></>);
    const [modalWarning, setModalWarning] = useState('');
    const [modalButton, setModalButton] = useState([]);
    const [modalCloseText, setModalCloseText] = useState(false);
    // Search states
    const router = useRouter();
    const resultCode = membershipResults.resultCode;
    const groupingsInfo = membershipResults.results;
    const userInfo = memberResult;
    const [uid, setUid] = useState('');
    const [searchCounter, setSearchCounter] = useState(-1);
    // Other flags
    const [showRemoveWarning, setShowRemoveWarning] = useState(false);
    const [error, setError] = useState('');
    const isDisabled = resultCode !== 'SUCCESS' || groupingsInfo.length === 0;

    /**
     * Returns an error message if input from the Search bar is invalid; otherwise, returns an empty string.
     *
     * @param input - The user input from the Search bar
     */
    const validateInput = (input: string) => {
        if (!input) return 'You must enter a UH member to search';
        if (input.includes(' ') || input.includes(',')) return 'You can only search one UH member at a time';
        return '';
    };

    /**
     * If the Enter/return keys are pressed or the Search button is clicked, starts the transition with the skeleton
     * file, resets the searchCounter, and navigates to /admin/manage-person?uhIdentifier=identifier
     */
    const handleSearch = () => {
        const identifier = (uid ?? '').toString().trim();
        const validationError = validateInput(identifier);

        if (validationError) {
            setError(validationError);
            showWarning = false;
            return;
        }

        setError('');
        startTransition(() => {
            setSearchCounter(0);
            table.resetRowSelection();
            router.push(`?uhIdentifier=${identifier}`);
        });
    };

    /**
     * Sets up the owners modal data and opens the modal.
     *
     * @param path - The current path
     */
    const hydrateOwnersModal = async (path) => {
        const members = (await groupingOwners(path))?.owners?.members ?? [];
        setOwnersModalData(members);
        setOpenOwnersModal(true);
    };

    /**
     * Opens the remove modal if there are any checked boxes in the table. If not, shows the remove warning.
     */
    const validRemove = () => {
        const anyChecked = table.getSelectedRowModel().rows.length;
        anyChecked > 0 ? openRemoveModal() : setShowRemoveWarning(true);
    };

    /**
     * Gets the list of selected paths, sets up the props for the Dynamic modal, and opens the appropriate modal.
     */
    const openRemoveModal = async () => {
        const list = table
            .getSelectedRowModel()
            .rows.map(({ original }) => original.path.split(':').pop())
            .filter((path) => path)
            .join(', ');

        const groupPaths = table.getSelectedRowModel().rows.flatMap(({ original }) => {
            const { path, inOwner } = original;
            return [inOwner && `${path}:owners`].filter(
                (groupPath) => groupPath
            );
        });

        startTransition(() => {
            (async () => {
                const ownerGroups = groupPaths.filter((path) => path.endsWith(':owners'));
                const soleOwnerGroups: string[] = [];
                for (const groupPath of ownerGroups) {
                    const groupName = groupPath.replace(':owners', '');

                    const result = await getNumberOfDirectOwners(groupName);
                    if (result === 1 && groupName) {
                        soleOwnerGroups.push(groupName);
                    }
                }

                if (soleOwnerGroups.length > 0) {
                    setModalOpen(true);
                    setModalTitle('Error Removing User');
                    setModalBody(
                        <>
                            You are unable to remove this owner. There must be at least one owner remaining.
                            {'\n\n'}
                            The user you are trying to remove is the sole direct owner of the following
                            grouping(s): <span>{soleOwnerGroups.join(', ')}</span>.
                        </>
                    );
                    setModalWarning('');
                    setModalButton([<span key="closeSoleOwner" data-testid="close-sole-owner">Close</span>]);
                    setModalCloseText(false);
                    return;
                }

                setModalOpen(true);
                setModalTitle('Remove Member From Groups');
                setModalBody(
                    <>
                        You are about to remove the following member from the <span>{list}</span> list(s).
                        <span className="grid grid-cols-2 mb-2 mt-2">
                    <span className="grid">
                        <span className="grid grid-cols-4 items-center py-1 px-4">
                            <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                NAME:
                            </Label>
                        </span>
                        <span className="grid grid-cols-4 items-center py-1 px-4">
                            <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                UH USERNAME:
                            </Label>
                        </span>
                        <span className="grid grid-cols-4 items-center py-1 px-4">
                            <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                UH USER ID:
                            </Label>
                        </span>
                    </span>

                    <span className="grid">
                        <span className="grid grid-cols-2 items-center">
                            <Label htmlFor="name" className="text-s text-left whitegrid grid-cols-2space-nowrap">
                                {userInfo?.name}
                            </Label>
                        </span>
                        <span className="grid grid-cols-4 items-center">
                            <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                {userInfo?.uid.toLowerCase()}
                            </Label>
                        </span>
                        <span className="grid grid-cols-4 items-center">
                            <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                {userInfo?.uhUuid}
                            </Label>
                        </span>
                    </span>
                </span>
                        Are you sure you want to remove{' '}
                        <span className="font-bold text-text-color">
                            {userInfo?.name}
                        </span>{' '}
                        from the <span>{list}</span> list(s)?
                    </>
                );
                setModalWarning(
                    'Membership changes made may not take effect immediately. Usually, 3-5 minutes should be\n' +
                    'anticipated. In extreme cases changes may take several hours to be fully processed,\n' +
                    'depending on the number of members and the synchronization destination.'
                );
                setModalButton([<span key="remove" onClick={() => handleRemove()}
                                      data-testid="yes-button">Yes</span>
                ]);
                setModalCloseText(true);
            })();
        });
    };

    /**
     * Gets all the different groupings that the uhIdentifier is being removed from, makes the API call, resets the
     * table's selection, closes the modal, and refreshes the table component.
     */
    const handleRemove = async () => {
        const groupPaths = table.getSelectedRowModel().rows.flatMap(({ original }) => {
            const { path, inOwner, inInclude, inExclude } = original;
            return [inOwner && `${path}:owners`, inInclude && `${path}:include`, inExclude && `${path}:exclude`].filter(
                (groupPath) => groupPath
            );
        });
        if (uhIdentifier) {
            await removeFromGroups(uhIdentifier, groupPaths);
        }
        setRowSelection({});
        setModalOpen(false);
        router.refresh();
    };

    const table = useReactTable({
        columns: personTableColumns,
        data: groupingsInfo,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, sorting, rowSelection },
        initialState: { pagination: { pageSize } },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection
    });

    return (
        <>
            {/* Remove Member from Grouping(s) Modal */}
            <DynamicModal
                open={modalOpen}
                title={modalTitle}
                body={modalBody}
                warning={modalWarning}
                buttons={modalButton}
                closeText={modalCloseText ? 'Cancel' : undefined}
                onClose={() => setModalOpen(false)}
            />
            {/* Owners data Modal */}
            <OwnersModal open={openOwnersModal} onClose={() => setOpenOwnersModal(false)} modalData={ownersModalData}
                         data-testid={'owners-modal'} />
            <div className="w-full pt-5 pb-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Manage Person heading */}
                    <div className="flex flex-col lg:flex-row lg:items-start md:items-start sm:items-start ">
                        <h1 className="text-[2rem] font-medium text-text-color">Manage Person</h1>
                        {isPending && <Spinner className="text-[1.2rem] font-small text-text-color" size="default"
                                               data-testid="spinner" />}
                        {!isPending && userInfo !== undefined && (
                            <h2 className="text-[1.2rem] lg:mt-2 md:mt-0 sm:mt-0 font-small text-text-color">
                                {'(' + userInfo.name + ', ' + userInfo.uid.toLowerCase() + ', ' + userInfo.uhUuid + ')'}
                            </h2>
                        )}
                    </div>
                    {/* Filter bar */}
                    <div className="w-full lg:w-52 md:w-52 p-0">
                        <GlobalFilter
                            placeholder="Filter Groupings..."
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Search bar */}
                    <div className="mr-auto w-full lg:w-52 md:w-52 p-0">
                        <form
                            className="flex items-center w-full"
                            onSubmit={(input) => {
                                input.preventDefault();
                                handleSearch();
                            }}
                        >
                            <Input
                                id="Search Person"
                                name="Search Person"
                                type="search"
                                className="flex-1 w-full lg:w-52 md:w-52 rounded-[-0.25rem] rounded-l-[0.25rem]"
                                value={uid}
                                placeholder="UH Username"
                                onChange={(e) => setUid(e.target.value)}
                                onBlur={() => setSearchCounter(searchCounter + 1)}
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="rounded-l-none"
                                            name="search"
                                            type="submit"
                                            onBlur={() => setSearchCounter(searchCounter + 1)}
                                        >
                                            Search
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side={'right'}>
                                        <p>Specify a person to manage their grouping(s)</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </form>
                    </div>
                    {/* Check All and Remove buttons */}
                    <div>
                        <label className="my-auto">
                            Check All
                            <input
                                className="mx-2"
                                type="checkbox"
                                name="checkAll"
                                disabled={isDisabled}
                                checked={isDisabled ? false : table.getIsAllPageRowsSelected()}
                                onChange={table.getToggleAllPageRowsSelectedHandler()}
                            />
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (userInfo) validRemove();
                                }}
                                onBlur={() => setShowRemoveWarning(false)}
                            >
                                Remove
                            </Button>
                        </label>
                    </div>
                </div>
                {/* Conditions for no user data alert */}
                {resultCode !== 'SUCCESS' &&
                    uhIdentifier !== undefined &&
                    uhIdentifier !== '' &&
                    searchCounter < 1 &&
                    showWarning && (
                        <Alert variant="destructive" className="w-fit">
                            <AlertDescription>
                                No user data found for {uhIdentifier}. Check the entered UH member and try again.
                            </AlertDescription>
                        </Alert>
                    )}
                {/* User input validation error displays if set */}
                {error && (
                    <Alert variant="destructive" className="w-fit">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {showRemoveWarning && (
                    <Alert variant="destructive" className="w-fit lg:ml-auto md:ml-auto" data-testid="remove-warning">
                        <AlertDescription>No Groupings have been selected.</AlertDescription>
                    </Alert>
                )}
            </div>
            {isPending ? (
                <PersonTableSkeleton />
            ) : (
                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={`${header.column.id}`}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`${header.column.id === 'name' ? 'w-1/4' : 'w-1/12'}`}
                                            data-testid={header.id}
                                        >
                                            <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <SortArrow direction={header.column.getIsSorted()} />
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        {userInfo != undefined && (
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} width={cell.column.columnDef.size}>
                                                <div
                                                    className="flex items-center px-2 overflow-hidden whitespace-nowrap">
                                                    {/*The Grouping Name cell includes the Manage Grouping tooltip, Grouping Name, and Owners Modal tooltip*/}
                                                    <div className={`m-2 ${cell.column.id === 'name' ? 'w-full' : ''}`}>
                                                        {cell.column.id === 'name' && (
                                                            <div className="flex flex-row">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Link
                                                                                href={`/groupings/${cell.row.original.path}
                                                                            `}
                                                                                rel="noopener noreferrer"
                                                                                target="_blank"
                                                                            >
                                                                                <FontAwesomeIcon
                                                                                    className="ml-1"
                                                                                    icon={faUpRightFromSquare}
                                                                                    data-testid={
                                                                                        'fa-up-right-from-square-icon'
                                                                                    }
                                                                                />
                                                                            </Link>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent
                                                                            className="max-w-[190px] max-h-[180px]
                                                                        text-center whitespace-normal break-words
                                                                        bg-black text-white"
                                                                        >
                                                                            <p>Manage Grouping</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                                <div className="pl-3">
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </div>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger className="ml-auto mr-3">
                                                                            <div>
                                                                                <FontAwesomeIcon
                                                                                    className="ml-1"
                                                                                    icon={faWebAwesome}
                                                                                    data-testid={'owners-icon'}
                                                                                    onClick={() =>
                                                                                        hydrateOwnersModal(
                                                                                            cell.row.original.path
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent
                                                                            className="max-w-[190px] max-h-[180px]
                                                                        text-center whitespace-normal break-words
                                                                        bg-black text-white"
                                                                            side="right"
                                                                        >
                                                                            <p>Display the grouping&apos;s owners</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/*The rest of the cells e.g., Owner?, Basis?, etc. */}
                                                    {cell.column.id !== 'name' && (
                                                        <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                                                    )}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>)}
                    </Table>
                </div>
            )}
            <div className="pt-3">
                {userInfo !== undefined && !isPending && <PaginationBar table={table} />}
            </div>
        </>
    );
};

export default PersonTable;
