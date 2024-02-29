import Image from 'next/image';
import BeforeLogin from '@/components/home/BeforeLogin';
import AfterLogin from '@/components/home/AfterLogin';
import {getCurrentUser} from '@/access/AuthenticationService';
import Role from '@/access/Role';
import LoginButton from "@/components/home/LoginButton";
import {getAnnouncements, getNumberOfGroupings, getNumberOfMemberships} from "@/services/GroupingsApiService";
import React from "react";
import Announcement from "@/components/home/Announcement";

const Home = async () => {
    const [currentUser, groupings, memberships, fetchedAnnouncements] = await Promise.all([
        getCurrentUser(),
        getNumberOfGroupings(),
        getNumberOfMemberships(),
        getAnnouncements()
    ]);
    const numberOfGroupings = typeof groupings === "number" ? groupings : 0;
    const numberOfMemberships = typeof memberships === "number" ? memberships : 0;
    const announcements = fetchedAnnouncements.hasOwnProperty("announcements") ? fetchedAnnouncements.announcements
        .filter((announcement) => announcement.state === "Active")
        .map((announcement) => announcement.message) : [];

    return (
        <main>
            <div className="container mt-5 mb-5">
                {announcements.map((announcement: String) => (
                    <div>
                        <Announcement announcement={announcement}/>
                    </div>
                ))}
                <div className="flex flex-row py-8 px-0.5 justify-between">
                    <div className=":md:w-7/12 flex items-center">
                        <div>
                            <h1 className="sr-only">UH Groupings</h1>
                            <Image
                                src="uhgroupings/uh-groupings-text.svg"
                                alt="UH Groupings logotype"
                                width={337.5}
                                height={52.5}
                                className="w-1/2 h-auto md:w-[337.5px] md:h-[52.5px]"
                            />

                            <p className="text-xl mt-1" > Manage your groupings in one place, use them in many.</p>
                            <div className="mt-4">
                                {currentUser ? (
                                    <LoginButton currentUser={currentUser}/>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block md:w-5/12">
                        <Image
                            src="/uhgroupings/uh-groupings-logo-large.svg"
                            alt="UH Groupings"
                            width={365.5}
                            height={292.5}
                        />
                    </div>
                </div>
            </div>

            {currentUser && currentUser.roles.includes(Role.UH) ? (
                <AfterLogin currentUser={currentUser} numberOfGroupings={numberOfGroupings}
                            numberOfMemberships={numberOfMemberships}/>
            ) : (
                <BeforeLogin/>
            )}
        </main>
    );
}
export default Home;
