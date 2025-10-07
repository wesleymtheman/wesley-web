// Cooking Master Game
// WesleyDude.com

class CookingMaster {
    constructor() {
        this.gameState = 'waiting'; // waiting, playing, paused, finished
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.currentRecipe = [];
        this.currentStep = 0;
        this.panIngredients = [];
        this.gameTimer = null;
        this.cookingTimers = new Map();
        this.difficulty = 'normal'; // easy, normal, hard, master
        this.combo = 0;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.perfectDishes = 0;
        this.streak = 0;
        
        this.ingredients = {
            carrot: { name: 'Carrot', icon: '🥕', cookTime: 3 },
            potato: { name: 'Potato', icon: '🥔', cookTime: 5 },
            onion: { name: 'Onion', icon: '🧅', cookTime: 2 },
            tomato: { name: 'Tomato', icon: '🍅', cookTime: 2 },
            mushroom: { name: 'Mushroom', icon: '🍄', cookTime: 4 },
            pepper: { name: 'Pepper', icon: '🫑', cookTime: 2 },
            broccoli: { name: 'Broccoli', icon: '🥦', cookTime: 4 },
            corn: { name: 'Corn', icon: '🌽', cookTime: 5 },
            garlic: { name: 'Garlic', icon: '🧄', cookTime: 1 },
            spinach: { name: 'Spinach', icon: '🥬', cookTime: 1 },
            cheese: { name: 'Cheese', icon: '🧀', cookTime: 1 },
            bacon: { name: 'Bacon', icon: '🥓', cookTime: 3 },
            chicken: { name: 'Chicken', icon: '🍗', cookTime: 6 },
            fish: { name: 'Fish', icon: '🐟', cookTime: 4 },
            rice: { name: 'Rice', icon: '🍚', cookTime: 3 },
            pasta: { name: 'Pasta', icon: '🍝', cookTime: 4 }
        };
        
        this.recipes = [
            {
                name: 'Simple Salad',
                ingredients: ['tomato', 'onion'],
                points: 50,
                difficulty: 'easy'
            },
            {
                name: 'Vegetable Stir Fry',
                ingredients: ['carrot', 'onion', 'pepper'],
                points: 100,
                difficulty: 'normal'
            },
            {
                name: 'Garden Salad',
                ingredients: ['tomato', 'onion', 'carrot'],
                points: 80,
                difficulty: 'normal'
            },
            {
                name: 'Mushroom Medley',
                ingredients: ['mushroom', 'onion', 'pepper'],
                points: 120,
                difficulty: 'normal'
            },
            {
                name: 'Root Vegetables',
                ingredients: ['potato', 'carrot', 'onion'],
                points: 150,
                difficulty: 'normal'
            },
            {
                name: 'Green Delight',
                ingredients: ['broccoli', 'spinach', 'garlic'],
                points: 110,
                difficulty: 'normal'
            },
            {
                name: 'Corn Chowder',
                ingredients: ['corn', 'potato', 'onion'],
                points: 130,
                difficulty: 'normal'
            },
            {
                name: 'Cheesy Pasta',
                ingredients: ['cheese', 'garlic', 'tomato'],
                points: 90,
                difficulty: 'normal'
            },
            {
                name: 'Bacon Breakfast',
                ingredients: ['bacon', 'eggs', 'potato'],
                points: 140,
                difficulty: 'normal'
            },
            {
                name: 'Mediterranean Mix',
                ingredients: ['tomato', 'garlic', 'spinach'],
                points: 95,
                difficulty: 'normal'
            },
            {
                name: 'Hearty Stew',
                ingredients: ['potato', 'carrot', 'mushroom', 'onion'],
                points: 200,
                difficulty: 'hard'
            },
            {
                name: 'Chicken Stir Fry',
                ingredients: ['chicken', 'carrot', 'onion', 'pepper'],
                points: 250,
                difficulty: 'hard'
            },
            {
                name: 'Fish & Rice',
                ingredients: ['fish', 'rice', 'garlic', 'spinach'],
                points: 220,
                difficulty: 'hard'
            },
            {
                name: 'Pasta Primavera',
                ingredients: ['pasta', 'tomato', 'garlic', 'cheese', 'onion'],
                points: 300,
                difficulty: 'hard'
            },
            {
                name: 'Master Chef Special',
                ingredients: ['chicken', 'rice', 'carrot', 'onion', 'garlic'],
                points: 400,
                difficulty: 'master'
            },
            {
                name: 'Ultimate Feast',
                ingredients: ['fish', 'pasta', 'tomato', 'garlic', 'cheese', 'spinach'],
                points: 500,
                difficulty: 'master'
            },
            {
                name: 'Bacon Bomb',
                ingredients: ['bacon', 'chicken', 'potato', 'onion', 'garlic', 'cheese'],
                points: 450,
                difficulty: 'master'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateRecipe();
        this.updateDisplay();
        this.showMessage('Welcome to Cooking Master! 🍳', 'info');
    }
    
    bindEvents() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Instructions button
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        // Close instructions
        document.getElementById('closeInstructions').addEventListener('click', () => {
            this.hideInstructions();
        });
        
        // Close instructions on modal background click
        document.getElementById('instructionsModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideInstructions();
            }
        });
        
        // Ingredient clicks
        document.querySelectorAll('.ingredient-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (this.gameState === 'playing') {
                    this.addIngredientToPan(e.currentTarget.dataset.ingredient);
                }
            });
        });
        
        // Pan click to serve
        document.getElementById('pan').addEventListener('click', () => {
            if (this.gameState === 'playing' && this.panIngredients.length > 0) {
                this.serveDish();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                switch(e.key) {
                    case '1': this.addIngredientToPan('carrot'); break;
                    case '2': this.addIngredientToPan('potato'); break;
                    case '3': this.addIngredientToPan('onion'); break;
                    case '4': this.addIngredientToPan('tomato'); break;
                    case '5': this.addIngredientToPan('mushroom'); break;
                    case '6': this.addIngredientToPan('pepper'); break;
                    case '7': this.addIngredientToPan('broccoli'); break;
                    case '8': this.addIngredientToPan('corn'); break;
                    case '9': this.addIngredientToPan('garlic'); break;
                    case '0': this.addIngredientToPan('spinach'); break;
                    case 'q': this.addIngredientToPan('cheese'); break;
                    case 'w': this.addIngredientToPan('bacon'); break;
                    case 'e': this.addIngredientToPan('chicken'); break;
                    case 'r': this.addIngredientToPan('fish'); break;
                    case 't': this.addIngredientToPan('rice'); break;
                    case 'y': this.addIngredientToPan('pasta'); break;
                    case ' ': 
                        e.preventDefault();
                        this.serveDish();
                        break;
                }
            }
        });
    }
    
    generateRecipe() {
        // Filter recipes based on difficulty and level
        let availableRecipes = this.recipes.filter(recipe => {
            if (this.level <= 3) return recipe.difficulty === 'easy';
            if (this.level <= 6) return ['easy', 'normal'].includes(recipe.difficulty);
            if (this.level <= 10) return ['easy', 'normal', 'hard'].includes(recipe.difficulty);
            return true; // Master level - all recipes
        });
        
        const recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
        this.currentRecipe = recipe.ingredients.map(ing => ({
            ingredient: ing,
            cooked: false,
            cooking: false
        }));
        this.currentStep = 0;
        this.updateRecipeDisplay();
    }
    
    updateRecipeDisplay() {
        const recipeDisplay = document.getElementById('recipeDisplay');
        recipeDisplay.innerHTML = '';
        
        this.currentRecipe.forEach((item, index) => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            
            if (item.cooked) {
                recipeItem.classList.add('completed');
            } else if (index === this.currentStep) {
                recipeItem.classList.add('current');
            }
            
            const ingredient = this.ingredients[item.ingredient];
            recipeItem.innerHTML = `
                <span class="ingredient">${ingredient.icon} ${ingredient.name}</span>
                <span class="timer">${ingredient.cookTime}s</span>
            `;
            
            recipeDisplay.appendChild(recipeItem);
        });
    }
    
    startGame() {
        if (this.gameState === 'waiting') {
            this.gameState = 'playing';
            this.timeLeft = Math.max(30, 60 - (this.level * 3)); // Less time per level
            this.mistakes = 0;
            this.combo = 0;
            this.streak = 0;
            this.startTimer();
            this.showMessage(`Level ${this.level} Started! Time: ${this.timeLeft}s ⏰`, 'info');
            document.getElementById('startBtn').textContent = 'Pause';
            document.getElementById('startBtn').onclick = () => this.pauseGame();
        }
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            clearInterval(this.gameTimer);
            this.showMessage('Game Paused', 'info');
            document.getElementById('startBtn').textContent = 'Resume';
            document.getElementById('startBtn').onclick = () => this.resumeGame();
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
            this.showMessage('Game Resumed!', 'info');
            document.getElementById('startBtn').textContent = 'Pause';
            document.getElementById('startBtn').onclick = () => this.pauseGame();
        }
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    addIngredientToPan(ingredientType) {
        if (this.currentStep >= this.currentRecipe.length) {
            this.showMessage('Recipe complete! Serve the dish! 🍽️', 'info');
            return;
        }
        
        const currentIngredient = this.currentRecipe[this.currentStep].ingredient;
        if (ingredientType !== currentIngredient) {
            this.mistakes++;
            this.combo = 0; // Reset combo on mistake
            this.timeLeft = Math.max(5, this.timeLeft - 5); // Lose 5 seconds per mistake
            
            if (this.mistakes >= this.maxMistakes) {
                this.showMessage(`Too many mistakes! Game Over! 💀`, 'error');
                this.endGame();
                return;
            }
            
            this.showMessage(`Wrong ingredient! Need ${this.ingredients[currentIngredient].name} (-5s) ❌`, 'error');
            this.updateDisplay();
            return;
        }
        
        const ingredient = this.ingredients[ingredientType];
        const panContent = document.getElementById('panContent');
        
        // Add ingredient to pan
        const ingredientElement = document.createElement('div');
        ingredientElement.className = 'ingredient-dropped';
        ingredientElement.textContent = ingredient.icon;
        ingredientElement.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            animation: ingredientDrop 0.5s ease-out;
        `;
        
        panContent.appendChild(ingredientElement);
        this.panIngredients.push(ingredientType);
        
        // Start cooking timer
        const pan = document.getElementById('pan');
        pan.classList.add('cooking');
        
        // Faster cooking times based on level
        const cookTimeMultiplier = Math.max(0.5, 1 - (this.level * 0.05)); // Gets faster each level
        const cookTime = Math.max(500, ingredient.cookTime * 1000 * cookTimeMultiplier);
        
        const cookingTimer = setTimeout(() => {
            this.finishCookingIngredient(ingredientType);
        }, cookTime);
        
        this.cookingTimers.set(ingredientType, cookingTimer);
        
        this.showMessage(`Cooking ${ingredient.name}... ⏰`, 'info');
        
        // Update recipe
        this.currentRecipe[this.currentStep].cooking = true;
        this.updateRecipeDisplay();
    }
    
    finishCookingIngredient(ingredientType) {
        // Find the correct step for this ingredient
        const stepIndex = this.currentRecipe.findIndex(item => item.ingredient === ingredientType);
        if (stepIndex === -1) return;
        
        this.currentRecipe[stepIndex].cooked = true;
        this.currentRecipe[stepIndex].cooking = false;
        
        // Only advance step if this was the current step being cooked
        if (stepIndex === this.currentStep) {
            this.currentStep++;
        }
        
        const pan = document.getElementById('pan');
        pan.classList.remove('cooking');
        
        this.cookingTimers.delete(ingredientType);
        
        const ingredient = this.ingredients[ingredientType];
        this.showMessage(`${ingredient.name} cooked perfectly! ✅`, 'success');
        
        this.updateRecipeDisplay();
        
        if (this.currentStep >= this.currentRecipe.length) {
            this.showMessage('All ingredients cooked! Serve the dish! 🍽️', 'success');
        }
    }
    
    serveDish() {
        // Check if all ingredients are cooked
        const allCooked = this.currentRecipe.every(item => item.cooked);
        if (!allCooked) {
            this.showMessage('Cook all ingredients first!', 'error');
            return;
        }
        
        // Calculate score with combo system
        const recipePoints = this.recipes.find(r => 
            r.ingredients.every(ing => this.panIngredients.includes(ing))
        )?.points || 50;
        
        const timeBonus = Math.floor(this.timeLeft * 3); // More time bonus
        const comboMultiplier = 1 + (this.combo * 0.2); // 20% bonus per combo
        const streakBonus = Math.floor(this.streak * 10); // Streak bonus
        const perfectBonus = this.mistakes === 0 ? 100 : 0; // Perfect dish bonus
        
        const totalPoints = Math.floor((recipePoints + timeBonus + streakBonus + perfectBonus) * comboMultiplier);
        
        this.score += totalPoints;
        this.combo++;
        this.streak++;
        
        if (this.mistakes === 0) {
            this.perfectDishes++;
            this.showMessage(`Perfect dish! +${totalPoints} points! Combo x${this.combo}! 🎉`, 'success');
        } else {
            this.showMessage(`Dish served! +${totalPoints} points! Combo x${this.combo}! 🍽️`, 'success');
        }
        
        // Clear pan
        this.clearPan();
        
        // Level up check - harder progression
        const requiredScore = this.level * 500 + (this.level - 1) * 200; // Exponential growth
        if (this.score >= requiredScore) {
            this.level++;
            this.maxMistakes = Math.max(1, 4 - Math.floor(this.level / 3)); // Fewer mistakes allowed
            this.showMessage(`Level Up! Level ${this.level} 🚀`, 'success');
        }
        
        // Generate new recipe
        this.generateRecipe();
        this.updateDisplay();
    }
    
    clearPan() {
        const panContent = document.getElementById('panContent');
        panContent.innerHTML = '';
        this.panIngredients = [];
        
        // Clear any remaining cooking timers
        this.cookingTimers.forEach(timer => clearTimeout(timer));
        this.cookingTimers.clear();
        
        const pan = document.getElementById('pan');
        pan.classList.remove('cooking');
    }
    
    endGame() {
        this.gameState = 'finished';
        clearInterval(this.gameTimer);
        
        this.cookingTimers.forEach(timer => clearTimeout(timer));
        this.cookingTimers.clear();
        
        const finalScore = this.score;
        const message = `Game Over! Final Score: ${finalScore} 🏆`;
        this.showMessage(message, 'info');
        
        document.getElementById('startBtn').textContent = 'Play Again';
        document.getElementById('startBtn').onclick = () => this.resetGame();
        
        // Save high score
        this.saveHighScore(finalScore);
    }
    
    resetGame() {
        this.gameState = 'waiting';
        this.score = 0;
        this.level = 1;
        this.timeLeft = 60;
        this.currentStep = 0;
        this.panIngredients = [];
        
        clearInterval(this.gameTimer);
        this.cookingTimers.forEach(timer => clearTimeout(timer));
        this.cookingTimers.clear();
        
        this.clearPan();
        this.generateRecipe();
        this.updateDisplay();
        
        document.getElementById('startBtn').textContent = 'Start Cooking';
        document.getElementById('startBtn').onclick = () => this.startGame();
        
        this.showMessage('Game Reset! Ready to cook? 🍳', 'info');
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('timer').textContent = this.timeLeft;
        document.getElementById('mistakes').textContent = `${this.mistakes}/${this.maxMistakes}`;
        document.getElementById('combo').textContent = this.combo;
        
        // Update progress
        const progress = (this.currentStep / this.currentRecipe.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        if (this.currentStep < this.currentRecipe.length) {
            const nextIngredient = this.ingredients[this.currentRecipe[this.currentStep].ingredient];
            document.getElementById('progressText').textContent = `Next: ${nextIngredient.icon} ${nextIngredient.name}`;
        } else {
            document.getElementById('progressText').textContent = 'Ready to serve! Click the pan!';
        }
    }
    
    showMessage(text, type = 'info') {
        const messagesContainer = document.getElementById('gameMessages');
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        messagesContainer.appendChild(message);
        
        // Show message
        setTimeout(() => {
            message.classList.add('show');
        }, 100);
        
        // Hide message
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }
    
    saveHighScore(score) {
        const highScore = localStorage.getItem('cookingMasterHighScore') || 0;
        if (score > highScore) {
            localStorage.setItem('cookingMasterHighScore', score);
            this.showMessage(`New High Score: ${score}! 🏆`, 'success');
        }
    }
    
    showInstructions() {
        document.getElementById('instructionsModal').classList.add('show');
    }
    
    hideInstructions() {
        document.getElementById('instructionsModal').classList.remove('show');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.cookingGame = new CookingMaster();
    
    // Show high score
    const highScore = localStorage.getItem('cookingMasterHighScore') || 0;
    if (highScore > 0) {
        setTimeout(() => {
            window.cookingGame.showMessage(`High Score: ${highScore}`, 'info');
        }, 2000);
    }
    
    console.log('🍳 Cooking Master loaded successfully!');
    console.log('💡 Use number keys 1-6 to quickly add ingredients!');
    console.log('💡 Press SPACE to serve the dish!');
});
