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
        
        this.ingredients = {
            carrot: { name: 'Carrot', icon: '🥕', cookTime: 5 },
            potato: { name: 'Potato', icon: '🥔', cookTime: 8 },
            onion: { name: 'Onion', icon: '🧅', cookTime: 3 },
            tomato: { name: 'Tomato', icon: '🍅', cookTime: 4 },
            mushroom: { name: 'Mushroom', icon: '🍄', cookTime: 6 },
            pepper: { name: 'Pepper', icon: '🫑', cookTime: 4 }
        };
        
        this.recipes = [
            {
                name: 'Vegetable Stir Fry',
                ingredients: ['carrot', 'onion', 'pepper'],
                points: 100
            },
            {
                name: 'Garden Salad',
                ingredients: ['tomato', 'onion', 'carrot'],
                points: 80
            },
            {
                name: 'Mushroom Medley',
                ingredients: ['mushroom', 'onion', 'pepper'],
                points: 120
            },
            {
                name: 'Root Vegetables',
                ingredients: ['potato', 'carrot', 'onion'],
                points: 150
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
                    case ' ': 
                        e.preventDefault();
                        this.serveDish();
                        break;
                }
            }
        });
    }
    
    generateRecipe() {
        const recipe = this.recipes[Math.floor(Math.random() * this.recipes.length)];
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
            this.timeLeft = 60;
            this.startTimer();
            this.showMessage('Game Started! Cook the ingredients in order! 👨‍🍳', 'info');
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
            this.showMessage(`Wrong ingredient! Need ${this.ingredients[currentIngredient].name}`, 'error');
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
        
        const cookTime = ingredient.cookTime * 1000;
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
        this.currentRecipe[this.currentStep].cooked = true;
        this.currentStep++;
        
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
        if (this.currentStep < this.currentRecipe.length) {
            this.showMessage('Cook all ingredients first!', 'error');
            return;
        }
        
        // Calculate score
        const recipePoints = this.recipes.find(r => 
            r.ingredients.every(ing => this.panIngredients.includes(ing))
        )?.points || 50;
        
        const timeBonus = Math.floor(this.timeLeft * 2);
        const totalPoints = recipePoints + timeBonus;
        
        this.score += totalPoints;
        
        this.showMessage(`Dish served! +${totalPoints} points! 🎉`, 'success');
        
        // Clear pan
        this.clearPan();
        
        // Level up check
        if (this.score >= this.level * 500) {
            this.level++;
            this.timeLeft += 30; // Bonus time
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
