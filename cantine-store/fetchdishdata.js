import client from "./sanity.cli";

export async function fetchDishData() {
    const query = '*[_type == "dish"]'; // Define your Sanity query here
    const data = await client.fetch(query);
    return data;
}

export { fetchDishData };
