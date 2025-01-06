import slideView from '@/utils/images/slideView.png';

const HowItWorks = () => {
  return (
    <div className="py-8  w-full ">
      <h1 className="text-4xl font-display text-center text-gray-700 mb-2">
        Get started!
      </h1>
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between space-x-24  rounded-lg  p-8 bg-blue-200">
            {/* Number Above the Card Box */}

            {/* Card Box with Title and Text */}

            <div className="flex-1 p-6 flex flex-col items-center justify-start ">
              {/* Number in a smaller circle */}
              <div className="w-16 h-16 bg-primary text-white text-xl font-bold rounded-full mb-4 flex items-center justify-center">
                1
              </div>

              {/* Card Box with Title and Text */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Build it, quiz it, win it!
                </h1>
                <p className="mt-4 text-gray-600">
                  Get started with Zap by creating quiz and game night slides.
                  Add a variety of interactive challenges to keep your friends
                  engaged, all within one easy-to-use app.
                </p>
              </div>
            </div>

            {/* Placeholder Image */}
            <div className="flex-1 w-1/2">
              <img
                src={slideView}
                alt="Placeholder 1"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="relative flex items-center justify-between space-x-24  rounded-lg  p-8 bg-violet-200">
            {/* Number Above the Card Box */}

            {/* Card Box with Title and Text */}
            <div className="flex-1 w-1/2">
              <img
                src={slideView}
                alt="Placeholder 1"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-start ">
              {/* Number in a smaller circle */}
              <div className="w-16 h-16 bg-primary text-white text-xl font-bold rounded-full mb-4 flex items-center justify-center">
                2
              </div>

              {/* Card Box with Title and Text */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Invite your friends
                </h1>
                <p className="mt-4 text-gray-600">
                  Your friends can join the fun on any device, just by scanning
                  a QR code or using a link—no apps required!
                </p>
              </div>
            </div>

            {/* Placeholder Image */}
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between space-x-24  rounded-lg  p-8 bg-red-100">
            {/* Number Above the Card Box */}

            {/* Card Box with Title and Text */}

            <div className="flex-1 p-6 flex flex-col items-center justify-start ">
              {/* Number in a smaller circle */}
              <div className="w-16 h-16 bg-primary text-white text-xl font-bold rounded-full mb-4 flex items-center justify-center">
                3
              </div>

              {/* Card Box with Title and Text */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Watch the action unfold & enjoy the fun!
                </h1>
                <p className="mt-4 text-gray-600">
                  Follow the answers, points, and results as they unfold,
                  intensifying the excitement until a winner is crowned.
                </p>
              </div>
            </div>

            {/* Placeholder Image */}
            <div className="flex-1 w-1/2">
              <img
                src={slideView}
                alt="Placeholder 1"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
