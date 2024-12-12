// ... existing code ...

                // Function to close edit modal
                const closeEditModal = () => {
                    const editModal = document.getElementById('edit-modal');
                    if (editModal) {
                        editModal.classList.remove('active');
                    }
                    const editForm = document.getElementById('edit-form');
                    if (editForm) {
                        editForm.reset();
                    }
                };

                // Add edit form submission handler
                const editForm = document.getElementById('edit-form');
                if (editForm) {
                    editForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = {
                            item_name: formData.get('item_name'),
                            stock: parseInt(formData.get('stock')),
                            price: parseInt(formData.get('price'))
                        };

                        try {
                            const token = localStorage.getItem('token');
                            const userId = localStorage.getItem('userId');
                            
                            if (!token || !userId) {
                                throw new Error('Authentication required');
                            }

                            const response = await fetch(`/api/inventory/${encodeURIComponent(data.item_name)}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                    'user-id': userId
                                },
                                body: JSON.stringify({
                                    stock_quantity: data.stock,
                                    price: data.price
                                })
                            });

                            if (!response.ok) {
                                if (response.status === 401 || response.status === 403) {
                                    throw new Error('Authentication required');
                                }
                                throw new Error('Failed to update product');
                            }

                            alert('Product updated successfully');
                            closeEditModal();
                            loadInventory();
                        } catch (error) {
                            console.error('Error updating product:', error);
                            if (error.message === 'Authentication required') {
                                alert('Please login again');
                                window.location.href = '/login';
                                return;
                            }
                            alert('Error updating product: ' + error.message);
                        }
                    });
                }

                // ... rest of existing code ...