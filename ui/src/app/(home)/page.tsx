import Image from 'next/image';
import BeforeLogin from '@/app/(home)/_components/before-login';
import AfterLogin from '@/app/(home)/_components/after-login';
import Role from '@/lib/access/role';
import LoginButton from '@/app/(home)/_components/login-button';
import Announcements from '@/app/(home)/_components/announcements';
import { getUser } from '@/lib/access/user';

const Home = async () => {
    const currentUser = await getUser();

    return (
        <main>
            <div className="container mt-5 mb-5">
                <Announcements />
                <div className="flex flex-row py-8 px-0.5 justify-between">
                    <div className="md:w-7/12 flex items-center">
                        <div>
                            <h1 className="sr-only">UH Groupings</h1>
                            <Image
                                src="/uhgroupings/uh-groupings-text.svg"
                                alt="UH Groupings logotype"
                                width={337.5}
                                height={52.5}
                                className="w-[210px] h-[32.67px] sm:w-1/2 sm:h-auto md:w-[337.5px] md:h-[52.5px]"
                            />

                            <p className="text-xl mt-1"> Manage your groupings in one place, use them in many.</p>
                            <div className="mt-4">
                                <LoginButton currentUser={currentUser} />
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

            {currentUser.roles.includes(Role.UH) ? <AfterLogin /> : <BeforeLogin />}
        </main>
    );
};

export default Home;
