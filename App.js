import React, { useState, useRef, useEffect } from 'react';
import { Shuffle, Info, Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip"

const roleDescriptions = {
  '방장': '모임이 잘 굴러가게끔 해요',
  '사진사': '모임할 때마다 인증샷을 남겨요',
  '기록가': '모임 내용을 아지트에 기록해요',
  '일반 멤버': '모임에 참여하여 즐겁게 활동해요'
};

const roleEmojis = {
  '방장': '👑',
  '사진사': '📸',
  '기록가': '✏️',
  '일반 멤버': '💬'
};

const RoleMatchingApp = () => {
  const [names, setNames] = useState('');
  const [leaderCount, setLeaderCount] = useState(1);
  const [photographerCount, setPhotographerCount] = useState(0);
  const [recorderCount, setRecorderCount] = useState(0);
  const [results, setResults] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const resultTextRef = useRef(null);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleMatch = () => {
    const nameList = names.split('\n').filter(name => name.trim() !== '');
    const roles = [
      ...Array(leaderCount).fill('방장'),
      ...Array(photographerCount).fill('사진사'),
      ...Array(recorderCount).fill('기록가')
    ];

    if (nameList.length < roles.length) {
      alert('참가자 수가 역할 수보다 적습니다.');
      return;
    }

    const shuffledRoles = [...roles, ...Array(nameList.length - roles.length).fill('일반 멤버')];
    shuffledRoles.sort(() => Math.random() - 0.5);

    const matchedResults = nameList.map((name, index) => ({
      name,
      role: shuffledRoles[index]
    }));

    setResults(matchedResults);
  };

  const formatResultsForCopy = () => {
    return results.map(result => `- ${result.name} : ${result.role} ${roleEmojis[result.role]}`).join('\n');
  };

  const copyResultToClipboard = () => {
    const formattedText = formatResultsForCopy();
    const tempElement = document.createElement('textarea');
    tempElement.value = formattedText;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
    setShowToast(true);
    if (resultTextRef.current) {
      resultTextRef.current.classList.add('copied');
      setTimeout(() => resultTextRef.current.classList.remove('copied'), 300);
    }
  };

  const RoleInput = ({ label, value, onChange, description, min = 0, max }) => (
    <div className="flex flex-col">
      <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">{label}</label>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="bg-transparent border-none p-0 cursor-help focus:outline-none">
                <Info size={16} className="text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={5}>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <input
        type="number"
        min={min}
        max={max}
        className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value);
          if (!isNaN(newValue) && newValue >= min && (max === undefined || newValue <= max)) {
            onChange(newValue);
          }
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-10 sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">판교책방 역할매칭기 👑</h1>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">참가자 이름 (한 줄에 한 명씩)</label>
                  <textarea
                    className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                               focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows="5"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <RoleInput 
                    label="방장" 
                    value={leaderCount} 
                    onChange={setLeaderCount}
                    description={roleDescriptions['방장']}
                    min={0}
                    max={1}
                  />
                  <RoleInput 
                    label="사진사" 
                    value={photographerCount} 
                    onChange={setPhotographerCount}
                    description={roleDescriptions['사진사']}
                  />
                  <RoleInput 
                    label="기록가" 
                    value={recorderCount} 
                    onChange={setRecorderCount}
                    description={roleDescriptions['기록가']}
                  />
                </div>
              </div>
              <button
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleMatch}
              >
                <Shuffle className="mr-2" size={18} />
                매칭하기
              </button>
              {results.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">결과</h2>
                    <button
                      onClick={copyResultToClipboard}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Copy size={16} className="mr-1" />
                      텍스트로 복사
                    </button>
                  </div>
                  <div className="space-y-2" ref={resultTextRef}>
                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
                        <span className="text-sm text-gray-800">{result.name}</span>
                        <span className="text-sm font-medium text-gray-600">
                          {result.role} {roleEmojis[result.role]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="fixed inset-x-0 bottom-4 flex justify-center">
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            결과가 클립보드에 복사되었습니다! 🎉
          </div>
        </div>
      )}
      <style jsx>{`
        .copied {
          animation: flash 0.3s;
        }
        @keyframes flash {
          0% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.3); }
          100% { background-color: transparent; }
        }
      `}</style>
    </div>
  );
};

export default RoleMatchingApp;