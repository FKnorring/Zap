import slideView from '@/utils/images/slideView.png';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();
  return (
    <div className="py-8  w-full ">
      <h1 className="text-4xl font-display text-center text-gray-700 mb-2">
        {t('homepage:getStarted')}
      </h1>
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-16">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between space-x-24  rounded-lg  p-8 bg-blue-200">
            {/* Number Above the Card Box */}

            {/* Card Box with Title and Text */}

            <div className="flex-1 p-6 flex flex-col items-center justify-start ">
              {/* Number in a smaller circle */}
              <div className="w-16 h-16 bg-primary text-white text-xl font-display rounded-full mb-4 flex items-center justify-center">
                1
              </div>

              {/* Card Box with Title and Text */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-display text-black">
                  {t('homepage:stepTitles.0')}
                </h1>
                <p className=" font-display mt-2 text-gray-600">
                  {t('homepage:stepText.0')}
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
              <div className="w-16 h-16 bg-primary font-display text-white text-xl  rounded-full mb-4 flex items-center justify-center">
                2
              </div>

              {/* Card Box with Title and Text */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-display text-black">
                  {t('homepage:stepTitles.1')}
                </h1>
                <p className="mt-2 font-display text-gray-600">
                  {t('homepage:stepText.1')}
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
              <div className="w-16 h-16 bg-primary font-display text-white text-xl  rounded-full mb-4 flex items-center justify-center">
                3
              </div>

              {/* Card Box with Title and Text */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className=" font-display text-2xl  text-black">
                  {t('homepage:stepTitles.2')}
                </h1>
                <p className="mt-2 font-display text-gray-600">
                  {t('homepage:stepText.2')}
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
