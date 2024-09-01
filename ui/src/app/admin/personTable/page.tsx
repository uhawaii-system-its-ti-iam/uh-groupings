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
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                        Red
                    </button>
                </div>
            </div>
            <div>table?</div>
        </div>
    );
};

export default PersonTable;
