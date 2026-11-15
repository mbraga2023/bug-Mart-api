const products = require("../data/products");

function getProducts(page = 1, limit = 10, filters = {}) {
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
        throw new Error("Page must be a positive integer");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new Error("Limit must be an integer between 1 and 100");
    }

    const minPrice = filters.minPrice === undefined ? undefined : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === undefined ? undefined : Number(filters.maxPrice);
    const categoryId = filters.categoryId === undefined ? undefined : Number(filters.categoryId);

    if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
        throw new Error("minPrice must be a non-negative number");
    }

    if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
        throw new Error("maxPrice must be a non-negative number");
    }

    if (categoryId !== undefined && !Number.isInteger(categoryId)) {
        throw new Error("categoryId must be an integer");
    }

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        throw new Error("minPrice cannot be greater than maxPrice");
    }

    const query = typeof filters.q === "string" ? filters.q.trim().toLowerCase() : "";
    const sort = filters.sort;
    const sorters = {
        price_asc: (a, b) => a.price - b.price,
        price_desc: (a, b) => b.price - a.price,
        name_asc: (a, b) => a.name.localeCompare(b.name),
        name_desc: (a, b) => b.name.localeCompare(a.name),
        rating_desc: (a, b) => b.rating - a.rating
    };

    if (sort && !Object.prototype.hasOwnProperty.call(sorters, sort)) {
        throw new Error("sort must be one of: price_asc, price_desc, name_asc, name_desc, rating_desc");
    }

    let filteredProducts = products.filter(product => {
        const searchableText = [product.name, product.description, product.brand, product.sku]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return (!query || searchableText.includes(query))
            && (categoryId === undefined || product.categoryId === categoryId)
            && (minPrice === undefined || product.price >= minPrice)
            && (maxPrice === undefined || product.price <= maxPrice);
    });

    if (sort) {
        filteredProducts = filteredProducts.slice().sort(sorters[sort]);
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    const data = filteredProducts.slice(start, end);

    return {
        data,
        pagination: {
            page,
            limit,
            totalItems: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit),
            hasNext: end < filteredProducts.length,
            hasPrevious: page > 1
        }
    };
}

function getProductById(id) {
    return products.find(p => p.id === Number(id));
}

module.exports = {
    getProducts,
    getProductById
};