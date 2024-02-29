import User from "@/access/User";
import Role from "@/access/Role";
import Image from 'next/image';
import React from "react";
import {KeyRound} from "lucide-react";
import UserInfoItem from "@/components/home/UserInfoItem";

const AfterLogin = ({
                        currentUser,
                        numberOfGroupings,
                        numberOfMemberships
                    }: {
    currentUser: User,
    numberOfGroupings: number,
    numberOfMemberships: number
}) => {
    const isAdmin = currentUser.roles.includes(Role.ADMIN);
    const isOwner = currentUser.roles.includes(Role.OWNER);
    const getHighestRole = () => isAdmin ? "Admin" : isOwner ? "Owner" : "Member";

    return (
        <main>
            <div className="bg-seafoam pt-5 pb-5">
                <div className="container bg-seafoam pt-7 pb-7">
                    <div className="grid sm:grid-cols-12 text-center justify-center items-center gap-4">
                        <div className="sm:col-span-3 md:col-span-2">
                            <div
                                className="flex justify-center items-center rounded-full h-[100px] w-[100px] bg-white mx-auto relative lg:ml-0">
                                <Image
                                    src="/uhgroupings/user-solid.svg"
                                    alt="user-solid"
                                    width={56}
                                    height={64}
                                />
                                <div
                                    className="bg-blue-background rounded-full flex justify-center items-center h-[30px] w-[30px] absolute left-3 bottom-0 ml-16">
                                    <KeyRound className="fill-white stroke-none p-0.5"/>
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-9 md:col-span-10 text-center md:text-left">
                            <h1 className="whitespace-nowrap text-1.75">Welcome, <span
                                className="text-text-color">{currentUser.firstName}</span>!</h1>
                            <h1 className="whitespace-nowrap text-1.75">Role: <span
                                className="text-text-color">{getHighestRole()}</span></h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10 mb-10">
                {isAdmin && <UserInfoItem
                    alt={"key-soild"}
                    src={"uhgroupings/key-solid.svg"}
                    number={0}
                    show={false}
                    title={"Administration"}
                    description={"Manage the list of Administrators for this service. Search for and manage any grouping on behalf of the owner."}
                    link={"/admin"}
                    text={"Admin"}
                />}
                <UserInfoItem
                    alt={"id-card"}
                    src={"uhgroupings/id-card-solid.svg"}
                    number={numberOfMemberships}
                    show={true}
                    title={"Memberships"}
                    description={"View and manage my memberships. Search for new groupings to join as a member."}
                    link={"/memberships"}
                    text={"Memberships"}
                />
                {isOwner && <UserInfoItem
                    alt={"wrench-solid"}
                    src={"uhgroupings/wrench-solid.svg"}
                    number={numberOfGroupings}
                    show={true}
                    title={"Groupings"}
                    description={"Review members, manage Include and Exclude lists, configure preferences, and export members."}
                    link={"/groupings"}
                    text={"Groupings"}
                />}
            </div>
        </main>
    );
}

export default AfterLogin;
