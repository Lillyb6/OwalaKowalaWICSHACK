import React, { useState } from 'react';
import '../../index.css'; 
import './tasks.css';  

const MoodApp = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);

  const moodData = {
    happy: ["Do something you love", "Write down a goal", "Dance to a song"],
    anxious: ["4-7-8 Breathing", "Do something creative", "Drink cold water"],
    sad: ["Wrap in a blanket", "Watch a comfort movie", "Go somewhere new"],
    angry: ["Go for a run", "Punch a pillow", "High-energy song"],
    fine: ["Go get a treat", "Organize a drawer", "Read a book"]
  };

  const moods = [
    { name: 'happy', src: '/images/happy_face.png' },
    { name: 'anxious', src: '/images/anxious_face.png' },
    { name: 'sad', src: '/images/sad_face.png' },
    { name: 'angry', src: '/images/angry_face.png' },
    { name: 'fine', src: '/images/fine_face.png' }
  ];

  const getRandomColor = () => {
    const colors = ['#ff9898', '#ffb56c', '#ffde79', '#7fff7f', '#6fb2ff', '#b07ae2', '#ff78c1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const triggerConfetti = (e) => {
    const confettiContainer = document.getElementById('confetti-container');
    const taskButtonPosition = e.target.getBoundingClientRect();

    for (let i = 0; i < 30; i++) {
      const confettiPiece = document.createElement('div');
      confettiPiece.classList.add('confetti');

      confettiPiece.style.left = `${taskButtonPosition.left + Math.random() * taskButtonPosition.width}px`;
      confettiPiece.style.top = `${taskButtonPosition.top + Math.random() * taskButtonPosition.height}px`;

      const randomX = (Math.random() * 400 - 200) + "px"; 
      const randomY = (Math.random() * 400 - 200) + "px"; 
      confettiPiece.style.setProperty('--random-x', randomX);
      confettiPiece.style.setProperty('--random-y', randomY);

      confettiPiece.style.backgroundColor = getRandomColor(); 

      confettiContainer.appendChild(confettiPiece);
    }
    setTimeout(() => {
      confettiContainer.innerHTML = '';
    }, 3000);
  };


  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 bg-gradient-to-b from-[#ffe2e2] to-white font-sans">
      <div id="confetti-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}></div>

      {!selectedMood ? (
        <section className="w-full max-w-5xl py-12 flex flex-col items-center bg-white/70 backdrop-blur-md rounded-[2rem] shadow-lg border border-white/40">
          <h2 className="text-2xl text-center font-semibold text-[#d96c6c] mb-10">
            How are you feeling today?
          </h2>

          <div className="flex flex-row flex-nowrap justify-center items-center gap-10 w-full overflow-x-auto pb-4 pt-8">
            {moods.map((mood) => (
              <button 
                key={mood.name}
                type="button"
                onClick={() => setSelectedMood(mood.name)}
                className={`flex-shrink-0 transition-all duration-200 
                  ${selectedMood === mood.name 
                    ? "scale-110 drop-shadow-[0_0_10px_#ffb3b3]" 
                    : "hover:scale-110"} 
                  active:scale-95 focus:outline-none`}
              >
                <img 
                  src={mood.src} 
                  alt={mood.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none flower-pop-shadow transform scale-150"
                />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl border border-[#ffe2e2] p-8 mt-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-[#d96c6c] capitalize">
              {selectedMood} <span className="text-[#f2a4a4] font-normal">Tasks</span>
            </h3>

            <button 
              onClick={() => setSelectedMood(null)}
              className="text-xs font-semibold text-[#f2a4a4] hover:text-[#d96c6c] uppercase tracking-widest"
            >
              ← Back
            </button>
          </div>

          <ul className="space-y-4 mb-8">
            {moodData[selectedMood]?.map((task, index) => {
              const isDone = completedTasks.includes(task);

              return (
                <li key={index}>
                  <button
                    onClick={(e) => {
                      const newCompletedTasks = isDone
                        ? completedTasks.filter(t => t !== task)
                        : [...completedTasks, task];
                      setCompletedTasks(newCompletedTasks);
                      if (!isDone) triggerConfetti(e); 
                    }}
                    className="flex items-center gap-4 p-5 rounded-3xl border-2 cursor-pointer transition-all hover:bg-[#ffb3b3] focus:outline-none"
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs
                        ${isDone ? 'bg-[#ffb3b3] text-white' : 'bg-white border-[#ffcaca]'}`}
                    >
                      {isDone && "✓"}
                    </div>
                    <span className={`${isDone ? 'line-through text-[#d9a5a5]' : 'text-[#5a5a5a]'}`}>
                      {task}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => {
              setSelectedMood(null);
              setCompletedTasks([]);
              triggerConfetti(); 
            }}
            className="w-full bg-[#ffb3b3] hover:bg-[#ff9b9b] text-white py-5 rounded-2xl font-semibold text-lg shadow-xl transition-all"
          >
            DONE
          </button>
        </section>
      )}

      <section className="w-full max-w-xl bg-white rounded-[2rem] shadow-lg border border-[#ffe2e2] p-8 mt-10">
        <h2 className="text-xl font-semibold text-[#d96c6c] mb-4">
          Journal
        </h2>

        <textarea 
          className="w-full h-36 p-5 bg-[#fff5f5] border border-[#ffcccc] rounded-2xl 
          focus:ring-2 focus:ring-[#ffb3b3] focus:border-[#ffb3b3] outline-none 
          text-slate-700 resize-none placeholder:text-slate-400 transition-all" 
          placeholder="What's on your mind?"
        />

        <button className="mt-5 w-full bg-[#ffe2e2] hover:bg-[#ffb3b3] text-[#d96c6c] hover:text-white py-3 rounded-2xl transition-all font-semibold">
          Save Entry 
        </button>
      </section>

    </div>
  );
};

export default MoodApp;