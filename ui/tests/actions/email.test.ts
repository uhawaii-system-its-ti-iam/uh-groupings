import User from '@/access/user';
import { Feedback, sendFeedback, sendStackTrace } from '@/actions/email';
import * as AuthenticationService from '@/access/authentication';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
const testUser: User = JSON.parse(process.env.TEST_USER_A as string);

jest.mock('@/access/authentication');

describe('email', () => {

    const currentUser =  testUser;

    beforeAll(() => {
        jest.spyOn(AuthenticationService, 'getCurrentUser').mockResolvedValue(testUser);
    });

    describe('sendFeedback', () => {

        const feedback: Feedback = {
            name: 'name',
            email: 'email',
            type: 'type',
            message: 'message'
        };

        it('should make a POST request at the correct endpoint', async () => {
            await sendFeedback(feedback);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/email/send/feedback`, {
                body: JSON.stringify(feedback),
                headers: {
                    'current_user': currentUser.uid,
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
        });
    });

    describe('sendStackTrace', () => {

        const stackTrace = 'stackTrace';

        it('should make a POST request at the correct endpoint', async () => {
            await sendStackTrace(stackTrace);
            expect(fetch).toHaveBeenCalledWith(`${baseUrl}/email/send/stack-trace`, {
                body: stackTrace,
                headers: {
                    'current_user': currentUser.uid,
                    'Content-Type': 'text/plain'
                },
                method: 'POST'
            });
        });
    });
    
});
