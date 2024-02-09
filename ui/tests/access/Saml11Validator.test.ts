import { validateTicket } from '@/access/Saml11Validator';
import User, { AnonymousUser } from '@/access/User';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const testUser: User = JSON.parse(process.env.TEST_USER_A as string);
const xmlSoapResponse = process.env.XML_SOAP_RESPONSE as string;

describe('Saml11Validator', () => {

    describe('validateTicket', () => {
        
        let axiosMock: MockAdapter;

        beforeEach(() => {
            axiosMock = new MockAdapter(axios);
        });

        it('should return the user on success', async () => {
            axiosMock.onPost().reply(200, xmlSoapResponse);
            expect(await validateTicket('ticket')).toEqual(testUser);
        });

        it('should return an AnonymousUser on error', async () => {
            axiosMock.onPost().reply(500);
            expect(await validateTicket('ticket')).toEqual(AnonymousUser);
        });

    });

});
