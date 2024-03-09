const Groupings = () => {
    return ( 
        <main>
            <div className="bg-seafoam pt-3">
                <div className="container">
                    <h1 className="mb-1 font-bold text-[2rem] text-center md:text-left">Manage My Groupings</h1>
                    <p className="pb-3 text-xl text-center md:text-left">
                        View and manage groupings I own. Manage members, 
                        configure grouping options and sync destinations.
                    </p>
                </div>
                <div className="bg-white">
                    <div className="container">
                        {/* GroupingsTable goes here */}
                    </div>
                </div>
            </div>
        </main>
    );
}
 
export default Groupings;
