
import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import Button from '../components/Button';
import { Navigate, useNavigate } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                No Posts Yet.
                            </h1>
                            <Button 
                                onClick = {() => navigate('/add-post')}
                            >
                                Add Post
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard post={post} />
                        </div>      
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home
