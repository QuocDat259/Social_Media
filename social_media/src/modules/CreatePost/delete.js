import React from "react";

const DeletePost = ({ postId, onDelete }) => {
    const handleDelete = async () => {
        // Hiển thị hộp thoại xác nhận trước khi xóa bài viết
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('user:token')}`
                    }
                });

                if (response.ok) {
                    onDelete(); // Gọi hàm callback để cập nhật UI sau khi xóa bài viết thành công
                } else {
                    console.log('Error deleting post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <button onClick={handleDelete}>Delete Post</button>
    );
}

export default DeletePost;
