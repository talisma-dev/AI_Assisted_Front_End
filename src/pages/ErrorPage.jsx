import { useNavigate } from "react-router-dom";

const ErrorPage = ({ error }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-red-500 bg-clip-text text-transparent">
            Access Denied
          </h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
            {/* {studentName && (
              <p className="text-red-600 text-sm mt-1">
                Student: {studentName}
              </p>
            )} */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={(e)=>{e.preventDefault();}}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
          
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 