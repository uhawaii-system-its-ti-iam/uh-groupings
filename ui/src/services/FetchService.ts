'use server';

import { ApiError } from '../groupings/GroupingsApiResults';
import { getCurrentUser } from '@/access/AuthenticationService';

const maxRetries = 3;
const baseUrl = process.env.NEXT_PUBLIC_API_2_1_BASE_URL as string;

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
 * @returns The promise of type T or ApiError type
 */
const poll = async <T> (jobId: number): Promise<T & ApiError> => {
    const currentUser = await getCurrentUser();
    return fetch(`${baseUrl}/jobs/${jobId}`, { headers: { 'current_user': currentUser.uid } })
        .then(res => res.json())
        .then(async res => {
            if (res.status === 'COMPLETED') {
                return res.result;
            } 
            await delay();
            return poll<T>(jobId);
        })
        .catch(err => err);
};

/**
 * Perform a GET request to the specified URL.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * 
 * @returns The promise of type T or ApiError type
 */
export const getRequest = async <T> (
    endpoint: string,
    currentUserKey: string = ''
): Promise<T & ApiError> => 
    await fetch(endpoint, { headers: { 'current_user': currentUserKey } })
        .then(res => res.json())
        .catch(err => err);

/**
 * Perform a POST request to the specified URL.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const postRequest = async <T> (
    endpoint: string, 
    currentUserKey: string,
    body?: object | string | string[], 
): Promise<T & ApiError> => 
    await fetch(endpoint, { 
        method: 'POST', 
        headers: { 'current_user': currentUserKey }, 
        body: JSON.stringify(body)})
        .then(res => res.json())
        .catch(err => err);

/**
 * Perform a POST request to the specified URL asynchronously using polling.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const postRequestAsync = async <T> (
    endpoint: string,
    currentUserKey: string,
    body: string | string[]
): Promise<T & ApiError> => 
    await fetch(endpoint, { method: 'POST', headers: { 'current_user': currentUserKey }, body: JSON.stringify(body) })
        .then(res => res.json())
        .then(res => poll<T>(res))
        .catch(err => err);

/**
 * Perform a POST request to the specified URL with retries on error with incremental backoff.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const postRequestRetry = async <T> (
    endpoint: string, 
    currentUserKey: string,
    body: string | string[],
    retries: number = maxRetries
): Promise<T & ApiError> =>
    await fetch(endpoint, { method: 'POST', headers: { 'current_user': currentUserKey }, body: JSON.stringify(body) })
        .then(async res => {
            if (res.status === 500 && retries > 0) {
                await delay(2000 * Math.log(maxRetries / retries));
                return postRequestRetry(endpoint, currentUserKey, body, retries - 1);
            }
            return res.json();
        })
        .catch(err => err);
    

/**
 * Perform a PUT request to the specified URL.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const putRequest = async <T> (
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[]
): Promise<T & ApiError> => 
    await fetch(endpoint, { 
        method: 'PUT', 
        headers: { 'current_user': currentUserKey }, 
        body: JSON.stringify(body) })
        .then(res => res.json())
        .catch(err => err);

/**
 * Perform a PUT request to the specified URL asynchronously using polling.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const putRequestAsync = async <T> (
    endpoint: string,
    currentUserKey: string,
    body: string | string[]
): Promise<T & ApiError> => 
    await fetch(endpoint, { method: 'PUT', headers: { 'current_user': currentUserKey }, body: JSON.stringify(body) })
        .then(res => res.json())
        .then(res => poll<T>(res))
        .catch(err => err);

/**
 * Perform a DELETE request to the specified URL.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const deleteRequest = async <T> (
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[]
): Promise<T & ApiError> =>
    await fetch(endpoint, { method: 'DELETE', headers: { 'current_user': currentUserKey }, body: JSON.stringify(body) })
        .then(res => res.json())
        .then(res => (res))
        .catch(err => err);

/**
 * Perform a DELETE request to the specified URL asynchronously using polling.
 * 
 * @param endpoint - the URL to perform the request on
 * @param currentUserKey - the uhIdentifier of the current user
 * @param body - the request body to perform the request with
 * 
 * @returns The promise of type T or ApiError type
 */
export const deleteRequestAsync = async <T> (
    endpoint: string,
    currentUserKey: string,
    body?: object | string | string[]
): Promise<T & ApiError> => 
    await fetch(endpoint, {
        method: 'DELETE', 
        headers: { 'current_user': currentUserKey }, 
        body: JSON.stringify(body) })
        .then(res => res.json())
        .then(res => poll<T>(res))
        .catch(err => err);
