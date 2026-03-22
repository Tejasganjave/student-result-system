// ========================================
// SIMPLE WORKING STUDENT SYSTEM
// ========================================
let students = [];

function init() {
    // Load from localStorage
    const saved = localStorage.getItem('studentsData');
    if (saved) {
        students = JSON.parse(saved);
    }
    updateTable();
    console.log('Loaded', students.length, 'students');
}

function addStudent() {
    // Get form values
    const name = document.getElementById('name').value.trim();
    const rollno = document.getElementById('rollno').value.trim();
    const cls = document.getElementById('class').value;
    const s1 = parseFloat(document.getElementById('subject1').value) || 0;
    const s2 = parseFloat(document.getElementById('subject2').value) || 0;
    const s3 = parseFloat(document.getElementById('subject3').value) || 0;

    // Validation
    if (!name || !rollno || !cls) {
        alert('Please fill Name, Roll No, and Class!');
        return false;
    }

    // Calculate results
    const total = s1 + s2 + s3;
    const percentage = (total / 300) * 100;
    const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';

    // Add student
    const student = {
        id: Date.now(),
        name: name,
        rollno: rollno,
        class: cls,
        subject1: s1,
        subject2: s2,
        subject3: s3,
        total: total,
        percentage: percentage,
        grade: grade
    };

    students.unshift(student);
    localStorage.setItem('studentsData', JSON.stringify(students));

    // Clear form
    document.getElementById('studentForm').reset();

    alert('✅ Student Added Successfully!');
    updateTable();
    return false;
}

function updateTable() {
    const tableBody = document.querySelector('#studentsTable tbody');
    
    if (!tableBody) {
        console.error('❌ Table body not found! Check HTML');
        return;
    }

    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="11" class="text-center p-4">No students found. Add your first student!</td></tr>';
        return;
    }

    // Create table rows
    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.rollno}</td>
            <td>${student.class}</td>
            <td>${student.subject1}</td>
            <td>${student.subject2}</td>
            <td>${student.subject3}</td>
            <td><strong>${student.total.toFixed(0)}</strong></td>
            <td><strong>${student.percentage.toFixed(1)}%</strong></td>
            <td class="fw-bold ${getGradeClass(student.grade)}">${student.grade}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function getGradeClass(grade) {
    return grade === 'A' ? 'bg-success text-white' : 
           grade === 'B' ? 'bg-warning text-dark' : 
           grade === 'C' ? 'bg-info text-dark' : 'bg-danger text-white';
}

function deleteStudent(id) {
    if (confirm('Delete this student?')) {
        students = students.filter(s => s.id !== id);
        localStorage.setItem('studentsData', JSON.stringify(students));
        updateTable();
        alert('🗑️ Student deleted!');
    }
}

function clearAll() {
    if (confirm('Delete ALL students?')) {
        students = [];
        localStorage.removeItem('studentsData');
        updateTable();
        alert('All data cleared!');
    }
}

// ========================================
// PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Page loaded!');
    
    // Form submit
    const form = document.getElementById('studentForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            addStudent();
        };
    } else {
        console.error('❌ Form not found! ID should be "studentForm"');
    }
    
    // Load data
    init();
    
    // Debug info
    console.log('✅ Script ready! Form found:', !!form);
    console.log('Table ready. Students:', students.length);
});