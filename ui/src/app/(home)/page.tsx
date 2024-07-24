import Image from 'next/image';
import BeforeLogin from '@/app/(home)/_components/before-login';
import AfterLogin from '@/app/(home)/_components/after-login';
import { getCurrentUser } from '@/access/authentication';
import Role from '@/access/role';
import LoginButton from '@/app/(home)/_components/login-button';
import Announcements from '@/app/(home)/_components/announcements';

const Home = async () => {
    const currentUser = await getCurrentUser();

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
                                sizes="(max-width: 574px) 210px, (max-width: 767px) 285px,(min-width: 768px) 337.5px"
                                className="w-[210px] h-[32.925px] sm:w-[285px] sm:h-[44.688px] md:w-[337.5px] md:h-[52.5px]"
                            />

                            <p className="text-xl mt-1"> Manage your groupings in one place, use them in many.</p>
                            <div className="mt-4">
                                <LoginButton currentUser={currentUser}/>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block md:w-5/12">
                        <Image
                            src="/uhgroupings/uh-groupings-logo-large.svg"
                            alt="UH Groupings"
                            width={365.5}
                            height={293.688}
                            sizes="(max-width: 574px) 210px, (max-width: 991px) auto, (min-width: 992px) 365.5px"
                            className="w-[210px] h-[auto] sm:w-[auto] sm:h-[auto] lg:w-[365.5px] lg:h-[293.688px]"
                        />
                    </div>
                </div>
            </div>

            {currentUser.roles.includes(Role.UH) ? (
                <AfterLogin/>
            ) : (
                <BeforeLogin/>
            )}
        </main>
    );
}

export default Home;
