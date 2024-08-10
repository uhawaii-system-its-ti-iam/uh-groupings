const NavbarMenuIcon = ({ open }: { open: boolean }) => (
    <div className="flex flex-col justify-center items-center">
        <span
            data-open={open}
            className={`bg-gray-600 block transition-all transform duration-300 ease-out h-0.5 w-5
                        rounded-lg data-[open=true]:rotate-45 data-[open=true]:translate-y-1 -translate-y-0.5`}
        />
        <span
            data-open={open}
            className={`bg-gray-600 block transition-all transform duration-300 ease-out h-0.5 w-5 
                        rounded-lg my-0.5 data-[open=true]:opacity-0 opacity-100`}
        />
        <span
            data-open={open}
            className={`bg-gray-600 block transition transform duration-300 ease-out h-0.5 w-5 
                        rounded-lg data-[open=true]:-rotate-45 data-[open=true]:-translate-y-1 translate-y-0.5`}
        />
    </div>
);

export default NavbarMenuIcon;
