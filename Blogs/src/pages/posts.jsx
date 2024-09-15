import { useEffect, useState } from 'react';
import axios from 'axios';
import './posts.css';
import Navbar from '../components/navbar';

const Posts = () => {
  const [posts, setPosts] = useState([]); // => must initialize to be used as an array
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        axios
          .get('https://jsonplaceholder.typicode.com/posts')
          .then((response) => {
            setPosts(response.data);
          });
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };
    getPosts();
  }, []);  

  const deletePost = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this post?\n ⚠️This action cannot be undone⚠️'
      )
    ) {
      try {
        setPosts(posts.filter((post) => post.id !== id));
      } catch (error) {
        setError(error);
        console.log(error);
      }
    }
  };

  if (error) return <div>failed to load</div>; // when there is an error in fetching data from api, it will show failed to load
  if (!posts) return <div>loading...</div>; // when data is being fetched from api, it will show loading...

  return (
    <div>
      <Navbar posts={posts} setPosts={setPosts} />
      <div className="grid-container">
        {posts &&
          // shouldn't I not change the state directly? 🤔
          posts.map((post) => {
            return (
              <div className="grid-item" key={post.id}>
                <h1>{post.title}</h1>
                <p>{post.body}</p>
                <div>
                  <button
                    className="delete-button"
                    onClick={() => {
                      deletePost(post.id);
                    }}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Posts;
