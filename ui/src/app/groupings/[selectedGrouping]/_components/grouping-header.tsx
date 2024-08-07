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


    <div className="p-3.5 mb-0 border-b border-gray-200 mt-4 rounded-tl-none mt-0 bg-uh-teal">
        <div className="flex flex-row block mx-auto w-full p-0">
            <div className="md:w-2/3 table-footer-group">
                {selectedGrouping && (
                    <h2 className="card-title text-gray-100 mb-0 text-[2rem]">{selectedGrouping}</h2>
                )}
            </div>
        </div>

        <div className="flex flex-row">
            <div className="md:w-full">
                <p className="text-gray-100 mb-0">
                    <b>Path:</b> {selectedGrouping.path}
                </p>
            </div>
        </div>

        <div className="flex flex-row">
            <div className="md:w-full">
                {descriptionLoaded ? (
                    <p className="text-gray-100 mb-0 break-words">
                        <b>Description:</b> {descriptionDisplay()} &nbsp;
                        <button
                            onClick={editDescription}
                            className="far fa-fw fa-edit mr-2 teal-bg border-0 text-light tool"
                            data-placement="top"
                            aria-label="Edit Description"
                            role="button"
                        ></button>
                    </p>
                ) : (
                    <p className="text-gray-100 mb-0">
                        <b>Description:</b> {descriptionDisplay()}
                    </p>
                )}


                <div className="grouping-description-form">
                    <form className="d-flex mw-100 rounded bg-white ng-pristine ng-valid hidden">
                        <input
                            className="form-control border-0 float-left edit-description-input-box"
                            aria-label="Grouping Description"
                            value={modelDescription}
                            onChange={(e) => setModelDescription(e.target.value)}
                            maxLength={maxDescriptionLength}
                        />
                        <span className="grouping-description-form">
                          <button
                              type="button"
                              aria-label="Save description"
                              className="description-form-button"
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
                            onClick={cancelDescriptionEdit}
                        >
                          <i className="far fa-times-circle fa-2x" role="button" aria-hidden="true"></i>
                        </button>
                      </span>
                    </form>
                  {descriptionLengthWarning && (
                      <div
                          className="float-md-left alert alert-danger h-50 pt-2 pb-0 pl-2 pr-2 mb-1 mt-1 border fade hidden">
                        {/*<p th:utext="#{screen.message.admin.selectedGrouping.descriptionWarning}"></p>*/}
                      </div>
                    )}
                </div>


            </div>
        </div>
    </div>
);

export default GroupingHeader;
