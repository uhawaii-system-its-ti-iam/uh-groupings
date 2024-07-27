import { Button } from '@/components/ui/button';

const GroupingHeader = ({
                            selectedGrouping,
                            descriptionDisplay,
                            editDescription,
                            descriptionLoaded,
                            descriptionForm,
                            modelDescription,
                            setModelDescription,
                            maxDescriptionLength,
                            saveDescription,
                            cancelDescriptionEdit,
                            descriptionLengthWarning
                        }) => (
    <div className="card-header teal-bg">
        <div className="row" id="selectedGroupHeader">
            <div className="col-md-8" id="groupNameCol">
                {selectedGrouping.name && (
                    <h2 className="card-title text-light mb-0">{selectedGrouping.name}</h2>
                )}
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <p className="text-light mb-0"><b>Path:</b> {selectedGrouping.path}</p>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                {descriptionLoaded ? (
                    <p className="text-light mb-0 text-break">
                        <b>Description:</b> {descriptionDisplay()} &nbsp;
                        <Button
                            onClick={editDescription}
                            className="far fa-fw fa-edit mr-2 teal-bg border-0 text-light tool"
                            data-placement="top"
                            aria-label="Edit Description"
                            role="button"
                        >
                        </Button>
                    </p>
                ) : (
                    <p className="text-light mb-0">
                        <b>Description:</b> {descriptionDisplay()}
                    </p>
                )}



                <div className="grouping-description-form">
                    <form className="d-flex mw-100 rounded bg-white ng-pristine ng-valid">
                        <input
                            className="form-control border-0 float-left edit-description-input-box"
                            aria-label="Grouping Description"
                            //th:title="#{screen.message.admin.selectedGrouping.descriptionFormTitle}"
                            //th:placeholder="#{screen.message.admin.selectedGrouping.descriptionPlaceholder}"
                            //ng-value="groupingDescription"
                            //ng-model="modelDescription"
                            value={modelDescription}
                            onChange={(e) => setModelDescription(e.target.value)}
                            maxLength={maxDescriptionLength}
                            //ng-trim="false"
                        />
                        <span className="grouping-description-form">
                            <button
                                type="button"
                                aria-label="Save description"
                                className="description-form-button"
                                //tooltip="Save description"
                                //data-placement="top"
                                onClick={saveDescription}
                            >
                                <i className="far fa-check-circle fa-2x" role="button" aria-hidden="true"></i>
                            </button>
                        </span>
                        <span className="grouping-description-form">
                            <button
                                type="button"
                                aria-label="Cancel changes"
                                className="description-form-button rounded-right"
                                //tooltip="Cancel changes" data-placement="top"
                                onClick={cancelDescriptionEdit}
                            >
                                <i className="far fa-times-circle fa-2x" role="button" aria-hidden="true"></i>
                            </button>
                        </span>
                    </form>
                    {descriptionLengthWarning && (
                        <div className="float-md-left alert alert-danger h-50 pt-2 pb-0 pl-2 pr-2 mb-1 mt-1 border fade show">
                            {/*<p th:utext="#{screen.message.admin.selectedGrouping.descriptionWarning}"></p>*/}
                        </div>
                    )}
                </div>

            </div>
        </div>
    </div>
);

export default GroupingHeader;
