import { useState, useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import AdminNavbar from '../../components/admin/AdminNavbar.jsx';
import { PlusCircle, Trash2, MoveUp, MoveDown, Copy } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3000';

export default function AdminCreateQuiz() {
    const [questions, setQuestions] = useState([createEmptyQuestion()]);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    // Create a new blank question
    function createEmptyQuestion() {
        return {
            type: 'multiple-choice',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: null,
        };
    }

    // Handles generic updates for a question field
    function handleChange(index, key, value) {
        const updated = [...questions];
        updated[index][key] = value;
        setQuestions(updated);
    }

    // Updates a specific multiple-choice option
    function handleOptionChange(qIndex, oIndex, value) {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    }

    function addQuestion() {
        setQuestions([...questions, createEmptyQuestion()]);
    }

    function removeQuestion(index) {
        setQuestions(questions.filter((_, i) => i !== index));
    }

    function duplicateQuestion(index) {
        const duplicated = { ...questions[index] };
        setQuestions([
            ...questions.slice(0, index + 1),
            duplicated,
            ...questions.slice(index + 1),
        ]);
    }

    async function handleSubmit() {
        const adminToken = localStorage.getItem('adminToken');
        const adminId = jwtDecode(adminToken).id;
        const payload = {
            title: document.getElementById('text-input').value,
            time: Number(document.getElementById('number-input').value),
            description: document.getElementById('description-input').value,
            category: document.getElementById('category-input').value,
            difficulty: document.getElementById('difficulty-input').value,
            createdBy: adminId,
            questions: questions.map((q) => {
                const options =
                    q.type === 'multiple-choice'
                        ? q.options.map((opt, i) => ({
                              text: opt,
                              isCorrect: q.correctAnswer === i,
                          }))
                        : ['True', 'False'].map((val, i) => ({
                              text: val,
                              isCorrect: q.correctAnswer === val,
                          }));
                return {
                    question: q.question,
                    type: q.type,
                    options,
                };
            }),
            questionsCount: questions.length
        };

        try {
            const response = await axios.post(
                `${BASE_URL}/api/admin/quiz`,
                payload
            );
            if (response.data.success) {
                toast.success('Quiz created successfully');
                navigate('/admin');
            }
        } catch (error) {
            console.log('Failed to create quiz', error);
        }
    }

    function moveQuestion(index, direction) {
        const updated = [...questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= updated.length) return;
        [updated[index], updated[targetIndex]] = [
            updated[targetIndex],
            updated[index],
        ];
        setQuestions(updated);
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/student/categories`);
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <div className="w-full overflow-y-auto">
                <AdminNavbar />
                {/* Main Content */}
                <div className="p-6 h-full w-full">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 mb-8"
                    >
                        <h3 className="text-2xl md:text-3xl text-blue-950 font-bold text-center mb-2">
                            📝 Create{' '}
                            <span className="text-orange-400">Quiz</span>
                        </h3>
                        <p className="text-gray-600 text-center max-w-2xl">
                            Create engaging quizzes for your students with
                            multiple question types
                        </p>
                    </motion.div>

                    {/* Quiz Creation Form */}
                    <div className="max-w-5xl mx-auto">
                        <div className="w-full border border-gray-300 p-6 rounded-lg shadow bg-white flex flex-col justify-center items-center gap-5">
                            <div className="flex justify-center items-center w-full gap-5">
                                <div class="w-full">
                                    <label
                                        for="text-input"
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Quiz Name
                                    </label>
                                    <input
                                        type="text"
                                        id="text-input"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                        placeholder="Enter your quiz name"
                                        required
                                    />
                                </div>
                                <div class="w-full">
                                    <label
                                        for="number-input"
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Time Per Question
                                    </label>
                                    <input
                                        type="number"
                                        id="number-input"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                        placeholder="15s"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <div>
                                    <label
                                        for="category-input"
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        id="category-input"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                        placeholder="Quiz category"
                                        required
                                    />
                                </div>
                        </div>
                        <div className='flex justify-center items-center w-full gap-5'>
                            <div class="w-full">
                                <label for="category-input" class="text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                <select
                                    id="category-input"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div class="w-full">
                                <label for="difficulty-input" class="text-sm font-medium text-gray-900 dark:text-white">Difficulty</label>
                                <select id="difficulty-input"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5" 
                                        required
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <div>
                                    <label
                                        for="description-input"
                                        class="text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        id="description-input"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                        placeholder="Description or Instruction"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 px-6 max-w-5xl mx-auto">
                        {/* question card */}
                        {questions.map((q, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 p-6 rounded-lg shadow bg-white space-y-4 relative"
                            >
                                <div className="absolute right-4 top-4 flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            moveQuestion(index, 'up')
                                        }
                                        title="Move Up"
                                        className="hover:scale-110"
                                    >
                                        <MoveUp size={18} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            moveQuestion(index, 'down')
                                        }
                                        title="Move Down"
                                        className="hover:scale-110"
                                    >
                                        <MoveDown size={18} />
                                    </button>
                                    <button
                                        onClick={() => duplicateQuestion(index)}
                                        title="Duplicate"
                                        className="hover:scale-110"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    <button
                                        onClick={() => removeQuestion(index)}
                                        title="Delete"
                                        className="text-red-500 hover:scale-110"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="text-sm text-gray-500 font-bold">
                                    Question {index + 1}
                                </div>

                                <input
                                    type="text"
                                    className="w-full p-3 border rounded border-gray-300"
                                    placeholder="Enter your question"
                                    value={q.question}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            'question',
                                            e.target.value
                                        )
                                    }
                                />

                                <select
                                    className="w-full p-3 border rounded border-gray-300 bg-gray-50"
                                    value={q.type}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            'type',
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="multiple-choice">
                                        Multiple Choice
                                    </option>
                                    <option value="true-false">
                                        True / False
                                    </option>
                                </select>

                                {q.type === 'multiple-choice' && (
                                    <div className="grid grid-cols-2 gap-5">
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`correct-${index}`}
                                                    checked={
                                                        q.correctAnswer === i
                                                    }
                                                    onChange={() =>
                                                        handleChange(
                                                            index,
                                                            'correctAnswer',
                                                            i
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${
                                                        i + 1
                                                    }`}
                                                    className="flex-1 p-2 border rounded border-gray-300"
                                                    value={opt}
                                                    onChange={(e) =>
                                                        handleOptionChange(
                                                            index,
                                                            i,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'true-false' && (
                                    <div className="space-y-2">
                                        {['True', 'False'].map((val, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`correct-${index}`}
                                                    checked={
                                                        q.correctAnswer === val
                                                    }
                                                    onChange={() =>
                                                        handleChange(
                                                            index,
                                                            'correctAnswer',
                                                            val
                                                        )
                                                    }
                                                />
                                                <label>{val}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="flex flex-row-reverse justify-between items-center">
                            <button
                                onClick={addQuestion}
                                className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:scale-110"
                            >
                                <PlusCircle size={18} /> Add More Question
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded hover:scale-110"
                            >
                                Finish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
