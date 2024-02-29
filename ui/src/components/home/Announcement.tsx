'use client';
import React, {useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";

const Announcement = ({announcement}: { announcement: String }
) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        open && (
            <Alert className="bg-[#fff2b2] mb-3">
                <AlertDescription className="px-2">
                    {announcement}
                </AlertDescription>
                <button onClick={handleClose} className="absolute top-0 right-0 m-3 text-xl">
                    <span>&times;</span>
                </button>
            </Alert>
        )
    );
};

export default Announcement;
