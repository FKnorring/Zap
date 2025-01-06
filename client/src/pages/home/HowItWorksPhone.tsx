import slideView from '@/utils/images/slideView.png';

const HowItWorksPhone = () => {
  return (
    <div className="py-8 w-full bg-gray-50">
      <h1 className="text-3xl font-display text-center text-gray-700 mb-6">
        Get started!
      </h1>
      <div className="space-y-16 max-w-md mx-auto px-4">
        {/* Step 1 */}
        <div className="bg-blue-200 rounded-lg p-6 shadow-md flex flex-col items-center">
          {/* Number in a circle */}
          <div className="w-12 h-12 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center mb-4">
            1
          </div>
          <img
            src={slideView}
            alt="Placeholder 1"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Content */}
          <div className=" rounded-lg  p-4 ">
            <h2 className="text-xl font-display text-gray-800">
              Build it, quiz it, win it!
            </h2>
            <p className=" text-gray-600 text-sm font-display">
              Get started with Zap by creating quiz and game night slides. Add a
              variety of interactive challenges to keep your friends engaged,
              all within one easy-to-use app.
            </p>
          </div>

          {/* Image */}
        </div>

        {/* Step 2 */}
        <div className="bg-violet-200 rounded-lg p-6 shadow-md flex flex-col items-center">
          {/* Number in a circle */}
          <div className="w-12 h-12 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center mb-4">
            2
          </div>
          <img
            src={slideView}
            alt="Placeholder 2"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Content */}
          <div className=" rounded-lg  p-4 ">
            <h2 className="text-xl font-display text-gray-800">
              Invite your friends
            </h2>
            <p className=" font-display text-gray-600 text-sm">
              Your friends can join the fun on any device, just by scanning a QR
              code or using a link—no apps required!
            </p>
          </div>

          {/* Image */}
        </div>

        {/* Step 3 */}
        <div className="bg-red-100 rounded-lg p-6 shadow-md flex flex-col items-center">
          {/* Number in a circle */}
          <div className="w-12 h-12 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center mb-4">
            3
          </div>
          <img
            src={slideView}
            alt="Placeholder 3"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Content */}
          <div className=" rounded-lg  p-4 mt-4">
            <h2 className="text-xl font-display text-gray-800">
              Watch the action & enjoy the fun!
            </h2>
            <p className=" font-display text-gray-600 text-sm">
              Follow the answers, points, and results as they unfold,
              intensifying the excitement until a winner is crowned.
            </p>
          </div>

          {/* Image */}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPhone;
