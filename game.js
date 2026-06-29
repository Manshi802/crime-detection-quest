const levels = [
  {
    title: "🔍 Case 1: Crime Scene Investigation",
    story: "Sheher mein chori hui! Inspector ko saare suspects ki list chaiye. Database se sabhi records nikalo!",
    correct_query: "SELECT * FROM suspects",
    hint: "SELECT* use karo asterisk(*) matlab 'sab kuch'!",
    points: 100
  },
  {
    title: "🏙️ Case 2: Mumbai Lead",
    story: "Sirf Mumbai ke suspects find karo.",
    correct_query: "SELECT * FROM suspects WHERE city='Mumbai'",
    hint: "WHERE clause use karo city filter karne ke liye!",
    points: 120
  },
  {
    title: "👤 Case 3: Age Filter",
    story: "30 se upar wale suspects dhundo.",
    correct_query: "SELECT * FROM suspects WHERE age > 30",
    hint: "WHERE age>30 try karo!",
    points: 140
  },
  {
    title: "⚖️ Case 4: Guilty Check",
    story: "Guilty suspects ko find karo.",
    correct_query: "SELECT * FROM suspects WHERE guilty=1",
    hint: "WHERE guilty = 1 use karo!",
    points: 160
  },
  {
    title: "🏙️ Case 5: Delhi Doctor",
    story: "Delhi ke Doctors find karo.",
    correct_query: "SELECT * FROM suspects WHERE city='Delhi' AND occupation='Doctor'",
    hint:"WHERE mein AND use karo 2 condotion ek saath!",
    points: 180
  },

  {
    title: "🧠 Case 6",
    story: "Kolkata suspects.",
    correct_query: "SELECT * FROM suspects WHERE city='Kolkata'",
    hint: "WHERE clause use karo city filter kaene ke liye!",
    points: 200
  },
  {
    title: "🧠 Case 7",
    story: "Age below 25.",
    correct_query: "SELECT * FROM suspects WHERE age < 25",
    hint: "WHERE clause ka use karo agr ke liye!",
    points: 220
  },
  {
    title: "🧠 Case 8",
    story: "Mumbai + age > 35",
    correct_query: "SELECT * FROM suspects WHERE city='Mumbai' AND age > 35",
    hint: "2 condition ek saath hai WHERE or AND use karo!",
    points: 240
  },
  {
    title: "🧠 Case 9",
    story: "Non-guilty suspects.",
    correct_query: "SELECT * FROM suspects WHERE guilty=0",
    hint: "WHERE guilty = 0 use karo!",
    points: 260
  },
  {
    title: "🧠 Case 10",
    story: "Engineers find karo.",
    correct_query: "SELECT * FROM suspects WHERE occupation='Engineer'",
    Hint: "bs WHERE clause use hoga!",
    points: 280
  },

  {
    title: "🕵️ Case 11",
    story: "Delhi OR Mumbai suspects.",
    correct_query: "SELECT * FROM suspects WHERE city='Delhi' OR city='Mumbai'",
    hint: "Delhi ya Mumbai dono me se koi ek match karna ho toh OR use karo!",
    points: 300
  },
  {
    title: "🕵️ Case 12",
    story: "Age between 20 and 40.",
    correct_query: "SELECT * FROM suspects WHERE age BETWEEN 20 AND 40",
    hint: "20 se 40 ke beech wale suspect ke liye BETWEEN operator try karo!",
    points: 320
  },
  {
    title: "🕵️ Case 13",
    story: "Name starts with A.",
    correct_query: "SELECT * FROM suspects WHERE name LIKE 'A%'",
    hint: "A se naam doodhne ke lie LIKE 'A%' ka use karo!",
    points: 340
  },
  {
    title: "🕵️ Case 14",
    story: "Bangalore suspects.",
    correct_query: "SELECT * FROM suspects WHERE city='Bangalore'",
    hint: "Banglore city ke suspect ko filter karne ke lie =' Banglore' use karo!",
    points: 360
  },
  {
    title: "🕵️ Case 15",
    story: "Doctors older than 30.",
    correct_query: "SELECT * FROM suspects WHERE occupation='Doctor' AND age > 30",
    hint: "Doctors dhoondo jinki age 30 se zyada ho!",
    points: 380
  },

  {
    title: "🔥 Case 16",
    story: "Engineers from Delhi.",
    correct_query: "SELECT * FROM suspects WHERE city='Delhi' AND occupation='Engineer'",
    hint: "AND operator use karo!",
    points: 400
  },
  {
    title: "🔥 Case 17",
    story: "Chennai suspects.",
    correct_query: "SELECT * FROM suspects WHERE city='Chennai'",
    hint: "='Chennai' use karo!",
    points: 420
  },
  {
    title: "🔥 Case 18",
    story: "Age > 50 suspects.",
    correct_query: "SELECT * FROM suspects WHERE age > 50",
    hint: "50 se zyada age wale suspect ke lie > operator use karo!",
    points: 440
  },
  {
    title: "🔥 Case 19",
    story: "Guilty Engineers.",
    correct_query: "SELECT * FROM suspects WHERE guilty=1 AND occupation='Engineer'",
    hint: "AND use karo guilty engineer mil jayange!",
    points: 460
  },

  {
    title: "🏆 FINAL CASE 20",
    story: "Ultimate challenge: Delhi Doctor + age filter.",
    correct_query: "SELECT * FROM suspects WHERE city='Delhi' AND occupation='Doctor' AND age > 30",
    hint: "3 condition match karni hai multiple AND use karo!",
    points: 500
  }
];


// Game State
let currentLevel = 0;
let score = 0;
let timer = 90;
let timerInterval;
let hintsUsed = 0;



// Start Game
function startGame() {
    loadLevel(0);
    loadTable();
}

// Load Table
async function loadTable() {
    try {
        const response = await fetch('http://127.0.0.1:5000/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: 'SELECT * FROM suspects',
                correct_query: 'SELECT * FROM suspects'
            })
        });
        const data = await response.json();
        
        if (data.result) {
            let html = '<table><tr><th>ID</th><th>Name</th><th>Age</th><th>City</th><th>Occupation</th></tr>';
            data.result.forEach(row => {
                html += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td></tr>`;
            });
            html += '</table>';
            document.getElementById('db-table').innerHTML = html;
        }
    } catch (e) {
        document.getElementById('db-table').innerHTML = '<p style="color:#ffd200">Loading table...</p>';
    }
}

// Load Level
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        showWinScreen();
        return;
    }
    
    currentLevel = levelIndex;
    const level = levels[levelIndex];
    setTimeout(() => {
    const progressBar = document.getElementById('progress-fill');
    if (progressBar) {
        const progress = ((currentLevel + 1) / levels.length) * 100;
        progressBar.style.width = progress + '%';
    }
}, 50);
    
    // Update UI
    document.getElementById('mystery-title').textContent = level.title;
    document.getElementById('mystery-text').textContent = "🕵️ Case Info: " + level.story;
    document.getElementById('sql-input').value = '';
    document.getElementById('result-display').innerHTML = '';
    document.getElementById('feedback-box').style.display = 'none';
    document.getElementById('level-display').textContent = `Level: ${levelIndex + 1}/20`;
    
    // Reset & Start Timer
    clearInterval(timerInterval);
    timer = 90;
    hintsUsed = 0;
    updateTimer();
    timerInterval = setInterval(() => {
        timer--;
        updateTimer();
        if (timer <= 0) {
            clearInterval(timerInterval);
            showTimeUp();
        }
    }, 1000);
}

// Update Timer
function updateTimer() {
    const display = document.getElementById('timer-display');
    display.textContent = `⏱️ ${timer}s`;
    if (timer <= 10) {
        display.style.color = '#ff4444';
    } else {
        display.style.color = '#ffd200';
    }
}

// Run Query

async function runQuery() {

    const userQuery = document.getElementById('sql-input').value.trim();

    if (!userQuery) {
        showResult('⚠️ Kuch toh likho!', 'warning');
        return;
    }

    const level = levels[currentLevel];

    try {

        const response = await fetch('http://127.0.0.1:5000/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: userQuery,
                correct_query: level.correct_query
            })
        });

        const data = await response.json();

        if (data.correct === true) {
            document.addEventListener("click",()=>{
            const s =

            document.getElementById("correct-sound").play();
            if (s) s.load();
        });

            clearInterval(timerInterval);

            let bonusPoints = level.points;
            

            score += bonusPoints;

            document.getElementById('score-display').textContent = `Score: ${score}`;

            showQueryResult(data.result);

            document.getElementById('feedback-box').style.display = 'block';
            document.getElementById('feedback-text').textContent =
                `Sahi hai! +${bonusPoints} points! Mystery Solved 🎉`;

            document.getElementById('game-container').classList.add('pulse');

            setTimeout(() => {
                document.getElementById('game-container').classList.remove('pulse');
            }, 500);

        } else {

            document.getElementById("wrong-sound").play();

            showResult('❌ Galat query! Try again!', 'error');

            document.getElementById('game-container').classList.add('shake');

            setTimeout(() => {
                document.getElementById('game-container').classList.remove('shake');
            }, 300);
        }

    } catch (e) {
        console.log("ERROE:",e);
        showResult(e.message, 'error');
    } 
}


// Show Query Result
function showQueryResult(results) {
    if (!results || results.length === 0) {
        document.getElementById('result-display').innerHTML = '<p>Koi result nahi mila!</p>';
        return;
    }
    
    let html = '<table><tr><th>ID</th><th>Name</th><th>Age</th><th>City</th><th>Occupation</th></tr>';
    results.forEach(row => {
        html += `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[4]}</td></tr>`;
    });
    html += '</table>';
    document.getElementById('result-display').innerHTML = html;
}

// Show Result Message
function showResult(message, type) {
    const display = document.getElementById('result-display');
    const colors = {
        'error': '#ff4444',
        'warning': '#ffd200',
        'success': '#00ff88'
    };
    display.innerHTML = `<p style="color: ${colors[type] || 'white'}; font-size: 16px; padding: 10px;">${message}</p>`;
}

// Get Hint
function getHint() {
    hintsUsed++;
     const hint = levels[currentLevel].hint;
    showResult(`💡 Hint: ${hint}`, 'warning');
}

// Next Level
function nextLevel() {
    loadLevel(currentLevel + 1);
}

// Time Up
function showTimeUp() {
    document.getElementById('feedback-box').style.display = 'block';
    document.getElementById('feedback-text').textContent = '⏰ Time Up! Next level try karo!';
    document.getElementById('feedback-text').style.color = '#ff4444';
}

// Win Screen
function showWinScreen() {
    document.getElementById('game-container').innerHTML = `
        <div style="text-align:center; padding: 50px;">
            <h1 style="font-size: 60px; margin-bottom: 20px;">🏆</h1>
            <h2 style="color: #ffd200; font-size: 36px; margin-bottom: 20px;">
                Congratulations!
            </h2>
            <p style="font-size: 24px; margin-bottom: 10px;">
                Tumne saari mysteries solve kar di!
            </p>
            <p style="font-size: 36px; color: #00ff88; margin: 20px 0;">
                Final Score: ${score}
            </p>
            <p style="font-size: 18px; color: #e0e0e0; margin-bottom: 30px;">
                Tum ek expert SQL Detective ho! 🕵️
            </p>
            <button onclick="location.reload()" 
                style="background: linear-gradient(135deg, #f7971e, #ffd200);
                color: #000; border: none; padding: 15px 40px;
                border-radius: 25px; font-size: 18px; 
                font-weight: bold; cursor: pointer;">
                🔄 Play Again
            </button>
        </div>
    `;
}

// Start!
startGame();