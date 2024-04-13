import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const EditPost = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [postData, setPostData] = useState({
        caption: '',
        description: ''
    });

    useEffect(() => {
        // Gọi API để lấy dữ liệu của post dựa vào id
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/posts/${id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('user:token')}`
                    }
                });
                if (response.ok) {
                    const postData = await response.json();
                    setPostData(postData);
                } else {
                    console.log('Error fetching post data');
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...postData, [name]: value };
        setPostData(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Cập nhật dữ liệu trong MongoDB
            const updateResponse = await fetch(`http://localhost:8000/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('user:token')}`
                },
                body: JSON.stringify({ 
                    caption: postData.caption,
                    description: postData.description
                })
            });

            if (updateResponse.ok) {
                window.location.href = '/profile';
            } else {
                console.log('Error editing post');
            }
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Caption:</label>
                    <input type="text" name="caption" value={postData.caption} onChange={handleInputChange} className="border rounded-md p-2 w-full" />
                </div>
                <div>
                    <label className="block mb-2">Description:</label>
                    <textarea
                        name="description"
                        value={postData.description}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full h-32"
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update</button>
            </form>
        </div>
    )
}

export default EditPost;
