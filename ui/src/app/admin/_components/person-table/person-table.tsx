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
import { AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { groupingOwners, removeFromGroups } from '@/lib/actions';
import { MemberResult, MembershipResults } from '@/lib/types';
import OwnersModal from '@/components/modal/owners-modal';
import DynamicModal from '@/components/modal/dynamic-modal';
import PersonTableSkeleton from '@/app/admin/_components/person-table/person-table-skeleton';
import personTableColumns from '@/app/admin/_components/person-table/table-element/person-table-columns';

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
    // Set up the isPending state and startTransition functions for the skeleton loading file
    const [isPending, startTransition] = useTransition();
    // Set up the different states of the table
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    // Set up the open state of the Remove functionality warning
    const [showRemoveWarning, setShowRemoveWarning] = useState(false);
    // Set up the states of the Dynamic and Owners Modals
    const [openOwnersModal, setOpenOwnersModal] = useState(false);
    const [ownersModalData, setOwnersModalData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState(<></>);
    const [modalWarning, setModalWarning] = useState('');
    // Set up the router object
    const router = useRouter();
    // Set up and rename the props used in the table
    const resultCode = membershipResults.resultCode;
    const groupingsInfo = membershipResults.results;
    const userInfo = memberResult;
    // Set up the states for the search input field and button
    const [uid, setUid] = useState('');
    const [searchCounter, setSearchCounter] = useState(0);

    // Set up the Owners Modal's data and open the modal
    const hydrateOwnersModal = async (path) => {
        setOwnersModalData((await groupingOwners(path)).immediateOwners.members);
        setOpenOwnersModal(true);
    };

    // Check if there are any checked boxes in the table and open the remove modal if so, if not show the Remove warning
    const validRemove = () => {
        const anyChecked = table.getSelectedRowModel().rows.length;
        anyChecked > 0 ? openRemoveModal() : setShowRemoveWarning(true);
    };

    // Get the list of paths that are checked, set up the props of the Dynamic Modal, and open the modal
    const openRemoveModal = () => {
        const list = table
            .getSelectedRowModel()
            .rows.map(({ original }) => original.path.split(':').pop())
            .filter((path) => path)
            .join(', ');
        setModalOpen(true);
        setModalTitle('Remove Member From Groups');
        setModalBody(
            <>
                <AlertDialogDescription>
                    You are about to remove the following member from the <span>{list}</span> list(s).
                </AlertDialogDescription>
                <div className="grid grid-cols-2">
                    <div className="grid">
                        <div className="grid grid-cols-3 items-center py-1 px-4">
                            <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                NAME:
                            </Label>
                        </div>
                        <div className="grid grid-cols-3 items-center py-1 px-4">
                            <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                UH USERNAME:
                            </Label>
                        </div>
                        <div className="grid grid-cols-3 items-center py-1 px-4">
                            <Label htmlFor="name" className="font-bold text-s text-left whitespace-nowrap">
                                UH USER ID:
                            </Label>
                        </div>
                    </div>

                    {/*second column*/}

                    <div className="grid">
                        <div className="grid grid-cols-3 items-center">
                            <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                {userInfo?.name}
                            </Label>
                        </div>
                        <div className="grid grid-cols-4 items-center">
                            <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                {userInfo?.uid}
                            </Label>
                        </div>
                        <div className="grid grid-cols-4 items-center">
                            <Label htmlFor="name" className="text-s text-left whitespace-nowrap">
                                {userInfo?.uhUuid}
                            </Label>
                        </div>
                    </div>
                </div>
                <AlertDialogDescription>
                    Are you sure you want to remove{' '}
                    <span
                        className="font-bold
                        text-text-color"
                    >
                        {userInfo?.name}
                    </span>{' '}
                    from the <span>{list}</span> list(s)?
                </AlertDialogDescription>
            </>
        );
        setModalWarning(
            'Membership changes made may not take effect immediately. Usually, 3-5 minutes should be\n' +
                'anticipated. In extreme cases changes may take several hours to be fully processed,\n' +
                'depending on the number of members and the synchronization destination.'
        );
    };

    /**
     * Get all the different groupings that the uhIdentifier is being removed from, make the API call, reset the
     * table's selection, close the modal, and refresh the table component
     */
    const handleRemove = async () => {
        const groups = table.getSelectedRowModel().rows.flatMap(({ original }) => {
            const { path, inOwner, inInclude, inExclude } = original;
            return [inOwner && `${path}:owners`, inInclude && `${path}:include`, inExclude && `${path}:exclude`].filter(
                (groupPath) => groupPath
            );
        });
        await removeFromGroups(uhIdentifier, groups);
        setRowSelection({});
        setModalOpen(false);
        router.refresh();
    };

    /**
     * If the Enter/return keys are pressed or the Search button is clicked, start the transition with the skeleton
     * file, reset the searchCounter, and navigate to /admin/manage-person?uhIdentifier=uid
     *
     * @param e - The interaction or event
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            startTransition(() => {
                setSearchCounter(0);
                table.resetRowSelection();
                router.push(`?uhIdentifier=${uid}`);
            });
        }
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
            <DynamicModal
                open={modalOpen}
                title={modalTitle}
                body={modalBody}
                warning={modalWarning}
                buttons={[
                    <button onClick={() => handleRemove()} key="remove">
                        Yes
                    </button>
                ]}
                closeText="Cancel"
                onClose={() => setModalOpen(false)}
            />
            <OwnersModal open={openOwnersModal} onClose={() => setOpenOwnersModal(false)} modalData={ownersModalData} />
            {/* Layout for medium-sized screens and above */}
            <div className="flex-col hidden md:block mb-5">
                <div className="flex flex-row justify-between items-center pt-8 mb-1">
                    <div className="flex flex-row w-full">
                        <h1 className="text-[2rem] inline font-medium text-text-color justify-start">Manage Person</h1>
                        {!isPending && userInfo !== undefined && (
                            <p className="text-[1.2rem] inline font-small text-text-color justify-end px-1 pt-3">
                                {'(' + userInfo.name + ', ' + userInfo.uid + ', ' + userInfo.uhUuid + ')'}
                            </p>
                        )}
                    </div>
                    {((searchCounter > 0 && showWarning) || !showWarning) && (
                        <div className="flex justify-end w-72 mb-1">
                            <GlobalFilter
                                placeholder="Filter Groupings..."
                                filter={globalFilter}
                                setFilter={setGlobalFilter}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center mb-1">
                        <label>
                            <div className="flex flex-row w-72 items-center">
                                <Input
                                    type="search"
                                    className="flex flex-col rounded-[-0.25rem] rounded-l-[0.25rem]"
                                    maxLength={8}
                                    defaultValue={uhIdentifier === undefined || uhIdentifier === '' ? '' : uhIdentifier}
                                    placeholder="UH Username"
                                    onChange={(e) => setUid(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => setSearchCounter(searchCounter + 1)}
                                />
                                <Button
                                    className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3"
                                    onClick={handleKeyDown}
                                    onBlur={() => setSearchCounter(searchCounter + 1)}
                                >
                                    Search
                                </Button>
                            </div>
                        </label>
                        {searchCounter === 0 && showWarning && (
                            <div className="flex justify-end w-72 mb-1">
                                <GlobalFilter
                                    placeholder="Filter Groupings..."
                                    filter={globalFilter}
                                    setFilter={setGlobalFilter}
                                />
                            </div>
                        )}
                        {(searchCounter > 0 || !showWarning) && (
                            <label>
                                <div>
                                    Check All
                                    <input
                                        className="mx-2"
                                        type="checkbox"
                                        name="checkAll"
                                        disabled={resultCode !== 'SUCCESS' || groupingsInfo.length === 0}
                                        checked={
                                            resultCode !== 'SUCCESS' || groupingsInfo.length === 0
                                                ? false
                                                : table.getIsAllPageRowsSelected()
                                        }
                                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                                    />
                                    <Button
                                        variant="destructive"
                                        onClick={userInfo === undefined ? () => void 0 : validRemove}
                                        onBlur={() => setShowRemoveWarning(false)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </label>
                        )}
                    </div>
                    {resultCode !== 'SUCCESS' &&
                        uhIdentifier !== undefined &&
                        uhIdentifier !== '' &&
                        searchCounter < 1 &&
                        showWarning && (
                            <div className="flex flex-row justify-between">
                                <Alert variant="destructive" className="w-fit mt-2">
                                    <AlertDescription>
                                        There was an error searching for {uhIdentifier}. <br />
                                        Please ensure you have entered a valid UH member and try again.
                                    </AlertDescription>
                                </Alert>
                                <label className="justify-end content-end">
                                    <div>
                                        Check All
                                        <input
                                            className="mx-2"
                                            type="checkbox"
                                            name="checkAll"
                                            disabled={resultCode !== 'SUCCESS' || groupingsInfo.length === 0}
                                            checked={
                                                resultCode !== 'SUCCESS' || groupingsInfo.length === 0
                                                    ? false
                                                    : table.getIsAllPageRowsSelected()
                                            }
                                            onChange={table.getToggleAllPageRowsSelectedHandler()}
                                        />
                                        <Button
                                            variant="destructive"
                                            onClick={userInfo === undefined ? () => void 0 : validRemove}
                                            onBlur={() => setShowRemoveWarning(false)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </label>
                            </div>
                        )}
                    {uhIdentifier === '' && searchCounter < 1 && showWarning && (
                        <div className="flex flex-row justify-between">
                            <Alert variant="destructive" className="w-fit mt-2">
                                <AlertDescription>You must enter a UH member to search.</AlertDescription>
                            </Alert>
                            <label className="justify-end content-end">
                                <div>
                                    Check All
                                    <input
                                        className="mx-2"
                                        type="checkbox"
                                        name="checkAll"
                                        disabled={resultCode !== 'SUCCESS' || groupingsInfo.length === 0}
                                        checked={
                                            resultCode !== 'SUCCESS' || groupingsInfo.length === 0
                                                ? false
                                                : table.getIsAllPageRowsSelected()
                                        }
                                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                                    />
                                    <Button
                                        variant="destructive"
                                        onClick={userInfo === undefined ? () => void 0 : validRemove}
                                        onBlur={() => setShowRemoveWarning(false)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </label>
                        </div>
                    )}
                    {showRemoveWarning && (
                        <div className="w-full">
                            <Alert variant="destructive" className="w-fit float-right mt-2">
                                <AlertDescription>No Groupings have been selected.</AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
            {/* Layout for small to just below medium-sized screens */}
            <div className="sm:block hidden md:hidden">
                <div className="flex flex-row justify-between items-center pt-8 mb-1">
                    <div className="flex flex-row w-full">
                        <h1 className="text-[2rem] inline font-medium text-text-color justify-start">Manage Person</h1>
                        {userInfo !== undefined && (
                            <p className="text-[0.1]rem inline font-small text-text-color ps-2 pt-4">
                                {'(' + userInfo.name + ', ' + userInfo.uid + ', ' + userInfo.uhUuid + ')'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-2">
                    <label>
                        <div className="flex flex-row w-56 items-center">
                            <Input
                                type="search"
                                className="flex flex-col rounded-[-0.25rem] rounded-l-[0.25rem]"
                                maxLength={8}
                                defaultValue={uhIdentifier === undefined || uhIdentifier === '' ? '' : uhIdentifier}
                                placeholder="UH Username"
                                onChange={(e) => setUid(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => setSearchCounter(searchCounter + 1)}
                            />
                            <Button
                                className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3"
                                onClick={handleKeyDown}
                                onBlur={() => setSearchCounter(searchCounter + 1)}
                            >
                                Search
                            </Button>
                        </div>
                    </label>
                    <div className="flex justify-end items-center">
                        <GlobalFilter
                            placeholder="Filter Groupings..."
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                        />
                    </div>
                </div>
                <div className="flex flex-row mb-2 justify-between">
                    {resultCode !== 'SUCCESS' &&
                        uhIdentifier !== undefined &&
                        uhIdentifier !== '' &&
                        searchCounter < 1 &&
                        showWarning && (
                            <Alert variant="destructive" className="max-w-fit justify-start">
                                <AlertDescription>
                                    There was an error searching for {uhIdentifier}. <br />
                                    Please ensure you have entered a valid UH member and try again.
                                </AlertDescription>
                            </Alert>
                        )}
                    {uhIdentifier === '' && searchCounter < 1 && showWarning && (
                        <Alert variant="destructive" className="max-w-fit justify-start">
                            <AlertDescription>You must enter a UH member to search.</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex justify-end items-center w-full mt-auto">
                        <label>
                            <div className="flex justify-end items-center w-48 ">
                                Check All
                                <input
                                    className="mx-2"
                                    type="checkbox"
                                    name="checkAll"
                                    disabled={resultCode !== 'SUCCESS' || groupingsInfo.length === 0}
                                    checked={
                                        resultCode !== 'SUCCESS' || groupingsInfo.length === 0
                                            ? false
                                            : table.getIsAllPageRowsSelected()
                                    }
                                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                                />
                                <Button
                                    variant="destructive"
                                    onClick={userInfo === undefined ? () => void 0 : validRemove}
                                    onBlur={() => setShowRemoveWarning(false)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </label>
                    </div>
                </div>
                {showRemoveWarning && (
                    <Alert variant="destructive" className="w-fit float-right mb-5">
                        <AlertDescription>No Groupings have been selected.</AlertDescription>
                    </Alert>
                )}
            </div>
            {/* Layout for screens smaller than sm */}
            <div className="sm:hidden">
                <div className="flex flex-col justify-items-start items-center pt-8 mb-1">
                    <h1 className="text-[2rem] inline font-medium text-text-color w-full">Manage Person</h1>
                    {userInfo !== undefined && (
                        <p className="text-[0.1]rem inline font-small text-text-color w-full">
                            {'(' + userInfo.name + ', ' + userInfo.uid + ', ' + userInfo.uhUuid + ')'}
                        </p>
                    )}
                </div>
                <div className="flex flex-col w-full justify-items-start items-center mb-2">
                    <div className="w-full bg-white mb-2">
                        <label>
                            <div className="flex flex-row items-center">
                                <Input
                                    type="search"
                                    className="flex rounded-[-0.25rem] rounded-l-[0.25rem]"
                                    maxLength={8}
                                    defaultValue={uhIdentifier === undefined || uhIdentifier === '' ? '' : uhIdentifier}
                                    placeholder="UH Username"
                                    onChange={(e) => setUid(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => setSearchCounter(searchCounter + 1)}
                                />
                                <Button
                                    className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3"
                                    onClick={handleKeyDown}
                                    onBlur={() => setSearchCounter(searchCounter + 1)}
                                >
                                    Search
                                </Button>
                            </div>
                        </label>
                    </div>
                    <div className="w-full mb-2">
                        {resultCode !== 'SUCCESS' &&
                            uhIdentifier !== undefined &&
                            uhIdentifier !== '' &&
                            searchCounter < 1 &&
                            showWarning && (
                                <Alert variant="destructive" className="max-w-fit">
                                    <AlertDescription>
                                        There was an error searching for {uhIdentifier}. <br />
                                        Please ensure you have entered a valid UH member and try again.
                                    </AlertDescription>
                                </Alert>
                            )}
                        {uhIdentifier === '' && searchCounter < 1 && showWarning && (
                            <Alert variant="destructive" className="max-w-fit">
                                <AlertDescription>You must enter a UH member to search.</AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <div className="flex flex-row w-full justify-between items-center mb-2">
                        <GlobalFilter
                            placeholder="Filter Groupings..."
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                        />
                        <div className="flex justify-end items-center w-full">
                            <label>
                                <div className="flex justify-end items-center w-48 ">
                                    Check All
                                    <input
                                        className="mx-2"
                                        type="checkbox"
                                        name="checkAll"
                                        disabled={resultCode !== 'SUCCESS' || groupingsInfo.length === 0}
                                        checked={
                                            resultCode !== 'SUCCESS' || groupingsInfo.length === 0
                                                ? false
                                                : table.getIsAllPageRowsSelected()
                                        }
                                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                                    />
                                    <Button
                                        variant="destructive"
                                        onClick={userInfo === undefined ? () => void 0 : validRemove}
                                        onBlur={() => setShowRemoveWarning(false)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
                {showRemoveWarning && (
                    <Alert variant="destructive" className="w-fit float-right mb-5">
                        <AlertDescription>No Groupings have been selected.</AlertDescription>
                    </Alert>
                )}
            </div>
            {isPending ? (
                <PersonTableSkeleton />
            ) : (
                <Table className="relative overflow-x-auto">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
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
                    {userInfo !== undefined && (
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} width={cell.column.columnDef.size}>
                                            <div className="flex items-center px-2 overflow-hidden whitespace-nowrap">
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
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </div>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger className="ml-auto mr-3">
                                                                        <div>
                                                                            <FontAwesomeIcon
                                                                                className="ml-1"
                                                                                icon={faWebAwesome}
                                                                                data-testid={'fa-web-awesome-icon'}
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
                                                                        {/* eslint-disable-next-line
                                                                        react/no-unescaped-entities */}
                                                                        <p>Display the grouping's owners</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    )}
                                                </div>
                                                {cell.column.id !== 'name' && (
                                                    <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                                                )}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            )}
            {userInfo !== undefined && !isPending && <PaginationBar table={table} />}
        </>
    );
};

export default PersonTable;
