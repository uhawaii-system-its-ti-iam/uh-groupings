'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCircleCheck, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { updateDescription } from '@/lib/actions';
import { Alert } from '@/components/ui/alert';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReducer } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

const DescriptionForm = ({ groupDescription, groupPath }: { groupDescription: string; groupPath: string }) => {
    const router = useRouter();
    type State = { isFormVisible: boolean; description: string };
    type Action = { type: 'TOGGLE_FORM' } | { type: 'CLOSE_FORM' } | { type: 'UPDATE_DESCRIPTION'; payload: string };

    const initialState: State = { isFormVisible: false, description: groupDescription };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'TOGGLE_FORM':
                return { ...state, isFormVisible: !state.isFormVisible };
            case 'CLOSE_FORM':
                return { ...state, isFormVisible: false };
            case 'UPDATE_DESCRIPTION':
                return { ...state, description: action.payload };
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
        watch
    } = useForm<z.infer<typeof schema>>({
        defaultValues: {
            description: groupDescription
        },
        resolver: zodResolver(schema)
    });

    const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
        const finalDescription =
            data.description.trim() === '' ? 'No description given for this Grouping.' : data.description;
        await updateDescription(finalDescription, groupPath);
        dispatch({ type: 'UPDATE_DESCRIPTION', payload: finalDescription });
        dispatch({ type: 'CLOSE_FORM' });
        router.refresh();
    };

    const currentDescription = watch('description', state.description);

    const closeForm = () => {
        reset({ description: state.description });
        dispatch({ type: 'CLOSE_FORM' });
    };

    return (
        <div>
            <p className="text-gray-100 mb-0 break-words">
                <b>Description:</b> {state.description} &nbsp;
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => dispatch({ type: 'TOGGLE_FORM' })}
                                className="text-white mr-2 font-normal bg-uh-teal text-center rounded-none"
                                aria-label="edit"
                            >
                                <FontAwesomeIcon icon={faEdit} className="w-5 h-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-48 text-center border-none">
                            Edit this grouping&apos;s description
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {state.isFormVisible && (
                    <div className="relative">
                        <form className="max-w-full flex rounded bg-white" onSubmit={handleSubmit(onSubmit)}>
                            <input
                                className="rounded-r-none float-left border-0 block w-full h-[calc(1.5em+0.75rem+2px)] p-[0.375rem_0.75rem] text-base font-normal leading-6 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none"
                                {...register('description')}
                                placeholder="Brief description for this grouping..."
                                maxLength={98}
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="text-primary border-none bg-white text-text-color px-1 py-0.5 my-0 mx-0.5 h-9"
                                            disabled={isSubmitting}
                                            type="submit"
                                            aria-label="circle-check"
                                        >
                                            <FontAwesomeIcon
                                                className="text-[2rem]"
                                                role="button"
                                                aria-hidden="true"
                                                icon={faCircleCheck}
                                            />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-48 text-center border-none">
                                        Save description
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            onClick={closeForm}
                                            className="text-primary border-none bg-white text-text-color px-1 py-0.5 my-0 mx-0.5 h-9"
                                            aria-label="times-circle"
                                        >
                                            <FontAwesomeIcon
                                                className="text-[2rem]"
                                                role="button"
                                                aria-hidden="true"
                                                icon={faTimesCircle}
                                            />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-48 text-center border-none">
                                        Cancel changes
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </form>
                        {currentDescription.length >= 98 && (
                            <Alert
                                data-testid="description-alert"
                                className="bg-rose-100 text-rose-900 lg:w-max lg:h-[50px] md:w-max md:h-[50px] sm:h-1/2 pt-2.5 pl-2 pr-2 mb-1 mt-1 border"
                            >
                                <strong>Maximum length reached. </strong>A grouping&apos;s description cannot exceed 98
                                characters.
                            </Alert>
                        )}
                    </div>
                )}
            </p>
        </div>
    );
};

export default DescriptionForm;
