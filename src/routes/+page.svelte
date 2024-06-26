<script>
    import { onMount } from 'svelte';

    let modalVisible = false;
    let modalType = '';
    let username = '';
    let password = '';
    let user_id = null;
    let modalData = {};
    let cart = [];
    let cardNumber = '';
    let expiryDate = '';
    let cvv = '';

    async function handlePurchase(event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id,
                    cart,
                    cardNumber,
                    expiryDate,
                    cvv
                })
            });

            if (response.ok) {
                console.log('Purchase successful');
                // Optionally, clear the cart and card details after successful purchase
                cart = [];
                cardNumber = '';
                expiryDate = '';
                cvv = '';
                closeModal();
            } else {
                console.error('Purchase Error:', await response.json());
            }
        } catch (error) {
            console.error('Purchase Error:', error);
        }
    }

    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[dayOfWeek];

    let dishes = [];
    let foodImage = '';
    const foodItems = {
        Tuesday: 'burger',
        Wednesday: 'pizza',
        Thursday: 'pasta',
        Friday: 'butter-chicken',
    };
    function openPurchaseModal() {
        if (user_id !== null) {
            openModal('purchase');
        } else {
            openModal('login');
        }
    }

    async function fetchDishes() {
        try {
            const response = await fetch('https://l5ivtwcx.api.sanity.io/v2021-10-21/data/query/production?query=*[_type%20==%20%22dish%22]');
            const data = await response.json();
            dishes = data.result;

            // Log the URLs for debugging
            dishes.forEach(dish => {
                const imageUrl = formatImageUrl(dish.dishImage.asset._ref);
                console.log(`Image URL for ${dish.dish}:`, imageUrl);
            });
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    }

    function formatImageUrl(ref) {
        const parts = ref.replace('image-', '').split('-');
        const id = parts[0];
        const dimensions = parts[1];
        const format = parts[2];
        return `https://cdn.sanity.io/images/l5ivtwcx/production/${id}-${dimensions}.${format}`;
    }

    onMount(() => {
        fetchDishes();
        const foodOfTheDay = foodItems[currentDay];
        foodImage = `src/assets/${foodOfTheDay}.png`; // Assuming images are stored locally in the src/assets directory
        closeModal();
    });

    function openModal(type, data) {
        modalVisible = true;
        modalType = type;
        modalData = data;
    }

    function closeModal() {
        modalVisible = false;
        modalType = '';
        modalData = {};
    }


    function removeFromCart(index) {
        cart = cart.filter((_, i) => i !== index);
    }

    async function handlesignup(event) {
        event.preventDefault();
        console.log('Signup button clicked');
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful');
                openModal('login'); // Open the login modal after registration
            } else {
                console.error('Registration Error:', data.error);
            }
        } catch (error) {
            console.error('Registration Error:', error);
        }
    }

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Login successful');
                user_id = data.user_id; // Update user_id with the received value
                closeModal(); // Close the modal
            } else {
                console.error('Login Error:', data.error);
            }
        } catch (error) {
            console.error('Login Error:', error);
        }
    }

    function addToCart(dish) {
        if (user_id !== null) {
            cart = [...cart, dish];
            closeModal();
        } else {
            openModal('login');
        }
    }

    onMount(() => {
        closeModal();
    });
</script>

<!-- The rest of your HTML structure remains the same -->


<div class="container mx-auto py-8">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
        <!-- Home button -->
        <button class="text-gray-700 hover:text-gray-900 focus:outline-none">
            <img src="src/assets/file.png" alt="Home" class="w-12 h-12">
        </button>
        <!-- Search button -->
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center focus:outline-none">
            <img src="src/assets/file (1).png" alt="Search" class="w-12 h-12">
        </button>
        <!-- Profile picture -->
        <button class="" on:click={() => openModal('login')}>
            <img src="src/assets/file (3).png" alt="Profile" class="w-12 h-12 rounded-full">
        </button>
        <!-- Shopping cart -->
        <button class="text-gray-700 hover:text-gray-900 focus:outline-none" on:click={() => openModal('cart')}>
            <img src="src/assets/file (2).png" alt="Shopping Cart" class="w-12 h-12">
            <h1>{cart.length}</h1>

        </button>

        <!-- Menu -->
        <button class="text-gray-700 hover:text-gray-900 focus:outline-none">
            <a href="src/assets/menu.png" download>
                <img src="src/assets/menu.png" alt="Menu" class="w-12 h-12">
            </a>
        </button>
    </header>
    <hr class="border-gray-300 my-4">

    <!-- Modal -->
    {#if modalVisible && modalType === 'login'}
        <!-- Login Modal -->
        <div class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div class="absolute inset-0 bg-gray-500opacity-75"></div>
            <div
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <!-- Content -->
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Login</h3>
                </div>
                <div class="border-t border-gray-200">
                    <form class="px-4 py-5 sm:p-6" on:submit={handleLogin}>
                        <!-- Username -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                Username
                            </label>
                            <input type="text" id="username" placeholder="Username" bind:value={username} required
                                   class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <!-- Password -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                Password
                            </label>
                            <input type="password" id="password" placeholder="Password" bind:value={password} required
                                   class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <!-- Submit Button -->
                        <div class="flex items-center justify-between mb-4">
                            <button type="submit"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Sign In
                            </button>
                            <!-- Button to toggle signup modal -->
                            <button type="button" class="text-gray-700 hover:text-gray-900 focus:outline-none"
                                    on:click={() => openModal('signup')}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <!-- Close button -->
                    <div class="px-4 py-3 sm:px-6 flex justify-end">
                        <button type="button" class="text-blue-500 hover:text-blue-700 focus:outline-none"
                                on:click={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Display user ID -->
    {#if user_id !== null}
        <div class="bg-gray-200 p-4 mt-4 rounded">
            <p class="text-xl font-semibold">User ID: {user_id}</p>
        </div>
    {/if}

    <!-- Signup Modal -->
    {#if modalVisible && modalType === 'signup'}
        <div class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <!-- Modal content -->
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Sign Up</h3>
                </div>
                <div class="border-t border-gray-200">
                    <form class="px-4 py-5 sm:p-6" on:submit={handlesignup}>

                        <!-- Username -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-username">
                                Username
                            </label>
                            <input type="text" id="signup-username" placeholder="Username" bind:value={username}
                                   required
                                   class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <!-- Password -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-password">
                                Password
                            </label>
                            <input type="password" id="signup-password" placeholder="Password" bind:value={password}
                                   required
                                   class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <!-- Submit Button -->
                        <div class="flex items-center justify-between mb-4">
                            <button type="submit"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <!-- Close button -->
                    <div class="px-4 py-3 sm:px-6 flex justify-end">
                        <button type="button" class="text-blue-500 hover:text-blue-700 focus:outline-none" on:click={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Dishes Section -->

    <div class="container mx-auto py-8">
        <h1 class="text-3xl font-semibold mb-4">Dishes</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each dishes as dish}
                <!-- Dish Modal -->
                <div class="border border-gray-300 rounded-lg overflow-hidden cursor-pointer"
                     on:click={() => openModal('dish', dish)}>
                    <img src={formatImageUrl(dish.dishImage.asset._ref)} alt={dish.dish}
                         class="w-full h-64 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-semibold mb-2">{dish.dish}</h2>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                on:click={() => addToCart(dish)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Dish Description Modal -->
    {#if modalVisible && modalType === 'dish'}
        <div class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <!-- Content -->
                <div class="flex p-6">
                    <img src={formatImageUrl(modalData.dishImage.asset._ref)} alt={modalData.dish}
                         class="w-1/2 rounded-lg mr-4">
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900">{modalData.dish}</h3>
                        <p class="text-gray-600 mb-4">{modalData.description}</p>
                        <p class="text-xl font-semibold">{modalData.price}</p>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                on:click={() => addToCart(modalData)}>
                            Add to Cart
                        </button>
                    </div>
                </div>
                <!-- Close button -->
                <div class="px-4 py-3 sm:px-6 flex justify-end">
                    <button type="button" class="text-blue-500 hover:text-blue-700 focus:outline-none"
                            on:click={closeModal}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <!-- Cart Modal -->
    {#if modalVisible && modalType === 'cart'}
        <div class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div
              class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <!-- Content -->
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Shopping Cart</h3>
                </div>
                <div class="border-t border-gray-200">
                    <div class="px-4 py-5 sm:p-6">
                        {#each cart as item, index}
                            <div class="flex justify-between items-center mb-4">
                                <img src={formatImageUrl(item.dishImage.asset._ref)} alt={item.dish}
                                     class="w-16 h-16 object-cover rounded-lg mr-4">
                                <div>
                                    <p class="text-gray-900 text-lg font-semibold">{item.dish}</p>
                                    <p class="text-gray-600">{item.description}</p>
                                    <p class="text-gray-800 font-semibold">{item.price}</p>
                                </div>
                                <button class="text-red-500 hover:text-red-700 focus:outline-none"
                                        on:click={() => removeFromCart(index)}>
                                    Remove
                                </button>
                            </div>
                        {/each}
                        <!-- Payment form -->
                        <form on:submit={handlePurchase}>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="cardNumber">
                                    Card Number
                                </label>
                                <input type="text" id="cardNumber" placeholder="Card Number"
                                       bind:value={cardNumber} required
                                       class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="expiryDate">
                                        Expiry Date
                                    </label>
                                    <input type="text" id="expiryDate" placeholder="MM/YY" bind:value={expiryDate}
                                           required
                                           class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2" for="cvv">
                                        CVV
                                    </label>
                                    <input type="text" id="cvv" placeholder="CVV" bind:value={cvv} required
                                           class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                            </div>
                            <button type="submit"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Purchase
                            </button>
                        </form>
                    </div>
                    <!-- Close button -->
                    <div class="px-4 py-3 sm:px-6 flex justify-end">
                        <button type="button" class="text-blue-500 hover:text-blue-700 focus:outline-none"
                                on:click={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


