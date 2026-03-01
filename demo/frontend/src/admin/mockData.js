export const inquiriesData = [
    { id: 'INQ-1001', date: '2026-02-12', customer: 'John Doe', country: 'USA', products: ['Coir Fiber'], status: 'New', priority: 'High', responseTime: 2.1 },
    { id: 'INQ-1002', date: '2026-02-12', customer: 'Green Farms Ltd', country: 'Germany', products: ['Grow Bags', 'Cocopeat Blocks'], status: 'In Progress', priority: 'Medium', responseTime: 5.5 },
    { id: 'INQ-1003', date: '2026-02-11', customer: 'Eco Solutions', country: 'Australia', products: ['Geotextiles'], status: 'New', priority: 'Low', responseTime: null },
    { id: 'INQ-1004', date: '2026-02-11', customer: 'Sarah Smith', country: 'UK', products: ['Coir Rope'], status: 'Closed', priority: 'Low', responseTime: 1.2 },
    { id: 'INQ-1005', date: '2026-02-10', customer: 'Agro Import Co.', country: 'China', products: ['Coir Fiber', 'Cocopeat'], status: 'Follow Up', priority: 'High', responseTime: 8.0 },
    { id: 'INQ-1006', date: '2026-02-10', customer: 'Garden Master', country: 'USA', products: ['Grow Bags'], status: 'Closed', priority: 'Medium', responseTime: 3.4 },
    { id: 'INQ-1007', date: '2026-02-09', customer: 'Nature Best', country: 'France', products: ['Coir Mats'], status: 'New', priority: 'High', responseTime: null },
    { id: 'INQ-1008', date: '2026-02-08', customer: 'Desert Bloom', country: 'UAE', products: ['Cocopeat Blocks'], status: 'In Progress', priority: 'Medium', responseTime: 12.1 },
];

export const productsData = [
    { id: 1, name: 'Coir Fiber', category: 'Fiber', price: 0.55, stock: 5000, status: 'Active' },
    { id: 2, name: 'Cocopeat Blocks', category: 'Peat', price: 1.85, stock: 1200, status: 'Active' },
    { id: 3, name: 'Grow Bags', category: 'Grow Bags', price: 3.25, stock: 800, status: 'Low Stock' },
    { id: 4, name: 'Coir Mats', category: 'Mats', price: 6.75, stock: 300, status: 'Active' },
    { id: 5, name: 'Geotextiles', category: 'Textiles', price: 1.00, stock: 10000, status: 'Active' },
    { id: 6, name: 'Coir Rope', category: 'Rope', price: 1.45, stock: 1500, status: 'Out of Stock' },
];

export const usersData = [
    { id: 1, name: 'Admin User', email: 'admin@smlagro.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sales Manager', email: 'sales@smlagro.com', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Support Rep', email: 'support@smlagro.com', role: 'Viewer', status: 'Inactive' },
];
