'use client';

import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    RowSelectionState
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PaginationBar from '@/components/table/table-element/pagination-bar';
import GlobalFilter from '@/components/table/table-element/global-filter';
import SortArrow from '@/components/table/table-element/sort-arrow';
import React, { useState, useTransition } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/button';
import SearchInput from '@/app/admin/_components/search-input';
import personTableColumns from '@/components/table/person-table/table-element/person-table-columns';
import PersonTableTooltip from '@/app/admin/_components/person-table-tooltip';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { groupingOwners, removeFromGroups } from '@/lib/actions';
// import RemoveMemberModal from '@/components/modal/remove-member-modal';
import TestDynamicModal from '@/components/modal/test-dynamic-modal';
import OwnersModal from '@/components/modal/owners-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MembershipResults, MemberResult } from '@/lib/types';
import { faUpRightFromSquare, faWebAwesome } from '@fortawesome/free-solid-svg-icons';
import { Label } from '@/components/ui/label';
import { AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GroupingsTableSkeleton from '@/components/table/groupings-table/groupings-table-skeleton';
import PersonTableSkeleton from '@/components/table/person-table/person-table-skeleton';

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE as string);

const PersonTable = ({
    membershipResults,
    memberResult,
    uhIdentifier
}: {
    membershipResults: MembershipResults;
    memberResult: undefined | MemberResult;
    uhIdentifier: undefined | string;
}) => {
    console.log(membershipResults);
    const [isPending, startTransition] = useTransition();
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const validUid = membershipResults.resultCode;
    const [showWarning, setShowWarning] = useState(
        (validUid === 'FAILURE' && uhIdentifier !== undefined) ||
            (validUid === undefined && uhIdentifier !== '') ||
            uhIdentifier === ''
    );
    const [showRemoveWarning, setShowRemoveWarning] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDesc, setModalDesc] = useState(<></>);
    const [modalBody, setModalBody] = useState(<></>);
    const [modalButtons, setModalButtons] = useState(<></>);
    // const [modalData, setModalData] = useState([]);
    const [dummyBool, setDummyBool] = useState(false);
    const router = useRouter();
    const groupingsInfo = membershipResults.results;
    const userInfo = memberResult;
    const [uid, setUid] = useState('');
    const [searchCounter, setSearchCounter] = useState(0);

    const handleKeyDown = (e) => {
        setSearchCounter(0);
        if (e.key === 'Enter' || e.key === 'click') {
            startTransition(() => {
                router.push(`?uhIdentifier=${uid}`);
                setShowWarning(
                    (validUid === 'FAILURE' && uhIdentifier !== undefined) ||
                        (validUid === undefined && uhIdentifier !== '') ||
                        uhIdentifier === ''
                );
                setSearchCounter(0);
            });
        }
    };

    // const hydrateModal = async (path) => {
    //     setModalData((await groupingOwners(path)).members);
    //     setModalOpen(true);
    // };

    const openOwnersModal = async (path) => {
        const modalData = (await groupingOwners(path)).members;
        setModalOpen(true);
        setModalTitle('Owners');
        setModalDesc(<></>);
        setModalBody(
            <AlertDialogDescription className="relative max-h-[13rem] overflow-auto">
                <div className="flex">
                    <div className="pe-5">
                        <b className="text-s">USERNAME</b>
                        {modalData.map((member) => (
                            <div key={member.uid} className="py-1">
                                {member.uid}
                            </div>
                        ))}
                    </div>
                    <div className="px-5">
                        <b className="text-s">UH Number</b>
                        {modalData.map((member) => (
                            <div key={member.uid} className="py-1">
                                {member.uhUuid}
                            </div>
                        ))}
                    </div>
                    <div className="ps-5">
                        <b className="text-s">NAME</b>
                        {modalData.map((member) => (
                            <div key={member.uid} className="py-1">
                                {member.name}
                            </div>
                        ))}
                    </div>
                </div>
            </AlertDialogDescription>
        );
        setModalButtons(<Button onClick={() => setModalOpen(false)}>Ok</Button>);
    };

    const validRemove = () => {
        const anyChecked = table.getSelectedRowModel().rows.length;
        anyChecked > 0 ? openRemoveModal() : setShowRemoveWarning(true);
    };

    const openRemoveModal = () => {
        let list = '';
        const removeList = table.getSelectedRowModel().rows.flatMap(({ original }) => {
            const { path } = original;
            return path.split(':').pop();
        });
        removeList.forEach((path) => {
            list = list + path.toString() + ', ';
        });
        list = list.substring(0, list.length - 2);
        setModalOpen(true);
        setModalTitle('Remove Member From Groups');
        setModalDesc(
            <>
                You are about to remove the following member from the <span>{list}</span> list(s).
            </>
        );
        setModalBody(
            <>
                {/*<AlertDialogDescription>*/}
                {/*    You are about to remove the following member from the <span>{list}</span> list(s).*/}
                {/*</AlertDialogDescription>*/}
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
                <div className="px-3">
                    <Alert className="bg-yellow-100 border border-yellow-200 mb-2">
                        <AlertDescription>
                            Membership changes made may not take effect immediately. Usually, 3-5 minutes should be
                            anticipated. In extreme cases changes may take several hours to be fully processed,
                            depending on the number of members and the synchronization destination.
                        </AlertDescription>
                    </Alert>
                </div>
            </>
        );
        setModalButtons(
            <>
                <Button onClick={() => handleRemove()}>Yes</Button>
                <AlertDialogCancel onClick={() => setModalOpen(false)}>Cancel</AlertDialogCancel>
            </>
        );
    };

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
            <TestDynamicModal
                open={modalOpen}
                title={modalTitle}
                description={modalDesc}
                // body={modalBody}
                buttons={modalButtons}
            >
                {modalBody}
            </TestDynamicModal>
            <div className="hidden md:block mb-5">
                <div className="flex flex-row justify-between items-center pt-8 mb-1">
                    <div className="flex flex-row w-full">
                        <h1 className="text-[2rem] inline font-medium text-text-color justify-start">Manage Person</h1>
                        {userInfo !== undefined && (
                            <p className="text-[1.2rem] inline font-small text-text-color justify-end px-1 pt-3">
                                {'(' + userInfo.name + ', ' + userInfo.uid + ', ' + userInfo.uhUuid + ')'}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end block w-72 mb-1">
                        <GlobalFilter
                            placeholder="Filter Groupings..."
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                        />
                    </div>
                </div>
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
                                onFocus={() => (searchCounter < 1 ? setShowWarning(true) : setShowWarning(false))}
                                onBlur={() => {
                                    setShowWarning(false);
                                    setSearchCounter(searchCounter + 1);
                                }}
                            />
                            <Button
                                className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3"
                                onClick={handleKeyDown}
                                onFocus={() => (searchCounter < 1 ? setShowWarning(true) : setShowWarning(false))}
                                onBlur={() => {
                                    setShowWarning(false);
                                    setSearchCounter(searchCounter + 1);
                                }}
                            >
                                Search
                            </Button>
                        </div>
                    </label>
                    <label>
                        <div>
                            Check All
                            <input
                                className="mx-2"
                                type="checkbox"
                                name="checkAll"
                                checked={userInfo === undefined ? dummyBool : table.getIsAllPageRowsSelected()}
                                onChange={
                                    userInfo === undefined
                                        ? () => setDummyBool(!dummyBool)
                                        : table.getToggleAllPageRowsSelectedHandler()
                                }
                            />
                            <Button
                                variant="destructive"
                                onClick={
                                    userInfo === undefined
                                        ? () => void 0
                                        : // openRemoveModal
                                          validRemove
                                }
                                onBlur={() => setShowRemoveWarning(false)}
                            >
                                Remove
                            </Button>
                        </div>
                    </label>
                </div>
                {validUid === 'FAILURE' && uhIdentifier !== undefined && showWarning && (
                    <Alert variant="destructive" className="w-fit mt-4 mb-5">
                        <AlertDescription>{uhIdentifier} is not in any grouping.</AlertDescription>
                    </Alert>
                )}
                {validUid === undefined && uhIdentifier !== '' && showWarning && (
                    <Alert variant="destructive" className="w-fit mt-4 mb-5">
                        <AlertDescription>
                            There was an error searching for {uhIdentifier}. <br />
                            Please ensure you have entered a valid UH member and try again.
                        </AlertDescription>
                    </Alert>
                )}
                {uhIdentifier === '' && showWarning && (
                    <Alert variant="destructive" className="w-fit mt-4 mb-5">
                        <AlertDescription>You must enter a UH member to search.</AlertDescription>
                    </Alert>
                )}
                {showRemoveWarning && (
                    <Alert variant="destructive" className="w-fit float-right mt-4 mb-5">
                        <AlertDescription>No Groupings have been selected.</AlertDescription>
                    </Alert>
                )}
            </div>
            <div className="md:hidden">
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
                <div className="flex flex-row justify-between items-center mb-1">
                    <label>
                        <div className="flex flex-row w-56 items-center">
                            <Input
                                type="search"
                                className="flex flex-col rounded-[-0.25rem] rounded-l-[0.25rem]"
                                maxLength={8}
                                defaultValue={uhIdentifier === null || uhIdentifier === '' ? '' : uhIdentifier}
                                placeholder="UH Username"
                                onChange={(e) => setUid(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => (searchCounter < 1 ? setShowWarning(true) : setShowWarning(false))}
                                onBlur={() => {
                                    setShowWarning(false);
                                    setSearchCounter(searchCounter + 1);
                                }}
                            />
                            <Button
                                className="rounded-[-0.25rem] rounded-r-[0.25rem] pr-3"
                                onClick={handleKeyDown}
                                onFocus={() => (searchCounter < 1 ? setShowWarning(true) : setShowWarning(false))}
                                onBlur={() => {
                                    setShowWarning(false);
                                    setSearchCounter(searchCounter + 1);
                                }}
                            >
                                Search
                            </Button>
                        </div>
                    </label>
                    <div className="flex justify-end mb-1">
                        <GlobalFilter
                            placeholder="Filter Groupings..."
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                        />
                    </div>
                </div>
                <label>
                    <div className="flex justify-end items-center mb-4">
                        Check All
                        <input
                            className="mx-2"
                            type="checkbox"
                            name="checkAll"
                            checked={userInfo === undefined ? dummyBool : table.getIsAllPageRowsSelected()}
                            onChange={
                                userInfo === undefined
                                    ? () => setDummyBool(!dummyBool)
                                    : table.getToggleAllPageRowsSelectedHandler()
                            }
                        />
                        <Button
                            variant="destructive"
                            onClick={
                                userInfo === undefined
                                    ? () => void 0
                                    : // openRemoveModal
                                      validRemove
                            }
                            onBlur={() => setShowRemoveWarning(false)}
                        >
                            Remove
                        </Button>
                    </div>
                </label>
                {validUid === 'FAILURE' && uhIdentifier !== undefined && showWarning && (
                    <Alert variant="destructive" className="w-fit mb-5">
                        <AlertDescription>{uhIdentifier} is not in any grouping.</AlertDescription>
                    </Alert>
                )}
                {validUid === undefined && uhIdentifier !== '' && showWarning && (
                    <Alert variant="destructive" className="w-fit mb-5">
                        <AlertDescription>
                            There was an error searching for {uhIdentifier}. <br />
                            Please ensure you have entered a valid UH member and try again.
                        </AlertDescription>
                    </Alert>
                )}
                {uhIdentifier === '' && showWarning && (
                    <Alert variant="destructive" className="w-fit mb-5">
                        <AlertDescription>You must enter a UH member to search.</AlertDescription>
                    </Alert>
                )}
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
                                                                            href={`/groupings/${cell.row.original.path}`}
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
                                                                        className="max-w-[190px] max-h-[180px] text-center whitespace-normal break-words
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
                                                                                    openOwnersModal(
                                                                                        cell.row.original.path
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent
                                                                        className="max-w-[190px] max-h-[180px] text-center
                                                                    whitespace-normal break-words bg-black text-white"
                                                                        side="right"
                                                                    >
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
            {userInfo !== undefined && <PaginationBar table={table} />}
        </>
    );
};

export default PersonTable;
