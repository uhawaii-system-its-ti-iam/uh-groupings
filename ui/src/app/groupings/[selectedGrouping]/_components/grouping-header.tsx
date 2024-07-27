'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCircleCheck, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { updateDescription } from '@/lib/actions';
import { Alert } from '@/components/ui/alert';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReducer } from 'react';

const GroupingHeader = ({ groupName, groupDescription, groupPath }: { groupName: string, groupDescription: string, groupPath: string }) => {
    type State = { isFormVisible: boolean; description: string };
    type Action =
        | { type: 'TOGGLE_FORM' }
        | { type: 'CLOSE_FORM' }
        | { type: 'UPDATE_DESCRIPTION'; payload: string };

    const initialState: State = { isFormVisible: false, description: groupDescription };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'TOGGLE_FORM':
                return { ...state, isFormVisible: !state.isFormVisible };
            case 'CLOSE_FORM':
                return { ...state, isFormVisible: false };
            case 'UPDATE_DESCRIPTION':
                return { ...state, description: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const schema = z.object({
        description: z.string()
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
        watch,
    } = useForm<z.infer<typeof schema>>({
        defaultValues: {
            description: groupDescription
        },
        resolver: zodResolver(schema)
    });

    const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
        await updateDescription(data.description, groupPath);
        dispatch({ type: 'UPDATE_DESCRIPTION', payload: data.description });
        dispatch({ type: 'CLOSE_FORM' });
    };

    const currentDescription = watch('description', state.description);

    const closeForm = () => {
        reset({ description: state.description });
        dispatch({ type: 'CLOSE_FORM' });
    };

    return (
        <div className="py-3 px-5 border-b box-border rounded-b-none rounded-t mt-4 mt-0 bg-uh-teal">
            <div className="flex flex-row table m-auto w-full p-0">
                <div className="md:w-2/3 table-footer-group">
                    {groupName && (
                        <h2 className="text-gray-100 mb-0 text-[2rem] text-center md:text-left">
                            {groupName}
                        </h2>
                    )}
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
                    <p className="text-gray-100 mb-0 break-words">
                        <b>Description:</b> {state.description} &nbsp;
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
                            className="text-white mr-2 font-normal bg-uh-teal text-center w-5 rounded-none"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>

                        {state.isFormVisible && (
                            <div className="relative">
                                <form className="max-w-full flex rounded bg-white" onSubmit={handleSubmit(onSubmit)}>
                                    <input
                                        className="rounded-r-none float-left border-0 block w-full h-[calc(1.5em+0.75rem+2px)] p-[0.375rem_0.75rem] text-base font-normal leading-6 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none"
                                        {...register('description')}
                                        placeholder="Description"
                                        maxLength={98}
                                    />
                                    <span>
                                        <button
                                            className="text-primary border-none bg-white text-text-color px-1 py-0.5 my-0 mx-0.5 h-9"
                                            disabled={isSubmitting}
                                            type="submit"
                                        >
                                            <FontAwesomeIcon className="text-[2rem]" role="button" aria-hidden="true" icon={faCircleCheck} />
                                        </button>
                                    </span>
                                    <span>
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="text-primary border-none bg-white text-text-color px-1 py-0.5 my-0 mx-0.5 h-9"
                                        >
                                            <FontAwesomeIcon className="text-[2rem]" role="button" aria-hidden="true" icon={faTimesCircle} />
                                        </button>
                                    </span>
                                </form>
                                {currentDescription.length === 98 && (
                                    <Alert className="bg-red-100 text-[rgb(114,28,36)] lg:w-max lg:h-[50px] md:w-max md:h-[50px] sm:h-1/2 pt-2 pl-2 pr-2 mb-1 mt-1 border">
                                        <strong>Maximum length reached. </strong>A grouping&apos;s description cannot exceed 98 characters.
                                    </Alert>
                                )}
                            </div>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GroupingHeader;
