'use client';

import DescriptionForm from './description-form';

const GroupingHeader = ({
    groupName,
    groupDescription,
    groupPath
}: {
    groupName: string;
    groupDescription: string;
    groupPath: string;
}) => {
    return (
        <div className="py-3 px-5 border-b box-border rounded-b-none rounded-t mt-4 mt-0 bg-uh-teal">
            <div className="flex flex-row table m-auto w-full p-0">
                <div className="md:w-2/3 table-footer-group">
                    <h2 className="text-gray-100 mb-0 text-[2rem] text-center md:text-left">{groupName}</h2>
                </div>
            </div>

            <div className="flex-row">
                <div className="md:w-full">
                    <p className="text-gray-100 mb-0">
                        <b>Path:</b> {groupPath}
                    </p>
                </div>
            </div>

            <div className="flex-row">
                <div className="md:w-full">
                    <DescriptionForm groupDescription={groupDescription} groupPath={groupPath} />
                </div>
            </div>
        </div>
    );
};

export default GroupingHeader;
