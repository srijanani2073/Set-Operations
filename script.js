        function parseSet(input) {
            if (!input.trim()) return new Set();
            
            return new Set(
                input.split(',')
                    .map(item => item.trim())
                    .filter(item => item !== '')
            );
        }

        function setToString(set) {
            if (set.size === 0) return '∅ (empty set)';
            return '{' + Array.from(set).sort().join(', ') + '}';
        }

        function updatePreviews() {
            const setAInput = document.getElementById('setA').value;
            const setBInput = document.getElementById('setB').value;
            
            const setAPreview = document.getElementById('setA-preview');
            const setBPreview = document.getElementById('setB-preview');
            
            if (setAInput.trim()) {
                const setA = parseSet(setAInput);
                setAPreview.textContent = setToString(setA);
                setAPreview.classList.remove('empty-state');
            } else {
                setAPreview.textContent = 'Enter elements above';
                setAPreview.classList.add('empty-state');
            }
            
            if (setBInput.trim()) {
                const setB = parseSet(setBInput);
                setBPreview.textContent = setToString(setB);
                setBPreview.classList.remove('empty-state');
            } else {
                setBPreview.textContent = 'Enter elements above';
                setBPreview.classList.add('empty-state');
            }
        }

        function performOperation(operation) {
            const setAInput = document.getElementById('setA').value;
            const setBInput = document.getElementById('setB').value;
            const resultElement = document.getElementById('result');
            
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            try {
                const setA = parseSet(setAInput);
                const setB = parseSet(setBInput);
                let result;
                let resultText;
                
                switch (operation) {
                    case 'union':
                        result = new Set([...setA, ...setB]);
                        resultText = `A ∪ B = ${setToString(result)}`;
                        break;
                        
                    case 'intersection':
                        result = new Set([...setA].filter(x => setB.has(x)));
                        resultText = `A ∩ B = ${setToString(result)}`;
                        break;
                        
                    case 'difference':
                        result = new Set([...setA].filter(x => !setB.has(x)));
                        resultText = `A - B = ${setToString(result)}`;
                        break;
                        
                    case 'complement':
                        result = new Set([...setB].filter(x => !setA.has(x)));
                        resultText = `B - A = ${setToString(result)}`;
                        break;
                        
                    case 'symmetricDifference':
                        const aMinusB = new Set([...setA].filter(x => !setB.has(x)));
                        const bMinusA = new Set([...setB].filter(x => !setA.has(x)));
                        result = new Set([...aMinusB, ...bMinusA]);
                        resultText = `(A - B) ∪ (B - A) = ${setToString(result)}`;
                        break;
                        
                    case 'disjoint':
                        const intersection = new Set([...setA].filter(x => setB.has(x)));
                        const isDisjoint = intersection.size === 0;
                        resultText = `Sets are ${isDisjoint ? 'DISJOINT' : 'NOT DISJOINT'}`;
                        if (!isDisjoint) {
                            resultText += ` (common elements: ${setToString(intersection)})`;
                        }
                        break;
                        
                    default:
                        resultText = 'Unknown operation';
                }
                
                resultElement.textContent = resultText;
                resultElement.classList.add('result-animation');
                
                setTimeout(() => {
                    resultElement.classList.remove('result-animation');
                }, 600);
                
            } catch (error) {
                resultElement.textContent = 'Error in calculation';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = `Error: ${error.message}`;
                document.querySelector('.result-section').appendChild(errorDiv);
            }
        }

        function clearAll() {
            document.getElementById('setA').value = '';
            document.getElementById('setB').value = '';
            document.getElementById('result').textContent = 'Select an operation to see the result';
            
            const errorMessage = document.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            
            updatePreviews();
        }

        document.getElementById('setA').addEventListener('input', updatePreviews);
        document.getElementById('setB').addEventListener('input', updatePreviews);

        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey || event.metaKey) {
                switch (event.key.toLowerCase()) {
                    case 'u':
                        event.preventDefault();
                        performOperation('union');
                        break;
                    case 'i':
                        event.preventDefault();
                        performOperation('intersection');
                        break;
                    case 'd':
                        event.preventDefault();
                        performOperation('difference');
                        break;
                    case 'r':
                        event.preventDefault();
                        clearAll();
                        break;
                }
            }
        });
        updatePreviews();
