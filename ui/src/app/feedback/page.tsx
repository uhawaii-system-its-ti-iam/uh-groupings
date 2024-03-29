"use client"
import React, {useState} from 'react';
import ErrorAlert from "@/components/layout/alerts/ErrorAlert";
import SuccessAlert from "@/components/layout/alerts/SuccessAlert";
import FeedbackForm from "@/app/feedback/components/FeedbackForm";

const Feedback = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  return (
      <>
        <div id="successAlert" hidden={!showSuccessAlert} className="container">
          <SuccessAlert isActive={showSuccessAlert}></SuccessAlert>
        </div>
        <div id="errorAlert" hidden={!showErrorAlert} className="container">
          <ErrorAlert isActive={showErrorAlert}></ErrorAlert>
        </div>
        <div className="container grid grid-cols-12 pt-5 pb-4">
          <div className="col-span-5 pt-5">
            <h1 className="text-md-left text-3xl font-bold">Feedback</h1>
            <p className="text-md-left text-xl mt-3">Helps us to understand where improvements are needed. Please let us know.</p>
          </div>
          <div className="col-span-7 pl-5 pt-5">
            <FeedbackForm setShowSuccessAlert={setShowSuccessAlert} setShowErrorAlert={setShowErrorAlert}></FeedbackForm>
          </div>
        </div>
      </>
  )
}

export default Feedback;
