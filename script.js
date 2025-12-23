function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

// Data Handling
function loadData() { return JSON.parse(localStorage.getItem('students')) || {}; }
function saveData(data) { localStorage.setItem('students', JSON.stringify(data)); }
function calculateGPA(marks) {
    let total = 0, count = 0;
    for (let key in marks){ total += marks[key]; count++; }
    return (total / count / 10).toFixed(2);
}
function suggestTimetable(marks) {
    let subjects = Object.entries(marks).sort((a,b) => a[1] - b[1]);
    let timetable = {};
    let hours = 2;
    subjects.forEach((sub, idx) => { timetable[`Day ${idx+1}`] = { [sub[0]]: `${hours} hrs` }; });
    return timetable;
}

// Add / Update Student
function createSubjects() {
    const count = parseInt(document.getElementById('subjectCount').value);
    const container = document.getElementById('subjectsContainer');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <input type="text" placeholder="Subject Name" id="sub${i}">
            <input type="number" placeholder="Marks" id="mark${i}"><br>`;
    }
}
function saveStudent() {
    const roll = document.getElementById('roll').value;
    const name = document.getElementById('name').value;
    const count = parseInt(document.getElementById('subjectCount').value);
    const marks = {};
    for (let i = 0; i < count; i++) {
        marks[document.getElementById(`sub${i}`).value] = parseFloat(document.getElementById(`mark${i}`).value);
    }
    const gpa = calculateGPA(marks);
    const timetable = suggestTimetable(marks);
    const data = loadData();
    data[roll] = { name, marks, gpa, timetable };
    saveData(data);
    alert(`Student ${name} saved with GPA: ${gpa}`);
    document.getElementById('subjectsContainer').innerHTML = '';
}

// View Student
function viewStudent() {
    const roll = document.getElementById('searchRoll').value;
    const data = loadData();
    const container = document.getElementById('studentDetails');
    if (roll in data) {
        const student = data[roll];
        let html = `<h3>${student.name}</h3>`;
        html += `<b>Marks:</b><br><table><tr><th>Subject</th><th>Marks</th></tr>`;
        for (let sub in student.marks) { html += `<tr><td>${sub}</td><td>${student.marks[sub]}</td></tr>`; }
        html += `</table><b>GPA:</b> ${student.gpa}`;
        container.innerHTML = html;
    } else { container.innerHTML = "Student not found!"; }
}

// Timetable
function generateTimetable() {
    const data = loadData();
    const container = document.getElementById('timetableDisplay');
    container.innerHTML = '';
    for (let roll in data) {
        const student = data[roll];
        container.innerHTML += `<h4>${student.name} (Roll: ${roll})</h4>`;
        for (let day in student.timetable) {
            container.innerHTML += `<b>${day}:</b> `;
            for (let sub in student.timetable[day]) {
                container.innerHTML += `${sub} - ${student.timetable[day][sub]} `;
            }
            container.innerHTML += `<br>`;
        }
        container.innerHTML += `<hr>`;
    }
}
