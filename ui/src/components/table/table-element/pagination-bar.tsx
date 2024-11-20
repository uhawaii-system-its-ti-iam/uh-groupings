import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/table-core';

const PaginationBar = <T,>({ table }: { table: Table<T> }) => {
    const activePage = table.getState().pagination.pageIndex;
    const pageRange = 2;
    const startPage = Math.max(0, activePage - pageRange);
    const endPage = Math.min(table.getPageCount() - 1, activePage + pageRange);

    return (
        <Pagination className="flex justify-end pt-3 pb-3 text-green-blue">
            <PaginationContent className="border rounded gap-0">
                <PaginationItem key={'first'} className="px-2 hover:bg-light-grey">
                    <PaginationLink
                        onClick={() => {
                            if (table.getCanPreviousPage()) {
                                table.firstPage();
                            }
                        }}
                        className={!table.getCanPreviousPage() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    >
                        <DoubleArrowLeftIcon className="mr-1" />
                        First
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem key={'prev'} className="border-l">
                    <PaginationPrevious
                        onClick={() => {
                            if (table.getCanPreviousPage()) {
                                table.previousPage();
                            }
                        }}
                        className={`${
                            !table.getCanPreviousPage() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                    />
                </PaginationItem>
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((i) => (
                    <PaginationItem key={i} className="border-x">
                        <PaginationLink
                            onClick={() => {
                                table.setPageIndex(i);
                            }}
                            className={`rounded-none border-transparent cursor-pointer ${
                                i === activePage ? 'bg-light-green text-black cursor-default' : 'hover:bg-light-grey'
                            }`}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem key={'next'}>
                    <PaginationNext
                        onClick={() => {
                            if (table.getCanNextPage()) {
                                table.nextPage();
                            }
                        }}
                        className={`${!table.getCanNextPage() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    />
                </PaginationItem>
                <PaginationItem key={'last'} className="px-2 border-l hover:bg-light-grey">
                    <PaginationLink
                        data-testid="pagination-last"
                        onClick={() => {
                            if (table.getCanNextPage()) {
                                table.lastPage();
                            }
                        }}
                        className={
                            !table.getCanNextPage() || table.getRowCount() === Infinity
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                        }
                    >
                        <span className="pr-1">Last</span>
                        <DoubleArrowRightIcon />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationBar;
