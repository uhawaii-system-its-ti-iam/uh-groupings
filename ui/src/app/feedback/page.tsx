import FeedbackForm from '@/app/feedback/_components/feedback-form';
import { getCurrentUser } from '@/access/authentication';

const Feedback = async () => {
    const currentUser = await getCurrentUser();

    return (
        <div className="container grid sm:grid-cols-12 pt-5 pb-4 h-full 2xl:min-h-[72.3vh]">
            <div className="col-span-5 pt-5">
                <h1 className="text-center md:text-left text-[2rem] font-bold">Feedback</h1>
                <p className="text-center md:text-left text-xl mt-1">
                    Helps us to understand where improvements are needed. Please let us know.
                </p>
            </div>
            <div className="col-span-7 lg:pl-3">
                <FeedbackForm currentUser={currentUser} />
            </div>
        </div>
    );
};

export default Feedback;
