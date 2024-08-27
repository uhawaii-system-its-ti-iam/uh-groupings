import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Users, CreditCard, UserPlus, UserMinus, Crown, Share2, Settings, Wrench } from 'lucide-react';

import Actions from './actions';
import Preferences from './preferences';
import SyncDestinations from './sync-destinations';

// Dummy components for the pages

// SideNav Component
const SideNav = () => {
    const navigate = useNavigate();  // useNavigate hook for programmatic navigation

    const resetFields = () => {};
    const transferMembersFromPageToCheckboxObject = (grouping) => {};

    return (
        <ul className="flex md:flex-col sm:flex-row md:justify-start justify-center">
            <li className="px-0 mt-1 mx-auto pt-0" data-tip="All Members" data-place="right">
                <a href="#all" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                   aria-label="All Members" onClick={resetFields}>
                    <Users aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Basis Members" data-place="right">
                <a href="#basis" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                   aria-label="Basis Members" onClick={resetFields}>
                    <CreditCard aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Include Members" data-place="right">
                <a href="#include" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                   aria-label="Include Members" onClick={() => {
                    resetFields();
                    transferMembersFromPageToCheckboxObject(groupingInclude);
                }}>
                    <UserPlus aria-hidden="false" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Exclude Members" data-place="right">
                <a href="#exclude" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                   aria-label="Exclude Members" onClick={() => {
                    resetFields();
                    transferMembersFromPageToCheckboxObject(groupingExclude);
                }}>
                    <UserMinus aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Grouping Owners" data-place="right">
                <a href="#owners" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                   aria-label="Grouping Owners" onClick={resetFields}>
                    <Crown aria-hidden="true" />
                </a>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Sync Destinations" data-place="right">
                <Link to="/ui/src/app/groupings/1/_components/sync-destinations" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                      aria-label="Sync Destinations">
                    <Share2 aria-hidden="true" />
                </Link>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Preferences" data-place="right">
                <Link to="/ui/src/app/groupings/1/_components/preferences" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                      aria-label="Preferences">
                    <Settings aria-hidden="true" />
                </Link>
            </li>

            <li className="px-0 mt-1 mx-auto pt-0" data-tip="Actions" data-place="right">
                <Link to="/ui/src/app/groupings/1/_components/actions" className="nav-link pl-[0.75rem] rounded-circle d-flex items-center justify-center"
                      aria-label="Actions">
                    <Wrench aria-hidden="true" />
                </Link>
            </li>
        </ul>
    );
}

// Main App Component
const App = () => {
    return (
        <Router>
            <div className="flex">
                <SideNav />
                <div className="flex-grow p-4">
                    <Routes>
                        <Route path="/ui/src/app/groupings/1/_components/actions" element={<Actions />} />
                        <Route path="/ui/src/app/groupings/1/_components/preferences" element={<Preferences />} />
                        <Route path="/ui/src/app/groupings/1/_components/sync-destinations" element={<SyncDestinations />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;