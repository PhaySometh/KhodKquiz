import { useState } from 'react';
import Sidebar from '../components/NavBarDashBoard.jsx'
import { PlusCircle, Trash2, MoveUp, MoveDown, Copy } from 'lucide-react';

export default function CreateQuizForm() {
    const [questions, setQuestions] = useState([createEmptyQuestion()]);

    function createEmptyQuestion() {
        return {
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: null,
        description: '',
        };
    }

    function handleChange(index, key, value) {
        const updated = [...questions];
        updated[index][key] = value;
        setQuestions(updated);
    }

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
        setQuestions([...questions.slice(0, index + 1), duplicated, ...questions.slice(index + 1)]);
    }

    function moveQuestion(index, direction) {
        const updated = [...questions];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= updated.length) return;
        [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
        setQuestions(updated);
    }

    return (
        
        <div className='flex h-screen bg-gray-50 overflow-hidden'>
            <Sidebar />
            <div className='w-full overflow-y-auto'>
                <div className="p-6 max-w-5xl mx-auto space-y-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">📝 Create <span className='text-orange-400'>Quiz</span></h2>
                        <button
                            onClick={addQuestion}
                            className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            <PlusCircle size={18} /> Add Question
                        </button>
                    </div>
                    {/* question card */}
                    {questions.map((q, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 p-6 rounded-lg shadow bg-white space-y-4 relative"
                        >
                        <div className="absolute right-4 top-4 flex items-center gap-2">
                            <button onClick={() => moveQuestion(index, 'up')} title="Move Up"><MoveUp size={18} /></button>
                            <button onClick={() => moveQuestion(index, 'down')} title="Move Down"><MoveDown size={18} /></button>
                            <button onClick={() => duplicateQuestion(index)} title="Duplicate"><Copy size={18} /></button>
                            <button onClick={() => removeQuestion(index)} title="Delete" className="text-red-500"><Trash2 size={18} /></button>
                        </div>

                        <div className="text-sm text-gray-500 font-bold">Question {index + 1}</div>

                        <input
                            type="text"
                            className="w-full p-3 border rounded border-gray-300"
                            placeholder="Enter your question"
                            value={q.question}
                            onChange={(e) => handleChange(index, 'question', e.target.value)}
                            />

                        <textarea
                            className="w-full p-3 border rounded border-gray-300"
                            placeholder="Optional description or explanation"
                            value={q.description}
                            onChange={(e) => handleChange(index, 'description', e.target.value)}
                        />

                        <select
                            className="w-full p-3 border rounded border-gray-300 bg-gray-50"
                            value={q.type}
                            onChange={(e) => handleChange(index, 'type', e.target.value)}
                            >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True / False</option>
                            <option value="short-answer">Short Answer</option>
                        </select>

                        {q.type === 'multiple-choice' && (
                            <div className="space-y-2">
                            {q.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={q.correctAnswer === i}
                                    onChange={() => handleChange(index, 'correctAnswer', i)}
                                    />
                                <input
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    className="flex-1 p-2 border rounded border-gray-300"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(index, i, e.target.value)}
                                    />
                                </div>
                            ))}
                            </div>
                        )}

                        {q.type === 'true-false' && (
                            <div className="space-y-2">
                            {['True', 'False'].map((val, i) => (
                                <div key={i} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name={`correct-${index}`}
                                    checked={q.correctAnswer === val}
                                    onChange={() => handleChange(index, 'correctAnswer', val)}
                                />
                                <label>{val}</label>
                                </div>
                            ))}
                            </div>
                        )}

                        {q.type === 'short-answer' && (
                            <input
                            type="text"
                            className="w-full p-3 border rounded"
                            placeholder="Expected short answer"
                            value={q.correctAnswer || ''}
                            onChange={(e) => handleChange(index, 'correctAnswer', e.target.value)}
                            />
                        )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
