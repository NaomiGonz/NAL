// import React from 'react';

// const Resource = () => {
//   return (
//     <div className="bg-ivory"> {/* Wrapper div to cover padding area */}
//       <h1 className="py-20">
//         Resource Page
//       </h1>
//     </div>
//   );
// };

// export default Resource;


import React from 'react';

const Resource = () => {
  return (
    <div className="py-20 min-h-screen w-full bg-cover bg-no-repeat bg-center flex flex-col justify-center px-4">
      <div className="max-w-4xl mx-auto text-left">
        <h1 className="text-6xl font-bold text-center text-mediumblue mb-4">Resources</h1>
        <h2 className="text-3xl text-slate-600 mb-8"></h2>
        
        <h3 className="text-2xl font-bold text-green mb-4"> Rare Disease Information</h3>
        <div className="text-slate-600 font-light text-blue-900 text-lg leading-relaxed mb-8">
          <a
            href="https://rarediseases.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            National Organization for Rare Disorders
          </a>
          <a
            href="https://www.rarediseasesinternational.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Rare Diseases International
          </a>
          <a
            href="https://everylifefoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Every Life Foundation for Rare Diseases
          </a>
          <a
            href="https://www.rarediseasesnetwork.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Rare Diseases Clinical Research Network
          </a>
          <a
            href="https://globalgenes.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Global Genes Allies in Rare Disease
          </a>
          <a
            href="https://rarediseases.info.nih.gov/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Genetic and Rare Disease Information Center
          </a>
          <a
            href="https://courageousparentsnetwork.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Courageous Parent Network
          </a>
          <a
            href="https://themighty.com/topic/rare-disease/collections/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            The Mighty: Rare Disease Collection
          </a>
          <a
            href="https://undiagnosed.hms.harvard.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Undiagnosed Diseases Network
          </a>
        </div>

        <h4 className="text-2xl font-bold text-green mb-4">Mental Health</h4>
        <div className="text-slate-600 font-light text-blue-900 text-lg leading-relaxed mb-8">
          <a
            href="https://www.rareminds.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block mb-2"
          >
            Rare Minds Mental Health
          </a>
          <a
            href="https://www.thecenterforchronicillness.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline block"
          >
            Center for Chronic Illness
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resource;