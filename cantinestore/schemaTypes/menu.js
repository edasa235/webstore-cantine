export default {
    name: 'dish',
    type: "document",
    fields: [
        {
            name: 'dish',
            type: 'string',
            title: 'Dish',
        },
        {
            type: 'image',
            title: 'dish image',
            name: "dishImage"

        },
        {
            type: 'text',
            title: 'description',
            name: 'description',
        },
        {
            type: 'text',
            title: 'price',
            name: 'price',
        }

    ]
}