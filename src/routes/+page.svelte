<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let modalVisible = false;
    let modalType = '';
    let username = '';
    let password = '';
    let user_id = null; // Initialize user_id variable

    function openModal(type) {
        modalVisible = true;
        modalType = type;
        console.log('Opened modal:', type);
    }

    function closeModal() {
        modalVisible = false;
        modalType = '';
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
</div>

<style>
    /* Additional styling can be added here */
</style>