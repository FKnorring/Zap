import editor from '@/assets/editorImages/editor.png';
import lobby from '@/assets/questionImages/lobby.png';
import results from '@/assets/questionImages/results.png';
import { useTranslation } from 'react-i18next';

const HowItWorksPhone = () => {
  const { t } = useTranslation();
  return (
    <div className="py-6 w-full bg-gray-50">
      <h1 className="text-3xl font-display text-center text-gray-700 mb-6">
        {t('homepage:getStarted')}
      </h1>
      <div className="space-y-16 max-w-md mx-auto px-4">
        {/* Step 1 */}
        <div className="bg-blue-200 rounded-lg p-6 shadow-md flex flex-col items-center">
          {/* Number in a circle */}
          <div className="w-12 h-12 bg-primary text-white text-lg font-bold rounded-full flex items-center justify-center mb-4">
            1
          </div>
          <img
            src={editor}
            alt="Placeholder 1"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Content */}
          <div className=" rounded-lg  p-4 ">
            <h2 className="text-xl font-display text-gray-900 mb-1">
              {t('homepage:stepTitles.0')}
            </h2>
            <p className=" text-gray-700 text-sm leading-snug">
              {t('homepage:stepText.0')}
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
            src={lobby}
            alt="Placeholder 2"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Content */}
          <div className=" rounded-lg  p-4 ">
            <h2 className="text-xl font-display text-gray-900 mb-1">
              {t('homepage:stepTitles.1')}
            </h2>
            <p className=" text-gray-700 text-sm leading-snug">
              {t('homepage:stepText.1')}
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
            src={results}
            alt="Placeholder 3"
            className="w-full h-auto rounded-lg shadow-md"
          />
          {/* Content */}
          <div className=" rounded-lg  p-4 mt-4">
            <h2 className="text-xl font-display text-gray-900 mb-1">
              {t('homepage:stepTitles.2')}
            </h2>
            <p className=" text-gray-700 text-sm leading-snug">
              {t('homepage:stepText.2')}
            </p>
          </div>

          {/* Image */}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPhone;
