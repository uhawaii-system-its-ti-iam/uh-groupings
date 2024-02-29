import React from "react";
import Image from "next/image";
import About from "@/app/about/page";
import AboutInfoItem from "@/components/AboutInfoItem";

const UHGroupingsInfo = ({h1Color, h1Weight, AboutInfoItemSize}: { h1Color: string, h1Weight: string, AboutInfoItemSize?: string }) => {
    const textSize = AboutInfoItemSize ? AboutInfoItemSize : "text-base";
    return (
        <div>
            <div className="bg-seafoam pt-10 pb-10">
                <div className="container">
                    <div className="grid">
                        <h1 className={`text-center text-2.5 ${h1Weight} ${h1Color}`}>What is a UH Grouping?</h1>
                        <p className="text-center text-1.25">A <em>grouping</em> is a collection of members
                            (e.g., all full-time
                            Hilo faculty).</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-3">
                        <AboutInfoItem
                            pSize={textSize}
                            src={"/uhgroupings/cogs.svg"}
                            alt={"Cogs icon"}
                            description={"Create groupings, manage grouping memberships, control members' self-service options, designate sync destinations, and more."}/>
                        <AboutInfoItem
                            pSize={textSize}
                            src={"/uhgroupings/id-email.svg"}
                            alt={"Email icon"}
                            description={"Synchronize groupings email LISTSERV lists, attributes for access control via CAS and LDAP, etc.."}/>
                        <AboutInfoItem
                            pSize={textSize}
                            src={"/uhgroupings/watch.svg"}
                            alt={"Watch icon"}
                            description={"Leverage group data from official sources, which can substantially reduce the manual overhead of membership management."}/>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default UHGroupingsInfo;