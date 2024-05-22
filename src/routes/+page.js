import sanityClient from "@sanity/client";

const client = sanityClient({
    projectId: "7mofbc3b",
    dataset: "production",
    apiVersion: "2023-01-30",
    useCdn: false
});

export async function load({ params }) {
    const data = await client.fetch(`*[_type == "dish"]`);

    if (data) {
        return {
            about: data
        };
    }
    return {
        status: 500,
        body: new Error("Internal Server Error")
    };
}