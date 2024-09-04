import { Button } from '@/components/ui/button';

const PersonTable = () => {
    return (
        <div className="px-2">
            <div className="flex flex-col md:flex-row md:justify-between pt-1 mb-1">
                <h2 className="text-[2rem] font-medium text-text-color text-center pt-3">Manage Person</h2>
                <div>
                    <input
                        className="border border-gray-800"
                        name="filter-groupings"
                        type="search"
                        placeholder="Filter Groupings..."
                        aria-label="Filter Groupings for this person"
                        autoFocus={true}
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between pt-1 mb-1">
                <div>
                    <label>
                        <input
                            className="border border-gray-800"
                            name="search-name"
                            type="search"
                            placeholder="UH Username"
                            aria-label="Filter Groupings for this person"
                            autoFocus={true}
                        />
                    </label>
                    <Button>Search</Button>
                </div>

                <div>
                    <label>
                        Check All: <input type="checkbox" name="myCheckbox" />
                    </label>
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4
                            focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600
                            dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                        Red
                    </button>
                </div>
            </div>
            <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Grouping
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Owner?
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Basis?
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Include?
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Exclude?
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Remove
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="even:dark:bg-gray-900 even:bg-gray-50 odd:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    JTTEST-L
                                </th>
                                <td className="px-6 py-4">Yes</td>
                                <td className="px-6 py-4">No</td>
                                <td className="px-6 py-4">Yes</td>
                                <td className="px-6 py-4">No</td>
                                <td className="px-6 py-4">
                                    <input type="checkbox" />
                                </td>
                            </tr>
                            <tr className="even:dark:bg-gray-900 even:bg-gray-50 odd:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    acer-cc-ics
                                </th>
                                <td className="px-6 py-4">No</td>
                                <td className="px-6 py-4">No</td>
                                <td className="px-6 py-4">No</td>
                                <td className="px-6 py-4">Yes</td>
                                <td className="px-6 py-4">
                                    <input type="checkbox" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PersonTable;
