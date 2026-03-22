import React, { useState } from 'react';

const MoodApp = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  const moodData = {
    happy: ["Text someone you love", "Write down a goal", "Dance to a song"],
    anxious: ["4-7-8 Breathing", "5-4-3-2-1 Grounding", "Drink cold water"],
    sad: ["Wrap in a blanket", "Brain dump journal", "Watch a funny clip"],
    angry: ["10 jumping jacks", "Squeeze a pillow", "High-energy song"],
    fine: ["Plan a small treat", "Organize a drawer", "Read a few pages"]
  };

  const moods = [
    { name: 'happy', src: '/images/happy_face.png' },
    { name: 'anxious', src: '/images/anxious_face.png' },
    { name: 'sad', src: '/images/sad_face.png' },
    { name: 'angry', src: '/images/angry_face.png' },
    { name: 'fine', src: '/images/fine_face.png' }
  ];

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-slate-50 font-sans">
      
      {/* 1. MOOD SELECTOR: Only shows if selectedMood is null */}
      {!selectedMood ? (
        <section className="w-full max-w-5xl py-20 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-12">How are you feeling today?</h2>
          
          <div className="flex flex-row flex-nowrap justify-center items-center gap-6 w-full px-4">
            {moods.map((mood) => (
              <button 
                key={mood.name}
                type="button"
                onClick={() => setSelectedMood(mood.name)}
                // Added a light background so the button is visible even if the image fails
                className="flex-shrink-0 bg-white shadow-sm hover:shadow-md rounded-full p-2 border border-slate-100 transition-all hover:scale-110 active:scale-95"
              >
                <img 
                  src={mood.src} 
                  alt={mood.name} 
                  className="w-20 h-20 md:w-28 md:h-28 object-contain pointer-events-none"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML += `<span class="text-[10px] font-bold text-slate-400 capitalize">${mood.name}</span>`;
                  }} 
                />
              </button>
            ))}
          </div>
        </section>
      ) : (
        /* 2. TASK VIEW: Only shows if a mood is selected */
        <section className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 mt-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 capitalize">
              {selectedMood} <span className="text-slate-300 font-normal">Checklist</span>
            </h3>
            <button 
              onClick={() => setSelectedMood(null)}
              className="text-xs font-bold text-slate-400 hover:text-orange-500 uppercase tracking-widest"
            >
              ← Back
            </button>
          </div>

          <ul className="space-y-4 mb-8">
            {moodData[selectedMood]?.map((task, index) => (
              <li 
                key={index} 
                onClick={() => setCompletedTasks(prev => 
                    prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
                )}
                className={`flex items-center gap-4 p-5 rounded-3xl border-2 cursor-pointer transition-all
                  ${completedTasks.includes(task) ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-transparent hover:border-orange-100'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  completedTasks.includes(task) ? 'bg-emerald-500 border-emerald-500 text-white text-[10px]' : 'bg-white border-slate-300'
                }`}>
                  {completedTasks.includes(task) && "✓"}
                </div>
                <span className={`font-medium ${completedTasks.includes(task) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task}
                </span>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => {
                setSelectedMood(null);
                setCompletedTasks([]);
            }}
            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-3xl font-bold text-lg shadow-lg"
          >
            DONE
          </button>
        </section>
      )}

      {/* 3. JOURNAL: Always visible */}
      <section className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 mt-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Journal</h2>
        <textarea 
          className="w-full h-32 p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-200 outline-none text-slate-700 resize-none" 
          placeholder="Thoughts..."
        />
        <button className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-3 rounded-xl transition-all font-bold text-xs uppercase">
          Save Entry 
        </button>
      </section>

    </div>
  );
};

export default MoodApp;