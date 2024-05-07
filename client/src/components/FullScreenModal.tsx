import React, { useCallback, useState,useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";

type PropsType = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: string | any;
  doctor: boolean;
};

const FullScreenModal = ({
  showModal,
  setShowModal,
  children,
  doctor,
  onActionClick,
  onActionRef
}: PropsType & { onActionClick?: (action: string) => void , onActionRef?:(action:any)=>void }) => {
  const [downloadBtn, setDownloadBtn] = useState<boolean>(true);
  const handleActionClick = useCallback((action: string) => {
    if (onActionClick) {
      onActionClick(action);
    }

    if (action === "review") {
      setDownloadBtn(false);
    }

    if(action === 'view'){
      setDownloadBtn(true)
    }
    
  },[onActionClick]);


  const componentPdf = useRef<any>(0);
  const generatePdf = useReactToPrint({
    content: () => componentPdf.current,
    documentTitle: "PrescriptionData",
    onAfterPrint: () => toast.success("Data saved in PDF"),
  });


    if(onActionRef){
      onActionRef(componentPdf);
    }



  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-screen-lg rounded-lg overflow-y-auto max-h-full">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {doctor ? "Medical Records" : "Prescription"}
              </h2>
              {children}
            </div>
            {doctor ? (
              <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => handleActionClick("view")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleActionClick("add")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add record
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => handleActionClick("review")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                >
                  Give Feedback
                </button>
                {downloadBtn ? (
                  <button
                  onClick={generatePdf}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => handleActionClick("view")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Prescription
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FullScreenModal;
