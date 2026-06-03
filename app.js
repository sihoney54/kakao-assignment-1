// 1. DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const errorMsg = document.getElementById('error-msg');
const tabBtns = document.querySelectorAll('.tab-btn');

// 날짜 관련 DOM 요소
const currentDateDisplay = document.getElementById('current-date-display');
const prevDateBtn = document.getElementById('prev-date-btn');
const nextDateBtn = document.getElementById('next-date-btn');

// 2. 상태 관리
// [로컬스토리지 연동] 페이지 최초 로드 시 기존 데이터를 불러오고, 없으면 빈 배열로 초기화합니다.
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; 
let viewedDate = new Date(); 

// 3. 로컬스토리지 저장 헬퍼 함수
// 할 일 데이터가 변경될 때마다 호출하여 로컬스토리지의 값을 최신화합니다.
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 4. 날짜 포맷 변환 헬퍼 함수
function getFormatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDisplayDateString(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options);
}

// 5. 날짜 변경 기능
function changeDate(offset) {
    viewedDate.setDate(viewedDate.getDate() + offset);
    renderTodos(); 
}

// 6. 할 일 추가 기능
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        errorMsg.classList.add('visible');
        todoInput.focus();
        return;
    }

    errorMsg.classList.remove('visible');

    const newTodo = {
        id: Date.now(),
        text: text,
        date: getFormatDateString(viewedDate), 
        isCompleted: false,
        isEditing: false
    };

    todos.push(newTodo);
    todoInput.value = '';
    
    saveToLocalStorage(); // 로컬스토리지에 저장
    changeFilter('all');
}

// 7. 할 일 삭제 기능
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage(); // 로컬스토리지에 저장
    renderTodos();
}

// 8. 할 일 완료/미완료 토글 기능
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    saveToLocalStorage(); // 로컬스토리지에 저장
    renderTodos();
}

// 9-1. 수정 모드로 전환 기능
function enterEditMode(id) {
    // 인라인 수정을 시작할 때는 화면 임시 상태이므로 로컬스토리지 저장을 유보합니다.
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isEditing: true };
        }
        return todo;
    });
    renderTodos();
}

// 9-2. 수정된 내용 저장 기능
function saveEdit(id, newText) {
    if (newText.trim() === '') {
        alert('수정할 내용을 입력해주세요.');
        return;
    }

    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text: newText.trim(), isEditing: false };
        }
        return todo;
    });
    saveToLocalStorage(); // 수정한 내용을 최종적으로 로컬스토리지에 저장
    renderTodos();
}

// 9-3. 수정 취소 기능
function cancelEdit(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isEditing: false };
        }
        return todo;
    });
    renderTodos();
}

// 10. 상태 필터 변경 기능
function changeFilter(filterType) {
    currentFilter = filterType; 

    tabBtns.forEach(btn => {
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTodos();
}

// 11. 화면에 데이터를 그리는 기능
function renderTodos() {
    todoList.innerHTML = '';
    
    currentDateDisplay.textContent = getDisplayDateString(viewedDate);

    const targetDateString = getFormatDateString(viewedDate);
    
    const filteredTodos = todos.filter(todo => {
        const isSameDate = todo.date === targetDateString;
        
        let isStatusMatch = true;
        if (currentFilter === 'active') isStatusMatch = !todo.isCompleted;
        if (currentFilter === 'completed') isStatusMatch = todo.isCompleted;
        
        return isSameDate && isStatusMatch;
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        if (todo.isEditing) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = todo.text;
            editInput.className = 'edit-input';

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit(todo.id, editInput.value);
            });

            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';

            const saveBtn = document.createElement('button');
            saveBtn.className = 'save-btn';
            saveBtn.textContent = '저장';
            saveBtn.onclick = () => saveEdit(todo.id, editInput.value);

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = '취소';
            cancelBtn.onclick = () => cancelEdit(todo.id);

            btnGroup.appendChild(saveBtn);
            btnGroup.appendChild(cancelBtn);

            li.appendChild(editInput);
            li.appendChild(btnGroup);
            todoList.appendChild(li);

            setTimeout(() => editInput.focus(), 0);

        } else {
            if (todo.isCompleted) li.classList.add('completed');

            const textSpan = document.createElement('span');
            textSpan.textContent = todo.text;

            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';

            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            completeBtn.textContent = todo.isCompleted ? '취소' : '완료';
            completeBtn.onclick = () => toggleComplete(todo.id);

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = '수정';
            editBtn.onclick = () => enterEditMode(todo.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '삭제';
            deleteBtn.onclick = () => deleteTodo(todo.id);

            btnGroup.appendChild(completeBtn);
            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            li.appendChild(textSpan);
            li.appendChild(btnGroup);
            todoList.appendChild(li);
        }
    });
}

// 12. 이벤트 리스너 등록
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        changeFilter(btn.dataset.filter);
    });
});

prevDateBtn.addEventListener('click', () => changeDate(-1));
nextDateBtn.addEventListener('click', () => changeDate(1));

// 앱 초기 실행 시 로컬스토리지에서 복원된 데이터 기반으로 화면을 렌더링합니다.
renderTodos();