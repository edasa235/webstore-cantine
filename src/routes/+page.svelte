<script>
    import { onMount } from 'svelte';


    let foodImage;
    let modalVisible = false;
    let modalType = '';
    let username = '';
    let password = '';
    let user_id = null;

    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[dayOfWeek];

    let dishes = [];

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


    onMount(fetchDishes);
    const foodItems = {
        Tuesday: 'burger',
        Wednesday: 'pizza',
        Thursday: 'pasta',
        Friday: 'butter-chicken',
    };

    async function fetchFoodImage(food) {
        try {
            const response = await fetch(`https://foodish-api.com/api/images/${food}`);
            const data = await response.json();
            foodImage = data.image;
            localStorage.setItem(currentDay, foodImage);
        } catch (error) {
            console.error('Error fetching food image:', error);
        }
    }

    onMount(async () => {
        const storedImage = localStorage.getItem(currentDay);
        if (storedImage) {
            foodImage = storedImage;
        } else {
            const foodOfTheDay = foodItems[currentDay];
            await fetchFoodImage(foodOfTheDay);
        }
    });

    function openModal(type) {
        modalVisible = true;
        modalType = type;
    }

    function closeModal() {
        modalVisible = false;
        modalType = '';
    }

    async function handlesignup(event) {
        event.preventDefault();
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
                openModal('login');
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
                user_id = data.user_id;
                closeModal();
            } else {
                console.error('Login Error:', data.error);
            }
        } catch (error) {
            console.error('Login Error:', error);
        }
    }

    onMount(() => {
        closeModal();
    });
</script>


<div class="container mx-auto py-8">
<!-- Header -->
<header class="flex justify-between items-center mb-8">
    <!-- Home button -->
    <button class="text-gray-700 hover:text-gray-900 focus:outline-none">
        <img src="src/assets/file.png" alt="Home" style="width: 100px; height: 100px;">
    </button>
    <!-- Search button -->
    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center focus:outline-none">
        <img src="src/assets/file (1).png" alt="Search" style="width: 100px; height: 100px;">
    </button>
    <!-- Profile picture -->
    <button class="" on:click={() => openModal('login')}>
        <img src="src/assets/file (3).png" class="w-10 h-10 rounded-full" style="width: 100px; height: 100px;">
    </button>
    <!-- Shopping cart -->
    <button class="text-gray-700 hover:text-gray-900 focus:outline-none">
        <img src="src/assets/file (2).png" alt="Shopping Cart" style="width: 100px; height: 100px;">
    </button>
    <!-- menu -->
    <button class="text-gray-700 hover:text-gray-900 focus:outline-none">
        <a href="src/assets/menu.png" download>
            <img src="src/assets/menu.png" alt="Shopping Cart" style="width: 100px; height: 100px;">
        </a>
    </button>
    <!-- About Me Button -->

</header>
    <!-- Modal --><!-- Login Modal -->

    <!-- Login Modal -->
    {#if modalVisible && modalType === 'login'}
        <div class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <!-- Content -->
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Login</h3>
                </div>
                <div class="border-t border-gray-200">
                    <form class="px-4 py-5 sm:p-6" on:submit={handleLogin}>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                Username
                            </label>
                            <input type="text" id="username" placeholder="Username" bind:value={username} required class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                Password
                            </label>
                            <input type="password" id="password" placeholder="Password" bind:value={password} required class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="flex items-center justify-between mb-4">
                            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Sign In
                            </button>
                            <!-- Button to toggle signup modal -->
                            <button class="text-gray-700 hover:text-gray-900 focus:outline-none" on:click={() => openModal('signup')}>
                                Sign Up
                            </button>
                        </div>
                    </form>
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

    {#if modalVisible && modalType === 'signup'}
        <div class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
            <!-- Modal content -->
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            <div class="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Sign Up</h3>
                </div>
                <div class="border-t border-gray-200">
                    <form class="px-4 py-5 sm:p-6" on:submit={handlesignup}>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-username">
                                Username
                            </label>
                            <input type="text" id="signup-username" placeholder="Username" bind:value={username} required class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="signup-password">
                                Password
                            </label>
                            <input type="password" id="signup-password" placeholder="Password" bind:value={password} required class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="flex items-center justify-between mb-4">
                            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    {/if}
    {#if foodImage}
        <div class="flex flex-col items-center mb-8">
            <h2 class="text-3xl font-semibold mb-4">Dish of the Day: {currentDay}</h2>
            <img src={foodImage} alt={currentDay} class="w-full max-w-md rounded-lg shadow-lg">
        </div>
    {/if}


    <div class="container mx-auto py-8">
        <h1 class="text-3xl font-semibold mb-4">Dishes</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each dishes as dish}
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src={formatImageUrl(dish.dishImage.asset._ref)} alt={dish.dish} class="w-full h-64 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-semibold mb-2">{dish.dish}</h2>
                    </div>
                </div>
            {/each}
        </div>
    </div>


    </div>

<style>
    /* Additional styling can be added here */
</style>
