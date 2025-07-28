/**
 * Code Syntax Highlighting Component
 * 
 * This component provides syntax highlighting for code snippets
 * in quiz questions and answers.
 */

import React from 'react';

const CodeHighlight = ({ code, language = 'javascript', inline = false }) => {
    // Simple syntax highlighting patterns for common languages
    const syntaxPatterns = {
        javascript: [
            { pattern: /\b(function|var|let|const|if|else|for|while|return|class|extends|import|export|async|await|try|catch|finally)\b/g, className: 'text-purple-400 font-semibold' },
            { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-orange-400' },
            { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-green-400' },
            { pattern: /"([^"\\]|\\.)*"/g, className: 'text-yellow-300' },
            { pattern: /'([^'\\]|\\.)*'/g, className: 'text-yellow-300' },
            { pattern: /`([^`\\]|\\.)*`/g, className: 'text-yellow-300' },
            { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
            { pattern: /\b(console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON)\b/g, className: 'text-blue-400' },
        ],
        java: [
            { pattern: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super)\b/g, className: 'text-purple-400 font-semibold' },
            { pattern: /\b(int|double|float|boolean|char|String|void|long|short|byte)\b/g, className: 'text-blue-400 font-semibold' },
            { pattern: /\b(true|false|null)\b/g, className: 'text-orange-400' },
            { pattern: /\b\d+(\.\d+)?[fFdDlL]?\b/g, className: 'text-green-400' },
            { pattern: /"([^"\\]|\\.)*"/g, className: 'text-yellow-300' },
            { pattern: /'([^'\\]|\\.)*'/g, className: 'text-yellow-300' },
            { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
            { pattern: /\b(System|Math|String|Integer|Double|Boolean|ArrayList|HashMap|Scanner)\b/g, className: 'text-cyan-400' },
        ],
        c: [
            { pattern: /\b(int|char|float|double|void|long|short|unsigned|signed|const|static|extern|auto|register|volatile|struct|union|enum|typedef|sizeof|if|else|for|while|do|switch|case|default|break|continue|return|goto)\b/g, className: 'text-purple-400 font-semibold' },
            { pattern: /\b(NULL|true|false)\b/g, className: 'text-orange-400' },
            { pattern: /\b\d+(\.\d+)?[fFlL]?\b/g, className: 'text-green-400' },
            { pattern: /"([^"\\]|\\.)*"/g, className: 'text-yellow-300' },
            { pattern: /'([^'\\]|\\.)*'/g, className: 'text-yellow-300' },
            { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
            { pattern: /#\s*(include|define|ifdef|ifndef|endif|if|else|elif|pragma)\b/g, className: 'text-pink-400' },
            { pattern: /\b(printf|scanf|malloc|free|strlen|strcpy|strcmp|strcat|fopen|fclose|fprintf|fscanf)\b/g, className: 'text-cyan-400' },
        ],
        python: [
            { pattern: /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|lambda|pass|break|continue|global|nonlocal|assert|del|raise|and|or|not|in|is)\b/g, className: 'text-purple-400 font-semibold' },
            { pattern: /\b(True|False|None)\b/g, className: 'text-orange-400' },
            { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-green-400' },
            { pattern: /"([^"\\]|\\.)*"/g, className: 'text-yellow-300' },
            { pattern: /'([^'\\]|\\.)*'/g, className: 'text-yellow-300' },
            { pattern: /"""[\s\S]*?"""/g, className: 'text-yellow-300' },
            { pattern: /#.*$/gm, className: 'text-gray-500 italic' },
            { pattern: /\b(print|input|len|range|enumerate|zip|map|filter|sorted|sum|max|min|abs|round|int|float|str|list|dict|set|tuple)\b/g, className: 'text-cyan-400' },
        ],
        sql: [
            { pattern: /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP|BY|HAVING|ORDER|ASC|DESC|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DATABASE|INDEX|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|UNIQUE|DEFAULT|AUTO_INCREMENT|VARCHAR|INT|INTEGER|DECIMAL|DATE|DATETIME|TIMESTAMP|TEXT|BLOB)\b/gi, className: 'text-purple-400 font-semibold' },
            { pattern: /\b(AND|OR|NOT|IN|LIKE|BETWEEN|IS|EXISTS|CASE|WHEN|THEN|ELSE|END|AS|DISTINCT|ALL|ANY|SOME|UNION|INTERSECT|EXCEPT)\b/gi, className: 'text-blue-400 font-semibold' },
            { pattern: /\b(COUNT|SUM|AVG|MAX|MIN|ROUND|UPPER|LOWER|SUBSTRING|CONCAT|NOW|CURDATE|CURTIME)\b/gi, className: 'text-cyan-400' },
            { pattern: /\b\d+(\.\d+)?\b/g, className: 'text-green-400' },
            { pattern: /'([^'\\]|\\.)*'/g, className: 'text-yellow-300' },
            { pattern: /--.*$/gm, className: 'text-gray-500 italic' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic' },
        ]
    };

    const highlightCode = (code, language) => {
        let highlightedCode = code;
        const patterns = syntaxPatterns[language] || syntaxPatterns.javascript;
        
        // Apply syntax highlighting patterns
        patterns.forEach((pattern, index) => {
            highlightedCode = highlightedCode.replace(pattern.pattern, (match) => {
                return `<span class="${pattern.className}">${match}</span>`;
            });
        });
        
        return highlightedCode;
    };

    const highlightedCode = highlightCode(code, language);

    if (inline) {
        return (
            <code 
                className="bg-gray-800 text-gray-100 px-2 py-1 rounded font-mono text-sm"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
        );
    }

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            {/* Code header with language indicator */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <span className="text-gray-400 text-sm font-medium uppercase">
                    {language}
                </span>
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
            </div>
            
            {/* Code content */}
            <pre className="p-4 overflow-x-auto">
                <code 
                    className="text-gray-100 font-mono text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </pre>
        </div>
    );
};

// Utility function to detect if text contains code
export const containsCode = (text) => {
    const codeIndicators = [
        /```[\s\S]*?```/g, // Markdown code blocks
        /`[^`]+`/g, // Inline code
        /\b(function|var|let|const|class|def|public|private|int|char|SELECT|FROM|WHERE)\b/g, // Keywords
        /[{}();]/g, // Common code punctuation
        /\b\w+\(\)/g, // Function calls
        /#include|import\s+\w+|from\s+\w+/g, // Import statements
    ];
    
    return codeIndicators.some(pattern => pattern.test(text));
};

// Utility function to extract language from text context
export const detectLanguage = (text) => {
    if (/\b(function|var|let|const|console\.log|document\.|window\.)\b/i.test(text)) {
        return 'javascript';
    }
    if (/\b(public|private|class|System\.out|import java)\b/i.test(text)) {
        return 'java';
    }
    if (/\b(#include|printf|scanf|int main|malloc|free)\b/i.test(text)) {
        return 'c';
    }
    if (/\b(def|print|import|from|class.*:|\blen\()\b/i.test(text)) {
        return 'python';
    }
    if (/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE TABLE)\b/i.test(text)) {
        return 'sql';
    }
    return 'javascript'; // Default
};

export default CodeHighlight;
