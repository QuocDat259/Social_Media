import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import { useNavigate, Link } from 'react-router-dom'; // Import Link từ react-router-dom
import '../../modules/Profile.css';
import { navigations } from "../Home/data";


const Profile = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [postsCount, setPostsCount] = useState(0);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [clicked, setClicked] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showChose, setShowChose] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await fetch('http://localhost:8000/api/profile', {
                    method: 'GET',
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('user:token')}`
                    },
                });
                if (!postsResponse.ok) {
                    throw new Error('Failed to fetch user posts');
                }
                const postsData = await postsResponse.json();
                setPosts(postsData?.posts);
                setUser(postsData?.user);

                const statsResponse = await Promise.all([
                    fetch('http://localhost:8000/api/posts-stats', {
                        method: 'GET',
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('user:token')}`
                        },
                    }),
                    fetch('http://localhost:8000/api/followers-stats', {
                        method: 'GET',
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('user:token')}`
                        },
                    }),
                    fetch('http://localhost:8000/api/following-stats', {
                        method: 'GET',
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('user:token')}`
                        },
                    }),
                ]);

                const [postsStatsData, followersStatsData, followingStatsData] = await Promise.all(statsResponse.map(response => response.json()));

                setPostsCount(postsStatsData.postsCount);
                setFollowersCount(followersStatsData.followersCount);
                setFollowingCount(followingStatsData.followingCount);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error
            }
        };

        fetchData();
    }, []);

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleEditProfile = () => {
        navigate('/editprofile');
        setShowMenu(false); // Đóng menu sau khi click vào "Chỉnh sửa trang cá nhân"
    };
    const handleChangePassword = () => {
        navigate(`/editPassword/${user._id}`);
        setShowMenu(false); // Đóng menu sau khi click vào "Đổi mật khẩu"
    }
    const handleChoseToggle = () => {
        setShowChose(!showChose);
    }


    const handleEditPost = (postId) => {
        navigate(`/editpost/${postId}`);
        setShowChose(false);
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('user:token')}`
                },
            });
            if (!response.ok) {
                // Nếu xóa bài viết thành công, cập nhật lại danh sách bài viết trên profile
                setPosts(posts.filter(post => post._id !== postId));
                alert('Post deleted successfully');
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post. Please try again later.');
        }
    };

    const handleDeletePost = async (postId) => {
        deletePost(postId);
    };

    const openModal = (image) => {
        if (clicked) {
            setSelectedImage({ ...image, showMoreOptions: true });
        }
    };
      
    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleBackgroundClick = (e) => {
        // Kiểm tra xem người dùng có click vào phần nền xám hay không
        if (e.target.classList.contains('modal-background')) {
            closeModal();
        }
    };

    return (
        <div className='h-screen bg-[#d2cfdf] flex overflow-hidden'>
             <div className='w-[20%] bg-white flex flex-col'>
             <div className='h-[55%] flex flex-col justify-evenly pl-12 border-b'>
                    {
                        navigations.map(({ id, name, icon, url }) => {
                            return (
                                <Link to={url} key={id} className='hover:text-red-500 cursor-pointer flex gap-2'>
                                    {icon}
                                    <p>{name}</p>
                                </Link>
                            )
                        })
                    }
                </div>
                <div className='h-[15%] pt-10'>
                    <div className='hover:text-red-500 ml-12 cursor-pointer flex gap-2' onClick={() => {
                        localStorage.clear();
                        navigate('/account/signin')
                    }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg> Log Out</div>
                </div>
            </div>
                <div className='w-[80%] flex flex-col items-center p-10'>
                    <div className='flex flex-col justify-around items-center'>
                    <div className='w-[100%] flex flex-col items-center p-10 relative'>
                    <div className='flex relative'>
                        <img 
                            src={user?.image} 
                            alt="avt" 
                            style={{ width: '120px', height: '120px' }} 
                            className='border-4 rounded-full p-2'/>
                            <Button 
                                className="small-button" 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>} 
                                onClick={handleMenuToggle} 
                            />
                                {showMenu && (
                                    <div className="absolute top-10 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md">
                                        <button 
                                            className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-100"
                                            onClick={handleEditProfile}>
                                            Chỉnh sửa trang cá nhân
                                        </button>
                                        <button 
                                            className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-100"
                                            onClick={handleChangePassword}>
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                )}
                    </div>
                </div>
                    
                    <div className='my-4 text-center'>
                        <h3 className='font-medium'>{user?.username}</h3>
                        <p className='my-2'>{user?.email}</p>
                    </div>
                    <div className='flex justify-around w-[600px] text-center my-4 border'>
                        <div>
                            <h4 className="font-bold">{postsCount}</h4>
                            <p className="font-light text-sm">Posts</p>
                        </div>
                        <div>
                            <h4 className="font-bold">{followersCount}</h4>
                            <p className="font-light text-sm">Followers</p>
                        </div>
                        <div>
                            <h4 className="font-bold">{followingCount}</h4>
                            <p className="font-light text-sm">Following</p>
                        </div>
                    </div>
                </div>

                <div className='flex justify-center flex-wrap'>
                {posts?.length > 0 &&
                    posts?.map(({ _id, caption = '', description = '', image = '', likes = [] }) => {
                        return (
                            <div className='w-[400px] mt-6 mx-2 flex flex-col border p-2 rounded-lg post-container' key={_id} >
                                <div className='pb-4 mb-4'>
                                    <img
                                        src={image}
                                        alt="kakashi"
                                        className="modal-image rounded-2xl w-[100%] post-image"
                                        onClick={() => {
                                            setClicked(true);
                                            openModal({ image, caption, description });
                                        }}
                                    />
                                    
                                    <div className='flex mt-4 mb-2 pb-2 justify-center post-overlay' onClick={() => {setClicked(true); openModal({ image, caption, description });}}>
                                        <div className="like-comment-icons flex">
                                            <div className="flex items-center mr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                                </svg>
                                                <span className="text-white">{likes?.length}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message-dots">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
                                                    <path d="M12 11l0 .01" />
                                                    <path d="M8 11l0 .01" />
                                                    <path d="M16 11l0 .01" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='flex absolute top-2 right-2 flex-col space-y-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-antenna-bars-1 cursor-pointer" onClick={() => handleChoseToggle(!showChose)}>
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                    <path d="M6 18l0 .01" />
                                                    <path d="M10 18l0 .01" />
                                                    <path d="M14 18l0 .01" />
                                                    <path d="M18 18l0 .01" />
                                                </svg>
                                                {showChose && (
                                                    <div className='flex flex-col space-y-2 absolute top-10 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md'>
                                                        <button onClick={() => handleEditPost(_id)} className='text-sm text-gray-600 hover:text-black p-2 w-full text-left'>Edit</button>
                                                        <button onClick={() => handleDeletePost(_id)} className='text-sm text-gray-600 hover:text-black p-2 w-full text-left'>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                    </div>
                                    <p className='text-center'>{description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {selectedImage && (
                <div className="modal">
                    <div className="modal-background" onClick={handleBackgroundClick}>
                        <div className="modal-content">
                            {/* <div className="more-options">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div> */}
                            <img src={selectedImage.image} alt="Selected Post" className="modal-image" />
                            <p>{selectedImage.caption}</p>
                            <p>{selectedImage.description}</p>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Profile;
