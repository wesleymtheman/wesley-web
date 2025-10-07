// Shop Master Game
// WesleyDude.com

class ShopMaster {
    constructor() {
        this.gameState = 'waiting'; // waiting, playing, paused, finished
        this.money = 1000; // Start with $1000
        this.day = 1;
        this.reputation = 50;
        this.gameSpeed = 2000; // milliseconds between customer arrivals
        this.customerTimer = null;
        this.dayTimer = null;
        this.timeOfDay = 'morning'; // morning, afternoon, evening, night
        this.timeProgress = 0; // 0-100, progresses throughout the day
        this.currentCustomers = [];
        this.servingCustomers = [];
        this.inventory = {
            laptop: 1,
            phone: 1,
            tablet: 1,
            headphones: 1,
            shirt: 1,
            pants: 1,
            jacket: 1,
            shoes: 1,
            apple: 1,
            bread: 1,
            milk: 1,
            eggs: 1
        }; // Start with 1 of each item
        this.upgrades = {
            counter: false,
            storage: false,
            advertising: false,
            security: false
        };
        this.customerStats = {
            happy: 0,
            neutral: 0,
            angry: 0
        };
        this.robberyChance = 0.1; // 10% chance per night hour
        this.startDayHandler = () => this.startDay();
        this.endDayHandler = null;
        
        this.products = {
            laptop: { 
                name: 'Laptop', 
                icon: '💻', 
                cost: 800, 
                sellPrice: 1200, 
                category: 'electronics',
                demandWeight: 5, // Low demand - expensive item
                timePreferences: { morning: 0.3, afternoon: 0.4, evening: 0.2, night: 0.1 }
            },
            phone: { 
                name: 'Phone', 
                icon: '📱', 
                cost: 600, 
                sellPrice: 900, 
                category: 'electronics',
                demandWeight: 8, // Medium demand
                timePreferences: { morning: 0.2, afternoon: 0.5, evening: 0.2, night: 0.1 }
            },
            tablet: { 
                name: 'Tablet', 
                icon: '📱', 
                cost: 400, 
                sellPrice: 600, 
                category: 'electronics',
                demandWeight: 10, // Medium demand
                timePreferences: { morning: 0.3, afternoon: 0.4, evening: 0.2, night: 0.1 }
            },
            headphones: { 
                name: 'Headphones', 
                icon: '🎧', 
                cost: 150, 
                sellPrice: 220, 
                category: 'electronics',
                demandWeight: 12, // Medium-high demand
                timePreferences: { morning: 0.2, afternoon: 0.4, evening: 0.3, night: 0.1 }
            },
            shirt: { 
                name: 'Shirt', 
                icon: '👕', 
                cost: 25, 
                sellPrice: 40, 
                category: 'clothing',
                demandWeight: 15, // High demand - affordable
                timePreferences: { morning: 0.3, afternoon: 0.4, evening: 0.2, night: 0.1 }
            },
            pants: { 
                name: 'Pants', 
                icon: '👖', 
                cost: 40, 
                sellPrice: 65, 
                category: 'clothing',
                demandWeight: 12, // Medium-high demand
                timePreferences: { morning: 0.2, afternoon: 0.5, evening: 0.2, night: 0.1 }
            },
            jacket: { 
                name: 'Jacket', 
                icon: '🧥', 
                cost: 80, 
                sellPrice: 120, 
                category: 'clothing',
                demandWeight: 8, // Medium demand
                timePreferences: { morning: 0.4, afternoon: 0.3, evening: 0.2, night: 0.1 }
            },
            shoes: { 
                name: 'Shoes', 
                icon: '👟', 
                cost: 60, 
                sellPrice: 90, 
                category: 'clothing',
                demandWeight: 10, // Medium demand
                timePreferences: { morning: 0.3, afternoon: 0.4, evening: 0.2, night: 0.1 }
            },
            apple: { 
                name: 'Apple', 
                icon: '🍎', 
                cost: 2, 
                sellPrice: 3, 
                category: 'food',
                demandWeight: 25, // Very high demand - cheap and essential
                timePreferences: { morning: 0.4, afternoon: 0.3, evening: 0.2, night: 0.1 }
            },
            bread: { 
                name: 'Bread', 
                icon: '🍞', 
                cost: 3, 
                sellPrice: 5, 
                category: 'food',
                demandWeight: 20, // High demand - essential food
                timePreferences: { morning: 0.5, afternoon: 0.3, evening: 0.1, night: 0.1 }
            },
            milk: { 
                name: 'Milk', 
                icon: '🥛', 
                cost: 4, 
                sellPrice: 6, 
                category: 'food',
                demandWeight: 18, // High demand
                timePreferences: { morning: 0.6, afternoon: 0.2, evening: 0.1, night: 0.1 }
            },
            eggs: { 
                name: 'Eggs', 
                icon: '🥚', 
                cost: 5, 
                sellPrice: 8, 
                category: 'food',
                demandWeight: 15, // High demand
                timePreferences: { morning: 0.5, afternoon: 0.3, evening: 0.1, night: 0.1 }
            }
        };
        
        this.customerTypes = [
            { icon: '👨', patience: 8, money: 1500, name: 'Businessman' },
            { icon: '👩', patience: 6, money: 1200, name: 'Professional' },
            { icon: '🧑', patience: 7, money: 1000, name: 'Student' },
            { icon: '👴', patience: 10, money: 800, name: 'Senior' },
            { icon: '👵', patience: 9, money: 700, name: 'Elderly' }
        ];
        
        this.timeOfDayNames = {
            morning: '🌅 Morning',
            afternoon: '☀️ Afternoon', 
            evening: '🌆 Evening',
            night: '🌙 Night'
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.updateInventoryDisplay();
        this.showMessage('Welcome to Shop Master! 🏪', 'info');
    }
    
    bindEvents() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', this.startDayHandler);
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.pauseGame();
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
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Buy products
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = e.target.dataset.product;
                this.buyProduct(product);
            });
        });
        
        // Buy upgrades
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const upgrade = e.target.dataset.upgrade;
                this.buyUpgrade(upgrade);
            });
        });
        
        // Customer clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('customer')) {
                this.serveCustomer(e.target);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                switch(e.key) {
                    case ' ': 
                        e.preventDefault();
                        this.serveNextCustomer();
                        break;
                    case '1': this.switchTab('inventory'); break;
                    case '2': this.switchTab('customers'); break;
                    case '3': this.switchTab('upgrades'); break;
                }
            }
        });
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }
    
    startDay() {
        if (this.gameState === 'waiting') {
            this.gameState = 'playing';
            this.timeOfDay = 'morning';
            this.timeProgress = 0;
            this.startCustomerArrivals();
            this.startDayTimer();
            this.startTimeProgression();
            this.showMessage('Day started! Customers are coming! 👥', 'info');
            
            const startBtn = document.getElementById('startBtn');
            startBtn.textContent = 'End Day';
            startBtn.removeEventListener('click', this.startDayHandler);
            this.endDayHandler = () => this.endDay();
            startBtn.addEventListener('click', this.endDayHandler);
        }
    }
    
    endDay() {
        if (this.gameState === 'playing') {
            this.gameState = 'waiting';
            clearInterval(this.customerTimer);
            clearInterval(this.dayTimer);
            clearInterval(this.timeProgressionTimer);
            
            // Clear remaining customers
            this.currentCustomers.forEach(customer => {
                if (customer.element && customer.element.parentNode) {
                    customer.element.parentNode.removeChild(customer.element);
                }
            });
            this.currentCustomers = [];
            this.servingCustomers = [];
            
            // Calculate day results
            const dayProfit = this.calculateDayProfit();
            this.money += dayProfit;
            
            this.day++;
            this.updateDisplay();
            
            this.showMessage(`Day ${this.day - 1} complete! Profit: $${dayProfit} 💰`, 'success');
            
            const startBtn = document.getElementById('startBtn');
            startBtn.textContent = 'Start Day';
            startBtn.removeEventListener('click', this.endDayHandler);
            this.startDayHandler = () => this.startDay();
            startBtn.addEventListener('click', this.startDayHandler);
        }
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            clearInterval(this.customerTimer);
            clearInterval(this.dayTimer);
            this.showMessage('Game Paused', 'info');
            document.getElementById('pauseBtn').textContent = 'Resume';
            document.getElementById('pauseBtn').onclick = () => this.resumeGame();
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startCustomerArrivals();
            this.startDayTimer();
            this.showMessage('Game Resumed!', 'info');
            document.getElementById('pauseBtn').textContent = 'Pause';
            document.getElementById('pauseBtn').onclick = () => this.pauseGame();
        }
    }
    
    startCustomerArrivals() {
        const arrivalRate = this.upgrades.advertising ? 1500 : 2000;
        
        this.customerTimer = setInterval(() => {
            if (this.currentCustomers.length < 5) { // Max 5 customers in queue
                this.spawnCustomer();
            }
        }, arrivalRate);
    }
    
    startDayTimer() {
        this.dayTimer = setInterval(() => {
            // Reduce customer patience over time
            this.currentCustomers.forEach(customer => {
                customer.patience--;
                if (customer.patience <= 0) {
                    this.customerLeave(customer, 'angry');
                }
            });
        }, 1000);
    }
    
    spawnCustomer() {
        const customerType = this.customerTypes[Math.floor(Math.random() * this.customerTypes.length)];
        const customer = {
            id: Date.now(),
            type: customerType,
            patience: customerType.patience,
            money: customerType.money,
            wants: this.getRandomProduct()
        };
        
        const customerElement = document.createElement('div');
        customerElement.className = 'customer';
        customerElement.textContent = customer.type.icon;
        customerElement.dataset.customerId = customer.id;
        
        customer.element = customerElement;
        this.currentCustomers.push(customer);
        
        document.getElementById('customerQueue').appendChild(customerElement);
    }
    
    getRandomProduct() {
        // Create weighted list based on demand and time of day
        const weightedProducts = [];
        
        Object.keys(this.products).forEach(productName => {
            const product = this.products[productName];
            const timeMultiplier = product.timePreferences[this.timeOfDay] || 0.1;
            const weight = product.demandWeight * timeMultiplier;
            
            // Add to weighted list multiple times based on weight
            for (let i = 0; i < weight; i++) {
                weightedProducts.push(productName);
            }
        });
        
        if (weightedProducts.length === 0) return null;
        return weightedProducts[Math.floor(Math.random() * weightedProducts.length)];
    }
    
    startTimeProgression() {
        this.timeProgressionTimer = setInterval(() => {
            this.timeProgress += 1;
            
            // Update time of day based on progress
            if (this.timeProgress <= 25) {
                this.timeOfDay = 'morning';
            } else if (this.timeProgress <= 50) {
                this.timeOfDay = 'afternoon';
            } else if (this.timeProgress <= 75) {
                this.timeOfDay = 'evening';
            } else {
                this.timeOfDay = 'night';
                
                // Check for robbery during night
                if (Math.random() < this.robberyChance) {
                    this.handleRobbery();
                }
            }
            
            this.updateDisplay();
            
            // End day at 100%
            if (this.timeProgress >= 100) {
                this.endDay();
            }
        }, 2000); // Progress every 2 seconds
    }
    
    handleRobbery() {
        if (this.upgrades.security) {
            this.showMessage('Security system prevented robbery! 🛡️', 'success');
            return;
        }
        
        // Robber takes random items
        const availableItems = Object.keys(this.inventory).filter(item => 
            this.inventory[item] > 0
        );
        
        if (availableItems.length === 0) {
            this.showMessage('Robber found nothing to steal! 😅', 'info');
            return;
        }
        
        const stolenItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        this.inventory[stolenItem]--;
        
        this.showMessage(`Robber stole a ${this.products[stolenItem].name}! 😱`, 'error');
        this.updateInventoryDisplay();
    }
    
    serveCustomer(customerElement) {
        const customerId = parseInt(customerElement.dataset.customerId);
        const customer = this.currentCustomers.find(c => c.id === customerId);
        
        if (!customer || !customer.wants) {
            this.showMessage('Customer wants something we don\'t have! 😞', 'error');
            this.customerLeave(customer, 'angry');
            return;
        }
        
        // Check if we have the specific item the customer wants
        if (!this.inventory[customer.wants] || this.inventory[customer.wants] <= 0) {
            this.showMessage(`Out of ${this.products[customer.wants].name}! Customer is disappointed 😞`, 'error');
            this.customerLeave(customer, 'angry');
            return;
        }
        
        // Check if customer has enough money
        const product = this.products[customer.wants];
        if (customer.money < product.sellPrice) {
            this.showMessage('Customer can\'t afford it! 💸', 'error');
            this.customerLeave(customer, 'angry');
            return;
        }
        
        // Serve the customer
        this.serveNextCustomer();
    }
    
    serveNextCustomer() {
        if (this.currentCustomers.length === 0) return;
        
        const customer = this.currentCustomers[0];
        if (!customer.wants || !this.inventory[customer.wants] || this.inventory[customer.wants] <= 0) {
            this.customerLeave(customer, 'angry');
            return;
        }
        
        // Sell the specific product the customer wants
        const product = this.products[customer.wants];
        const profit = product.sellPrice - product.cost;
        
        this.money += product.sellPrice;
        this.inventory[customer.wants]--;
        
        // Remove customer
        this.customerLeave(customer, 'happy');
        
        // Show profit
        this.showMoneyEarned(product.sellPrice);
        
        this.updateDisplay();
        this.updateInventoryDisplay();
    }
    
    customerLeave(customer, mood) {
        if (customer.element && customer.element.parentNode) {
            customer.element.parentNode.removeChild(customer.element);
        }
        
        this.currentCustomers = this.currentCustomers.filter(c => c.id !== customer.id);
        this.customerStats[mood]++;
        
        // Update reputation based on customer satisfaction
        if (mood === 'happy') {
            this.reputation += 2;
        } else if (mood === 'angry') {
            this.reputation -= 3;
        }
        
        this.reputation = Math.max(0, Math.min(100, this.reputation));
        this.updateCustomerStats();
    }
    
    buyProduct(productName) {
        const product = this.products[productName];
        
        if (this.money < product.cost) {
            this.showMessage('Not enough money! 💸', 'error');
            return;
        }
        
        this.money -= product.cost;
        this.inventory[productName] = (this.inventory[productName] || 0) + 1;
        
        this.updateDisplay();
        this.updateInventoryDisplay();
        this.showMessage(`Bought ${product.name} for $${product.cost}`, 'success');
    }
    
    buyUpgrade(upgradeName) {
        const upgradePrices = {
            counter: 500,
            storage: 300,
            advertising: 200,
            security: 400
        };
        
        const price = upgradePrices[upgradeName];
        
        if (this.money < price) {
            this.showMessage('Not enough money for upgrade! 💸', 'error');
            return;
        }
        
        if (this.upgrades[upgradeName]) {
            this.showMessage('Already purchased! ✅', 'info');
            return;
        }
        
        this.money -= price;
        this.upgrades[upgradeName] = true;
        
        // Apply upgrade effects
        if (upgradeName === 'counter') {
            this.showMessage('Extra counter unlocked! Serve 2 customers at once! 🏪', 'success');
        } else if (upgradeName === 'storage') {
            this.showMessage('Storage expanded! Hold more inventory! 📦', 'success');
        } else if (upgradeName === 'advertising') {
            this.showMessage('Advertising active! More customers coming! 📢', 'success');
        } else if (upgradeName === 'security') {
            this.showMessage('Security system installed! Robbers beware! 🛡️', 'success');
        }
        
        this.updateDisplay();
        this.updateUpgradeButtons();
    }
    
    calculateDayProfit() {
        let profit = 0;
        Object.keys(this.inventory).forEach(product => {
            const sold = this.getInitialInventory(product) - (this.inventory[product] || 0);
            const productProfit = (this.products[product].sellPrice - this.products[product].cost) * sold;
            profit += productProfit;
        });
        return profit;
    }
    
    getInitialInventory(product) {
        // This would track initial inventory for the day
        return this.inventory[product] || 0;
    }
    
    updateDisplay() {
        document.getElementById('money').textContent = `$${this.money}`;
        document.getElementById('day').textContent = this.day;
        document.getElementById('reputation').textContent = this.reputation;
        
        // Update time of day display
        const timeDisplay = document.getElementById('timeOfDay');
        if (timeDisplay) {
            timeDisplay.textContent = this.timeOfDayNames[this.timeOfDay];
        }
        
        // Update time progress bar
        const timeProgressBar = document.getElementById('timeProgress');
        if (timeProgressBar) {
            timeProgressBar.style.width = `${this.timeProgress}%`;
        }
    }
    
    updateInventoryDisplay() {
        Object.keys(this.products).forEach(productName => {
            const product = this.products[productName];
            const category = product.category;
            const container = document.getElementById(category);
            
            // Clear existing products
            container.innerHTML = '';
            
            // Add product slots
            const maxSlots = this.upgrades.storage ? 8 : 5;
            for (let i = 0; i < maxSlots; i++) {
                const slot = document.createElement('div');
                slot.className = 'product-slot';
                
                if (i < (this.inventory[productName] || 0)) {
                    slot.textContent = product.icon;
                    slot.title = `${product.name} (${this.inventory[productName]})`;
                } else {
                    slot.textContent = 'Empty';
                    slot.classList.add('empty');
                }
                
                container.appendChild(slot);
            }
        });
    }
    
    updateCustomerStats() {
        document.getElementById('happyCustomers').textContent = this.customerStats.happy;
        document.getElementById('neutralCustomers').textContent = this.customerStats.neutral;
        document.getElementById('angryCustomers').textContent = this.customerStats.angry;
    }
    
    updateUpgradeButtons() {
        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            const upgrade = btn.dataset.upgrade;
            if (this.upgrades[upgrade]) {
                btn.textContent = 'Owned';
                btn.disabled = true;
            }
        });
    }
    
    showMoneyEarned(amount) {
        const moneyElement = document.createElement('div');
        moneyElement.className = 'money-earned';
        moneyElement.textContent = `+$${amount}`;
        
        const customerQueue = document.getElementById('customerQueue');
        customerQueue.style.position = 'relative';
        customerQueue.appendChild(moneyElement);
        
        setTimeout(() => {
            if (moneyElement.parentNode) {
                moneyElement.parentNode.removeChild(moneyElement);
            }
        }, 1000);
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
    
    showInstructions() {
        document.getElementById('instructionsModal').classList.add('show');
    }
    
    hideInstructions() {
        document.getElementById('instructionsModal').classList.remove('show');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.shopGame = new ShopMaster();
    
    console.log('🏪 Shop Master loaded successfully!');
    console.log('💡 Use SPACE to serve customers quickly!');
    console.log('💡 Use number keys 1-3 to switch tabs!');
});
