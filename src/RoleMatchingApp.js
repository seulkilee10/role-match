{\rtf1\ansi\ansicpg949\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww12080\viewh13740\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState, useRef, useEffect \} from 'react';\
import \{ Shuffle, Info, Copy \} from 'lucide-react';\
import \{\
  Tooltip,\
  TooltipContent,\
  TooltipProvider,\
  TooltipTrigger,\
\} from "@/components/ui/tooltip"\
\
const roleDescriptions = \{\
  '\uc0\u48169 \u51109 ': '\u47784 \u51076 \u51060  \u51096  \u44404 \u47084 \u44032 \u44172 \u45140  \u54644 \u50836 ',\
  '\uc0\u49324 \u51652 \u49324 ': '\u47784 \u51076 \u54624  \u46412 \u47560 \u45796  \u51064 \u51613 \u49399 \u51012  \u45224 \u44200 \u50836 ',\
  '\uc0\u44592 \u47197 \u44032 ': '\u47784 \u51076  \u45236 \u50857 \u51012  \u50500 \u51648 \u53944 \u50640  \u44592 \u47197 \u54644 \u50836 ',\
  '\uc0\u51068 \u48152  \u47716 \u48260 ': '\u47784 \u51076 \u50640  \u52280 \u50668 \u54616 \u50668  \u51600 \u44161 \u44172  \u54876 \u46041 \u54644 \u50836 '\
\};\
\
const roleEmojis = \{\
  '\uc0\u48169 \u51109 ': '\u55357 \u56401 ',\
  '\uc0\u49324 \u51652 \u49324 ': '\u55357 \u56568 ',\
  '\uc0\u44592 \u47197 \u44032 ': '\u9999 \u65039 ',\
  '\uc0\u51068 \u48152  \u47716 \u48260 ': '\u55357 \u56492 '\
\};\
\
const RoleMatchingApp = () => \{\
  const [names, setNames] = useState('');\
  const [leaderCount, setLeaderCount] = useState(1);\
  const [photographerCount, setPhotographerCount] = useState(0);\
  const [recorderCount, setRecorderCount] = useState(0);\
  const [results, setResults] = useState([]);\
  const [showToast, setShowToast] = useState(false);\
  const resultTextRef = useRef(null);\
\
  useEffect(() => \{\
    if (showToast) \{\
      const timer = setTimeout(() => setShowToast(false), 3000);\
      return () => clearTimeout(timer);\
    \}\
  \}, [showToast]);\
\
  const handleMatch = () => \{\
    const nameList = names.split('\\n').filter(name => name.trim() !== '');\
    const roles = [\
      ...Array(leaderCount).fill('\uc0\u48169 \u51109 '),\
      ...Array(photographerCount).fill('\uc0\u49324 \u51652 \u49324 '),\
      ...Array(recorderCount).fill('\uc0\u44592 \u47197 \u44032 ')\
    ];\
\
    if (nameList.length < roles.length) \{\
      alert('\uc0\u52280 \u44032 \u51088  \u49688 \u44032  \u50669 \u54624  \u49688 \u48372 \u45796  \u51201 \u49845 \u45768 \u45796 .');\
      return;\
    \}\
\
    const shuffledRoles = [...roles, ...Array(nameList.length - roles.length).fill('\uc0\u51068 \u48152  \u47716 \u48260 ')];\
    shuffledRoles.sort(() => Math.random() - 0.5);\
\
    const matchedResults = nameList.map((name, index) => (\{\
      name,\
      role: shuffledRoles[index]\
    \}));\
\
    setResults(matchedResults);\
  \};\
\
  const formatResultsForCopy = () => \{\
    return results.map(result => `- $\{result.name\} : $\{result.role\} $\{roleEmojis[result.role]\}`).join('\\n');\
  \};\
\
  const copyResultToClipboard = () => \{\
    const formattedText = formatResultsForCopy();\
    const tempElement = document.createElement('textarea');\
    tempElement.value = formattedText;\
    document.body.appendChild(tempElement);\
    tempElement.select();\
    document.execCommand('copy');\
    document.body.removeChild(tempElement);\
    setShowToast(true);\
    if (resultTextRef.current) \{\
      resultTextRef.current.classList.add('copied');\
      setTimeout(() => resultTextRef.current.classList.remove('copied'), 300);\
    \}\
  \};\
\
  const RoleInput = (\{ label, value, onChange, description, min = 0, max \}) => (\
    <div className="flex flex-col">\
      <div className="flex items-center">\
        <label className="text-sm font-medium text-gray-700 mr-2">\{label\}</label>\
        <TooltipProvider delayDuration=\{100\}>\
          <Tooltip>\
            <TooltipTrigger asChild>\
              <button className="bg-transparent border-none p-0 cursor-help focus:outline-none">\
                <Info size=\{16\} className="text-gray-500" />\
              </button>\
            </TooltipTrigger>\
            <TooltipContent side="top" sideOffset=\{5\}>\
              <p>\{description\}</p>\
            </TooltipContent>\
          </Tooltip>\
        </TooltipProvider>\
      </div>\
      <input\
        type="number"\
        min=\{min\}\
        max=\{max\}\
        className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400\
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"\
        value=\{value\}\
        onChange=\{(e) => \{\
          const newValue = parseInt(e.target.value);\
          if (!isNaN(newValue) && newValue >= min && (max === undefined || newValue <= max)) \{\
            onChange(newValue);\
          \}\
        \}\}\
      />\
    </div>\
  );\
\
  return (\
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6 flex flex-col justify-center sm:py-12">\
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">\
        <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-10 sm:p-20">\
          <div className="max-w-md mx-auto">\
            <div>\
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">\uc0\u54032 \u44368 \u52293 \u48169  \u50669 \u54624 \u47588 \u52845 \u44592  \u55357 \u56401 </h1>\
            </div>\
            <div className="space-y-6">\
              <div className="space-y-4">\
                <div className="flex flex-col">\
                  <label className="text-sm font-medium text-gray-700 mb-1">\uc0\u52280 \u44032 \u51088  \u51060 \u47492  (\u54620  \u51460 \u50640  \u54620  \u47749 \u50473 )</label>\
                  <textarea\
                    className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400\
                               focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"\
                    rows="5"\
                    value=\{names\}\
                    onChange=\{(e) => setNames(e.target.value)\}\
                  />\
                </div>\
                <div className="grid grid-cols-3 gap-4">\
                  <RoleInput \
                    label="\uc0\u48169 \u51109 " \
                    value=\{leaderCount\} \
                    onChange=\{setLeaderCount\}\
                    description=\{roleDescriptions['\uc0\u48169 \u51109 ']\}\
                    min=\{0\}\
                    max=\{1\}\
                  />\
                  <RoleInput \
                    label="\uc0\u49324 \u51652 \u49324 " \
                    value=\{photographerCount\} \
                    onChange=\{setPhotographerCount\}\
                    description=\{roleDescriptions['\uc0\u49324 \u51652 \u49324 ']\}\
                  />\
                  <RoleInput \
                    label="\uc0\u44592 \u47197 \u44032 " \
                    value=\{recorderCount\} \
                    onChange=\{setRecorderCount\}\
                    description=\{roleDescriptions['\uc0\u44592 \u47197 \u44032 ']\}\
                  />\
                </div>\
              </div>\
              <button\
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"\
                onClick=\{handleMatch\}\
              >\
                <Shuffle className="mr-2" size=\{18\} />\
                \uc0\u47588 \u52845 \u54616 \u44592 \
              </button>\
              \{results.length > 0 && (\
                <div className="mt-6 bg-gray-50 rounded-lg p-4 shadow-sm">\
                  <div className="flex justify-between items-center mb-4">\
                    <h2 className="text-lg font-semibold text-gray-900">\uc0\u44208 \u44284 </h2>\
                    <button\
                      onClick=\{copyResultToClipboard\}\
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"\
                    >\
                      <Copy size=\{16\} className="mr-1" />\
                      \uc0\u53581 \u49828 \u53944 \u47196  \u48373 \u49324 \
                    </button>\
                  </div>\
                  <div className="space-y-2" ref=\{resultTextRef\}>\
                    \{results.map((result, index) => (\
                      <div key=\{index\} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">\
                        <span className="text-sm text-gray-800">\{result.name\}</span>\
                        <span className="text-sm font-medium text-gray-600">\
                          \{result.role\} \{roleEmojis[result.role]\}\
                        </span>\
                      </div>\
                    ))\}\
                  </div>\
                </div>\
              )\}\
            </div>\
          </div>\
        </div>\
      </div>\
      \{showToast && (\
        <div className="fixed inset-x-0 bottom-4 flex justify-center">\
          <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">\
            \uc0\u44208 \u44284 \u44032  \u53364 \u47549 \u48372 \u46300 \u50640  \u48373 \u49324 \u46104 \u50632 \u49845 \u45768 \u45796 ! \u55356 \u57225 \
          </div>\
        </div>\
      )\}\
      <style jsx>\{`\
        .copied \{\
          animation: flash 0.3s;\
        \}\
        @keyframes flash \{\
          0% \{ background-color: transparent; \}\
          50% \{ background-color: rgba(59, 130, 246, 0.3); \}\
          100% \{ background-color: transparent; \}\
        \}\
      `\}</style>\
    </div>\
  );\
\};\
\
export default RoleMatchingApp;}
