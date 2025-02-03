import {sendStackTrace} from './actions';
import {getUser} from '@/lib/access/user';

const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

enum Status {
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS'
}

/**
 * Sleep/wait for the specified milliseconds.
 *
 * @param ms - the time in milliseconds to wait for
 *
 * @returns setTimeout promise
 */
const delay = async (ms = 5000) => new Promise((res) => setTimeout(res, ms));

/**
 * Polls to getAsyncJobResult API endpoint until the async job has completed with a result.
 *
 * @param jobId - the jobId returned from the response of an async endpoint
 *
 * @returns The promise of type T
 */
const poll = async <T>(jobId: number): Promise<T> => {
    const currentUser = await getUser();
    return await fetch(`${baseUrl}/jobs/${jobId}`, {headers: {current_user: currentUser.uid}})
        .then((res) => handleFetch(res, HTTPMethod.GET))
        .then(async (res) => {
            if (res.status === Status.COMPLETED) {
                return res.result;
            }
            await delay();
            return poll<T>(jobId);
        })
        .catch((err) => err);
};

/**
 * Perform a GET request to the specified URL.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 *
 * @returns The promise of type T
 */
export const getRequest = async <T>(endpoint: string, currentUserKey: string = ''): Promise<T> =>
    await fetch(endpoint, {headers: {current_user: currentUserKey}})
        .then((res) => handleFetch(res, HTTPMethod.GET))
        .catch((err) => err);

/**
 * Perform a POST request to the specified URL.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 *
 * @returns The promise of type T
 */
export const postRequest = async <T>(
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[],
    contentType = 'application/json'
): Promise<T> =>
    await fetch(endpoint, {
        method: HTTPMethod.POST,
        headers: {
            current_user: currentUserKey,
            'Content-Type': contentType
        },
        body: stringifyBody(body)
    })
        .then((res) => handleFetch(res, HTTPMethod.POST))
        .catch((err) => err);

/**
 * Perform a POST request to the specified URL asynchronously using polling.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 *
 * @returns The promise of type T
 */
export const postRequestAsync = async <T>(
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[],
    contentType = 'application/json'
): Promise<T> =>
    await fetch(endpoint, {
        method: HTTPMethod.POST,
        headers: {
            current_user: currentUserKey,
            'Content-Type': contentType
        },
        body: stringifyBody(body)
    })
        .then((res) => handleFetch(res, HTTPMethod.POST))
        .then((res) => poll<T>(res))
        .catch((err) => err);

/**
 * Perform a PUT request to the specified URL.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 *
 * @returns The promise of type T
 */
export const putRequest = async <T>(
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[],
    contentType = 'application/json'
): Promise<T> =>
    await fetch(endpoint, {
        method: HTTPMethod.PUT,
        headers: {
            current_user: currentUserKey,
            'Content-Type': contentType
        },
        body: stringifyBody(body)
    })
        .then((res) => handleFetch(res, HTTPMethod.PUT))
        .catch((err) => err);

/**
 * Perform a PUT request to the specified URL asynchronously using polling.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 *
 * @returns The promise of type T
 */
export const putRequestAsync = async <T>(
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[],
    contentType = 'application/json'
): Promise<T> =>
    await fetch(endpoint, {
        method: HTTPMethod.PUT,
        headers: {
            current_user: currentUserKey,
            'Content-Type': contentType
        },
        body: stringifyBody(body)
    })
        .then((res) => handleFetch(res, HTTPMethod.PUT))
        .then((res) => poll<T>(res))
        .catch((err) => err);

/**
 * Perform a DELETE request to the specified URL.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 *
 * @returns The promise of type T
 */
export const deleteRequest = async <T>(
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[],
    contentType = 'application/json'
): Promise<T> =>
    await fetch(endpoint, {
        method: HTTPMethod.DELETE,
        headers: {
            current_user: currentUserKey,
            'Content-Type': contentType
        },
        body: stringifyBody(body)
    })
        .then((res) => handleFetch(res, HTTPMethod.DELETE))
        .catch((err) => err);

/**
 * Perform a DELETE request to the specified URL asynchronously using polling.
 *
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 *
 * @returns The promise of type T
 */
export const deleteRequestAsync = async <T>(
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[],
    contentType = 'application/json'
): Promise<T> =>
    await fetch(endpoint, {
        method: HTTPMethod.DELETE,
        headers: {
            current_user: currentUserKey,
            'Content-Type': contentType
        },
        body: stringifyBody(body)
    })
        .then((res) => handleFetch(res, HTTPMethod.DELETE))
        .then((res) => poll<T>(res))
        .catch((err) => err);

/**
 * Helper function for the .then clause of a fetch promise.
 * Sends an email stack trace if an error is thrown.
 *
 * @param res - the response
 * @param httpMethod - the HTTPMethod
 *
 * @returns The res.json()
 */
const handleFetch = (res: Response, httpMethod: HTTPMethod) => {
    if (!res.ok) {
        const error = Error(`${res.status} error from ${httpMethod} ${res.url}`);
        sendStackTrace(error.stack as string);
    }
    return res.json();
};

/**
 * Helper function to JSON.stringify the body of a request or keep as a string
 * if the passed body is already a string.
 *
 * @param body - the body of a request
 *
 * @returns The stringified body
 */
const stringifyBody = (body: object | string | string[] | undefined) => {
    if (typeof body === 'string') {
        return body;
    }
    return JSON.stringify(body);
};
